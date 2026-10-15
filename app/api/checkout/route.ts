import { NextRequest, NextResponse } from 'next/server';
import { findDeal, dealProductId } from '@/lib/payments/deals';
import { getDodo } from '@/lib/payments/dodo';

// Starts a Dodo Payments checkout for a weekend deal.
// The browser sends a deal ID, never a product ID or amount, so the price can
// only be one we configured. Responds with the hosted checkout URL.
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
  const productId = dealProductId(deal);
  if (!productId) {
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
