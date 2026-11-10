import { NextRequest, NextResponse } from 'next/server';
import { findDeal } from '@/lib/payments/deals';
import { notifyPaidOrder } from '@/lib/payments/paid-order';
import { verifyWebhookSignature } from '@/lib/payments/razorpay';

// Razorpay webhook. In the Razorpay dashboard (Account & Settings → Webhooks)
// add https://bconclub.com/api/webhook/razorpay, set a secret and put the same
// secret in RAZORPAY_WEBHOOK_SECRET. Subscribe to: payment_link.paid,
// payment_link.cancelled, payment_link.expired, payment.failed.
//
// The signature is checked against the raw body before anything else, so a
// paid order here is real. On payment_link.paid we email the team and file the
// buyer in PROXe as a paid lead, exactly like the Dodo webhook does.

// Razorpay can deliver an event more than once. Each delivery of the same
// event carries the same x-razorpay-event-id, so remember the ones handled.
// Kept in memory: the site runs as one PM2 process, and a restart only risks a
// repeat notice for an event Razorpay was still retrying.
const SEEN_TTL_MS = 3 * 24 * 60 * 60 * 1000;
const seenEvents = new Map<string, number>();

const alreadySeen = (eventId: string) => {
  const now = Date.now();
  for (const [id, at] of seenEvents) if (now - at > SEEN_TTL_MS) seenEvents.delete(id);
  if (seenEvents.has(eventId)) return true;
  seenEvents.set(eventId, now);
  return false;
};

type Entity = Record<string, any>;

export async function POST(req: NextRequest) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET?.trim()) {
    console.error('Razorpay webhook: RAZORPAY_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const rawBody = await req.text();
  if (!verifyWebhookSignature(rawBody, req.headers.get('x-razorpay-signature'))) {
    console.warn('Razorpay webhook: bad signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: { event?: string; payload?: Record<string, { entity?: Entity }> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventId = req.headers.get('x-razorpay-event-id') || '';
  if (eventId && alreadySeen(eventId)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const link: Entity = event.payload?.payment_link?.entity || {};
  const payment: Entity = event.payload?.payment?.entity || {};

  switch (event.event) {
    case 'payment_link.paid': {
      const notes: Record<string, string> = link.notes || {};
      const deal = findDeal(notes.deal_id || '');
      const paise = Number(link.amount_paid ?? payment.amount ?? link.amount ?? 0);
      const amount = `${link.currency || payment.currency || 'INR'} ${(paise / 100).toLocaleString('en-IN')}`;
      const paymentId = String(payment.id || link.id || '');
      const dealName = notes.deal_name || deal?.name || link.description || 'Weekend deal';
      const email = link.customer?.email || payment.email || '';
      console.log(`Razorpay payment succeeded: ${paymentId} ${link.id} ${dealName} ${amount} ${email}`);

      const delivered = await notifyPaidOrder({
        provider: 'Razorpay',
        paymentId,
        dealName,
        amount,
        name: notes.customer_name || link.customer?.name || '',
        email,
        phone: notes.phone || link.customer?.contact || payment.contact || '',
        customerBrand: notes.customer_brand || '',
      });
      // If neither notice went out, the team does not know about a paid order:
      // forget the event and answer 500 so Razorpay delivers it again. If one
      // went out, answer 200, since a retry would only duplicate that one.
      if (delivered === 0) {
        if (eventId) seenEvents.delete(eventId);
        return NextResponse.json({ error: 'Could not record the order' }, { status: 500 });
      }
      break;
    }
    case 'payment_link.cancelled':
    case 'payment_link.expired':
      console.warn(`Razorpay ${event.event}: ${link.id} ${link.notes?.deal_id || ''}`);
      break;
    case 'payment.failed':
      console.warn(`Razorpay payment failed: ${payment.id} ${payment.error_code || ''} ${payment.error_description || ''}`);
      break;
    default:
      console.log(`Razorpay webhook: ignored event ${event.event}`);
  }

  return NextResponse.json({ received: true });
}
