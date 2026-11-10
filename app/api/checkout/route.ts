import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { findDeal, dealProductId } from '@/lib/payments/deals';
import { getDodo } from '@/lib/payments/dodo';
import { createPaymentLink, razorpayConfigured } from '@/lib/payments/razorpay';

// Starts a checkout for a weekend deal: a Razorpay Payment Link when the
// Razorpay keys are set, otherwise a Dodo Payments checkout session.
// The browser sends a deal ID, never a product ID or amount, so the price can
// only be one we configured. Responds with the hosted checkout URL.

// Tells the page which provider it will be sent to, for the note on the form.
export async function GET() {
  return NextResponse.json(
    { provider: razorpayConfigured() ? 'razorpay' : 'dodo' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const deal = findDeal(str(body.dealId));
  if (!deal) {
    return NextResponse.json({ error: 'Unknown deal' }, { status: 400 });
  }
  const useRazorpay = razorpayConfigured();
  const productId = useRazorpay ? '' : dealProductId(deal);
  if (!useRazorpay && !productId) {
    console.error(`Checkout: ${deal.productEnv} is not set`);
    return NextResponse.json({ error: 'This deal is not available right now' }, { status: 503 });
  }

  const name = str(body.name);
  const email = str(body.email);
  const brand = str(body.brand);
  const digits = str(body.phone).replace(/\D/g, '').slice(-10);
  if (!name) return NextResponse.json({ error: 'Please enter your name' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 });
  if (digits.length !== 10) return NextResponse.json({ error: 'Please enter a valid 10 digit WhatsApp number' }, { status: 400 });
  const phone = `+91${digits}`;

  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || request.nextUrl.origin;

  if (useRazorpay) {
    try {
      const link = await createPaymentLink({
        amount: deal.amountPaise,
        currency: 'INR',
        description: deal.name,
        // Starts with the deal ID so the status page knows the deal from the
        // signed callback alone. Unique per link, 40 characters at most.
        reference_id: `${deal.id}.${randomBytes(8).toString('hex')}`,
        customer: { name, email, contact: phone },
        // Read back by the webhook to file the order with its brief details.
        // Razorpay allows 256 characters per note.
        notes: {
          deal_id: deal.id,
          deal_name: deal.name,
          source: 'brand-reels',
          customer_name: name.slice(0, 250),
          customer_brand: brand.slice(0, 250),
          phone,
        },
        // No query string of our own: Razorpay adds its razorpay_* params.
        callback_url: `${origin}/payment/status`,
        // An abandoned link stops working after a day.
        expire_by: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      });
      if (!link.short_url) throw new Error(`No short_url for payment link ${link.id}`);
      return NextResponse.json({ checkout_url: link.short_url });
    } catch (error) {
      console.error('Razorpay payment link failed:', error);
      return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 502 });
    }
  }

  try {
    const session = await getDodo().checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email, name, phone_number: phone },
      billing_address: { country: 'IN' },
      return_url: `${origin}/payment/status?deal=${deal.id}`,
      // Read back by the webhook to file the order with its brief details.
      metadata: { deal_id: deal.id, deal_name: deal.name, customer_brand: brand, phone },
    });
    if (!session.checkout_url) throw new Error(`No checkout_url for session ${session.session_id}`);
    return NextResponse.json({ checkout_url: session.checkout_url });
  } catch (error) {
    console.error('Dodo checkout session failed:', error);
    return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 502 });
  }
}
