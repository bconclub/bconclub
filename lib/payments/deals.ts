// Weekend plan deals sold through Dodo Payments.
//
// The amount actually charged is the price of the Dodo product, set in the
// Dodo dashboard. `price` here is only what the page shows, so keep the two in
// sync. Each deal's Dodo product ID comes from an env var, so test and live
// mode can use different products without a code change.

export interface Deal {
  id: string;
  /** Matches the Brand Reels tier `len`, so the pricing card can find its deal. */
  len: string;
  name: string;
  /** Display price, e.g. '₹5,000'. Must match the Dodo product price. */
  price: string;
  /** Optional struck-through regular price, shown when the deal is a discount. */
  compareAt?: string;
  /** Env var holding the Dodo product ID (pdt_...). */
  productEnv: string;
}

export const WEEKEND_DEALS: Deal[] = [
  { id: 'reel-30s', len: '30s', name: 'The Story · 30s reel', price: '₹5,000', productEnv: 'DODO_PRODUCT_REEL_30S' },
  { id: 'reel-60s', len: '60s', name: 'The Film · 60s reel', price: '₹10,000', productEnv: 'DODO_PRODUCT_REEL_60S' },
];

export const findDeal = (id: string) => WEEKEND_DEALS.find((d) => d.id === id);

/** Server only: the Dodo product ID for a deal, or '' when it isn't configured. */
export const dealProductId = (deal: Deal) => process.env[deal.productEnv]?.trim() || '';
