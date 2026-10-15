'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { findDeal } from '@/lib/payments/deals';
import './status.css';

// Dodo Payments sends buyers back here with ?status=...&payment_id=...
// The paid order itself is recorded by the webhook; this page only tells the
// buyer what happened and fires the Purchase conversion.
function PaymentStatus() {
  const params = useSearchParams();
  const status = params.get('status') || '';
  const paymentId = params.get('payment_id') || '';
  const deal = findDeal(params.get('deal') || '');
  const paid = status === 'succeeded';
  const pending = status === 'processing' || status === 'requires_customer_action';

  useEffect(() => {
    if (!paid || typeof window === 'undefined') return;
    // Fire once per payment, even if the buyer reloads the page.
    const key = `purchase_tracked_${paymentId}`;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch {}
    const value = deal ? Number(deal.price.replace(/[^\d]/g, '')) : undefined;
    const w = window as any;
    w.fbq?.('track', 'Purchase', { content_name: deal?.name || 'Weekend deal', value, currency: 'INR' });
    w.dataLayer?.push({ event: 'purchase', deal: deal?.id || '', value, currency: 'INR', payment_id: paymentId });
  }, [paid, paymentId, deal]);

  return (
    <main className="pay-status">
      <div className="pay-card">
        <img src="/BCON%20icon.png" alt="BCON Club" width={56} height={56} />
        {paid ? (
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
        <Link className="pay-btn" href={paid || pending ? '/' : '/brand-reels#pricing'}>
          {paid || pending ? 'Back to BCON Club' : 'Try again'}
        </Link>
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
