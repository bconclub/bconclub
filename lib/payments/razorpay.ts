import { createHmac, timingSafeEqual } from 'node:crypto';

// Server-only Razorpay client: plain REST over fetch, no SDK.
// Keys come from RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET (Razorpay dashboard →
// Account & Settings → API keys). A test key (rzp_test_...) takes no real
// money; a live key (rzp_live_...) does. Never import this from a client file.

const API = 'https://api.razorpay.com/v1';

/** True when both API keys are set. Checkout uses Razorpay only then. */
export const razorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID?.trim() && process.env.RAZORPAY_KEY_SECRET?.trim());

const credentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) throw new Error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not configured');
  return { keyId, keySecret };
};

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const { keyId, keySecret } = credentials();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`Razorpay ${method} ${path} failed: HTTP ${res.status} ${data?.error?.description || ''}`.trim());
  }
  return data as T;
}

export type PaymentLinkStatus = 'created' | 'partially_paid' | 'expired' | 'cancelled' | 'paid';

export interface PaymentLink {
  id: string;
  short_url: string;
  status: PaymentLinkStatus;
  /** Smallest currency unit (paise for INR). */
  amount: number;
  amount_paid: number;
  currency: string;
  description?: string | null;
  reference_id?: string | null;
  notes?: Record<string, string> | null;
  customer?: { name?: string; email?: string; contact?: string } | null;
  payments?: { payment_id: string; amount: number; status: string; method?: string }[] | null;
}

export interface CreatePaymentLinkInput {
  /** Smallest currency unit (paise for INR). */
  amount: number;
  currency: string;
  description: string;
  /** Our own unique reference, max 40 characters. Signed into the callback. */
  reference_id: string;
  customer?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  /** Buyer is sent here (GET) after paying, with razorpay_* query params. */
  callback_url: string;
  /** Unix seconds. Must be at least 15 minutes ahead. */
  expire_by?: number;
}

export const createPaymentLink = (input: CreatePaymentLinkInput) =>
  call<PaymentLink>('POST', '/payment_links', {
    ...input,
    accept_partial: false,
    callback_method: 'get',
    // The buyer is redirected to the link straight away, so Razorpay does not
    // also need to text or email it to them.
    notify: { sms: false, email: false },
    reminder_enable: false,
  });

export const fetchPaymentLink = (id: string) =>
  call<PaymentLink>('GET', `/payment_links/${encodeURIComponent(id)}`);

// ── Signatures ───────────────────────────────────────────────────────────

const hmacHex = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('hex');

/** Constant-time check of a hex HMAC-SHA256 signature. */
const signatureMatches = (payload: string, signature: string, secret: string) => {
  if (!secret || !/^[0-9a-f]{64}$/i.test(signature)) return false;
  const expected = Buffer.from(hmacHex(payload, secret), 'hex');
  const given = Buffer.from(signature, 'hex');
  return expected.length === given.length && timingSafeEqual(expected, given);
};

export interface PaymentLinkCallback {
  razorpay_payment_id: string;
  razorpay_payment_link_id: string;
  razorpay_payment_link_reference_id: string;
  razorpay_payment_link_status: string;
  razorpay_signature: string;
}

/**
 * Verifies the query params Razorpay adds to the callback URL after a Payment
 * Link is paid. The signature is HMAC-SHA256, keyed with the API key secret, of
 * `payment_link_id|payment_link_reference_id|payment_link_status|payment_id`.
 */
export const verifyPaymentLinkCallback = (
  p: PaymentLinkCallback,
  keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || '',
) =>
  Boolean(p.razorpay_payment_link_id && p.razorpay_payment_id) &&
  signatureMatches(
    [p.razorpay_payment_link_id, p.razorpay_payment_link_reference_id, p.razorpay_payment_link_status, p.razorpay_payment_id].join('|'),
    p.razorpay_signature,
    keySecret,
  );

/**
 * Verifies a webhook: HMAC-SHA256 of the RAW request body, keyed with the
 * webhook secret, against the X-Razorpay-Signature header. Pass the body
 * exactly as received, never a re-serialised object.
 */
export const verifyWebhookSignature = (
  rawBody: string,
  signature: string | null | undefined,
  webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() || '',
) => signatureMatches(rawBody, signature || '', webhookSecret);
