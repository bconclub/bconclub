// Weekend plan deals, sold through Razorpay (or Dodo Payments as the fallback).
//
// `amountPaise` is the price. With Razorpay it is the amount actually charged,
// and the display price is built from it, so the two cannot drift.
// With Dodo the amount charged is the price of the Dodo product, set in the
// Dodo dashboard, so keep that product's price equal to `amountPaise`. Each
// deal's Dodo product ID comes from an env var, so test and live mode can use
// different products without a code change.

export interface Deal {
  id: string;
  /** Matches the Brand Reels tier `len`, so the pricing card can find its deal. */
  len: string;
  name: string;
  /** What the buyer pays, in paise (500000 = ₹5,000). No tax is added on top. */
  amountPaise: number;
  /** Display price, e.g. '₹5,000'. Built from `amountPaise`. */
  price: string;
  /** Optional struck-through regular price, shown when the deal is a discount. */
  compareAt?: string;
  /** Env var holding the Dodo product ID (pdt_...). */
  productEnv: string;
}

/** 500000 → '₹5,000' */
export const formatInr = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

const deal = (d: Omit<Deal, 'price'>): Deal => ({ ...d, price: formatInr(d.amountPaise) });

export const WEEKEND_DEALS: Deal[] = [
  deal({ id: 'reel-30s', len: '30s', name: 'The Story · 30s reel', amountPaise: 500000, productEnv: 'DODO_PRODUCT_REEL_30S' }),
  deal({ id: 'reel-60s', len: '60s', name: 'The Film · 60s reel', amountPaise: 1000000, productEnv: 'DODO_PRODUCT_REEL_60S' }),
];

export const findDeal = (id: string) => WEEKEND_DEALS.find((d) => d.id === id);

/** Server only: the Dodo product ID for a deal, or '' when it isn't configured. */
export const dealProductId = (deal: Deal) => process.env[deal.productEnv]?.trim() || '';
