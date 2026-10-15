import { NextRequest, NextResponse } from 'next/server';
import { Webhooks } from '@dodopayments/nextjs';
import { Resend } from 'resend';

// Dodo Payments webhook. Point the Dodo dashboard (Developer → Webhooks) at
// https://bconclub.com/api/webhook/dodo-payments and put its signing secret in
// DODO_PAYMENTS_WEBHOOK_KEY. The adaptor verifies the signature before any
// handler runs, so a paid order here is real.
//
// On a successful payment we email the team and file the buyer in PROXe as a
// paid lead, the same place every site form lands (see /api/proxe-lead).
const PROXE_WEBSITE_URL = 'https://proxe.bconclub.com/api/website';
const NOTIFICATION_EMAIL = 'bconclubx@gmail.com';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Built on first request, not at import: the adaptor throws on an empty
// secret, which would otherwise fail the whole build when the key isn't set.
let handler: ReturnType<typeof Webhooks> | null = null;

export async function POST(req: NextRequest) {
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!webhookKey) {
    console.error('Dodo webhook: DODO_PAYMENTS_WEBHOOK_KEY is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }
  handler ??= createHandler(webhookKey);
  return handler(req);
}

const createHandler = (webhookKey: string) => Webhooks({
  webhookKey,
  onPaymentSucceeded: async (payload) => {
    const p = payload.data;
    const meta = (p.metadata || {}) as Record<string, string>;
    const name = p.customer?.name || '';
    const email = p.customer?.email || '';
    const phone = meta.phone || '';
    const dealName = meta.deal_name || meta.deal_id || 'Weekend deal';
    // Dodo amounts are in the smallest unit (paise for INR).
    const amount = `${p.currency} ${(p.total_amount / 100).toLocaleString('en-IN')}`;
    console.log(`Dodo payment succeeded: ${p.payment_id} ${dealName} ${amount} ${email}`);

    const results = await Promise.allSettled([
      fetch(PROXE_WEBSITE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          brand: 'bcon',
          form_type: 'contact',
          service: 'brand-reels',
          service_interest: 'brand-reels',
          message: `PAID ${amount} - ${dealName} - Dodo payment ${p.payment_id}${meta.customer_brand ? ` | Customer brand: ${meta.customer_brand}` : ''}`,
          page_url: 'https://bconclub.com/brand-reels',
        }),
        signal: AbortSignal.timeout(10000),
      }).then((r) => { if (!r.ok) throw new Error(`PROXe HTTP ${r.status}`); }),
      (async () => {
        if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');
        const rows = [
          ['Deal', dealName], ['Amount', amount], ['Name', name], ['Email', email],
          ['WhatsApp', phone], ['Brand', meta.customer_brand || '-'], ['Dodo payment', p.payment_id],
        ];
        const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: 'BCON Club <onboarding@resend.dev>',
          to: NOTIFICATION_EMAIL,
          subject: `Paid: ${dealName} - ${name} (${amount})`,
          html: `<div style="font-family:sans-serif"><h2 style="color:#000">New paid order</h2><table cellpadding="6">${rows
            .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${esc(String(v))}</b></td></tr>`)
            .join('')}</table><p>Reach out on WhatsApp to take the brief.</p></div>`,
        });
        if (error) throw new Error(error.message);
      })(),
    ]);
    // Log and still return 200: the payment is done, and a Dodo retry would
    // only duplicate whichever notification did go through.
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`Paid-order ${i === 0 ? 'PROXe relay' : 'email'} failed:`, r.reason);
    });
  },
  onPaymentFailed: async (payload) => {
    console.warn(`Dodo payment failed: ${payload.data.payment_id}`);
  },
});
