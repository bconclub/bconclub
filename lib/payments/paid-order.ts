import { Resend } from 'resend';

// What happens when a Razorpay payment is confirmed by its webhook: email the
// team and file the buyer in PROXe as a paid lead, the same place every site
// form lands (see /api/proxe-lead). Mirrors the Dodo webhook's paid handler.
const PROXE_WEBSITE_URL = 'https://proxe.bconclub.com/api/website';
const NOTIFICATION_EMAIL = 'bconclubx@gmail.com';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export interface PaidOrder {
  /** Shown in the lead note and the email, e.g. 'Razorpay'. */
  provider: string;
  paymentId: string;
  dealName: string;
  /** Already formatted, e.g. 'INR 5,000'. */
  amount: string;
  name: string;
  email: string;
  phone: string;
  customerBrand?: string;
}

/** Sends both notices. Resolves to how many of the two went through. */
export async function notifyPaidOrder(o: PaidOrder): Promise<number> {
  const results = await Promise.allSettled([
    fetch(PROXE_WEBSITE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: o.name,
        email: o.email,
        phone: o.phone,
        brand: 'bcon',
        form_type: 'contact',
        service: 'brand-reels',
        service_interest: 'brand-reels',
        message: `PAID ${o.amount} - ${o.dealName} - ${o.provider} payment ${o.paymentId}${o.customerBrand ? ` | Customer brand: ${o.customerBrand}` : ''}`,
        page_url: 'https://bconclub.com/brand-reels',
      }),
      signal: AbortSignal.timeout(10000),
    }).then((r) => { if (!r.ok) throw new Error(`PROXe HTTP ${r.status}`); }),
    (async () => {
      if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');
      const rows = [
        ['Deal', o.dealName], ['Amount', o.amount], ['Name', o.name], ['Email', o.email],
        ['WhatsApp', o.phone], ['Brand', o.customerBrand || '-'], [`${o.provider} payment`, o.paymentId],
      ];
      const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: 'BCON Club <onboarding@resend.dev>',
        to: NOTIFICATION_EMAIL,
        subject: `Paid: ${o.dealName} - ${o.name} (${o.amount})`,
        html: `<div style="font-family:sans-serif"><h2 style="color:#000">New paid order</h2><table cellpadding="6">${rows
          .map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td><b>${esc(String(v))}</b></td></tr>`)
          .join('')}</table><p>Reach out on WhatsApp to take the brief.</p></div>`,
      });
      if (error) throw new Error(error.message);
    })(),
  ]);
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`Paid-order ${i === 0 ? 'PROXe relay' : 'email'} failed:`, r.reason);
  });
  return results.filter((r) => r.status === 'fulfilled').length;
}
