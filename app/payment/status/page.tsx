'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { findDeal } from '@/lib/payments/deals';
import './status.css';

// Buyers land here after paying.
// - Razorpay adds ?razorpay_payment_link_id=...&razorpay_signature=... and
//   nothing here is trusted until /api/checkout/verify has checked the
//   signature on the server.
// - Dodo Payments adds ?status=...&payment_id=... (and our own ?deal=...).
// The paid order itself is recorded by the provider's webhook; this page only
// tells the buyer what happened and fires the Purchase conversion.
type Verified = { status: 'paid' | 'pending' | 'failed' | 'unverified'; deal_id?: string; payment_id?: string };

function PaymentStatus() {
  const params = useSearchParams();
  const viaRazorpay = params.has('razorpay_payment_link_id');
  const query = params.toString();
  const [verified, setVerified] = useState<Verified | null>(null);

  useEffect(() => {
    if (!viaRazorpay) return;
    let cancelled = false;
    fetch(`/api/checkout/verify?${query}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: Verified) => { if (!cancelled) setVerified(d?.status ? d : { status: 'unverified' }); })
      .catch(() => { if (!cancelled) setVerified({ status: 'unverified' }); });
    return () => { cancelled = true; };
  }, [viaRazorpay, query]);

  const status = viaRazorpay ? '' : params.get('status') || '';
  const paymentId = viaRazorpay ? verified?.payment_id || '' : params.get('payment_id') || '';
  const deal = findDeal(viaRazorpay ? verified?.deal_id || '' : params.get('deal') || '');
  const checking = viaRazorpay && !verified;
  const unverified = viaRazorpay && verified?.status === 'unverified';
  const paid = viaRazorpay ? verified?.status === 'paid' : status === 'succeeded';
  const pending = viaRazorpay
    ? verified?.status === 'pending'
    : status === 'processing' || status === 'requires_customer_action';

  useEffect(() => {
    if (!paid || typeof window === 'undefined') return;
    // Fire once per payment, even if the buyer reloads the page.
    const key = `purchase_tracked_${paymentId}`;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch {}
    const value = deal ? deal.amountPaise / 100 : undefined;
    const w = window as any;
    w.fbq?.('track', 'Purchase', { content_name: deal?.name || 'Weekend deal', value, currency: 'INR' });
    w.dataLayer?.push({ event: 'purchase', deal: deal?.id || '', value, currency: 'INR', payment_id: paymentId });
  }, [paid, paymentId, deal]);

  return (
    <main className="pay-status">
      <div className="pay-card">
        <img src="/BCON%20icon.png" alt="BCON Club" width={56} height={56} />
        {checking ? (
          <>
            <h1>Confirming your payment.</h1>
            <p>This takes a few seconds. Please keep this page open.</p>
          </>
        ) : unverified ? (
          <>
            <h1>We couldn&apos;t confirm this payment.</h1>
            <p>If money left your account, it is safe and we&apos;ll message you on WhatsApp once it shows on our side. Otherwise you can try again.</p>
          </>
        ) : paid ? (
          <>
            <h1>Payment received.</h1>
            <p>{deal ? `${deal.name}, ${deal.price}. ` : ''}We&apos;ll message you on WhatsApp shortly to take your brief.</p>
          </>
        ) : pending ? (
          <>
            <h1>Payment processing.</h1>
            <p>Your bank is still confirming the payment. We&apos;ll message you on WhatsApp as soon as it clears.</p>
          </>
        ) : (
          <>
            <h1>Payment not completed.</h1>
            <p>No money was taken. You can try again, or message us on WhatsApp and we&apos;ll help.</p>
          </>
        )}
        {paymentId && <small>Payment ID: {paymentId}</small>}
        {!checking && (
          <Link className="pay-btn" href={paid || pending ? '/' : '/brand-reels#pricing'}>
            {paid || pending ? 'Back to BCON Club' : 'Try again'}
          </Link>
        )}
      </div>
    </main>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<main className="pay-status" />}>
      <PaymentStatus />
    </Suspense>
  );
}
