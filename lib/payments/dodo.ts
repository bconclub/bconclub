import DodoPayments from 'dodopayments';

// Server-only Dodo Payments client. DODO_PAYMENTS_ENVIRONMENT is 'test_mode'
// or 'live_mode'; anything else falls back to test so a missing var can never
// take real money by accident.
export const dodoEnvironment = (): 'test_mode' | 'live_mode' =>
  process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode';

export const getDodo = () => {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) throw new Error('DODO_PAYMENTS_API_KEY is not configured');
  return new DodoPayments({ bearerToken, environment: dodoEnvironment() });
};
