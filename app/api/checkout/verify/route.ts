import { NextRequest, NextResponse } from 'next/server';
import { findDeal } from '@/lib/payments/deals';
import { fetchPaymentLink, razorpayConfigured, verifyPaymentLinkCallback } from '@/lib/payments/razorpay';

// Confirms a return from a Razorpay Payment Link. The payment status page
// passes on the razorpay_* query params it was opened with; nothing is called
// paid unless Razorpay's signature over them checks out.
//
// status: 'paid' | 'pending' | 'failed' | 'unverified'
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const callback = {
    razorpay_payment_id: q.get('razorpay_payment_id') || '',
    razorpay_payment_link_id: q.get('razorpay_payment_link_id') || '',
    razorpay_payment_link_reference_id: q.get('razorpay_payment_link_reference_id') || '',
    razorpay_payment_link_status: q.get('razorpay_payment_link_status') || '',
    razorpay_signature: q.get('razorpay_signature') || '',
  };
  const noStore = { 'Cache-Control': 'no-store' };

  if (!razorpayConfigured() || !verifyPaymentLinkCallback(callback)) {
    return NextResponse.json({ status: 'unverified' }, { status: 400, headers: noStore });
  }

  // The signature covers the reference, which starts with the deal ID
  // (see /api/checkout), so the deal shown cannot be swapped either.
  const deal = findDeal(callback.razorpay_payment_link_reference_id.split('.')[0]);
  let linkStatus = callback.razorpay_payment_link_status;
  let fullyPaid = true;
  // Second check against Razorpay itself. If their API cannot be reached, the
  // signed status stands on its own.
  try {
    const link = await fetchPaymentLink(callback.razorpay_payment_link_id);
    linkStatus = link.status;
    fullyPaid = link.amount_paid >= link.amount;
  } catch (error) {
    console.error('Razorpay payment link lookup failed:', error);
  }

  const status =
    linkStatus === 'paid' && fullyPaid ? 'paid'
    : linkStatus === 'expired' || linkStatus === 'cancelled' ? 'failed'
    : 'pending';
  return NextResponse.json(
    { status, deal_id: deal?.id || '', payment_id: callback.razorpay_payment_id },
    { headers: noStore },
  );
}
