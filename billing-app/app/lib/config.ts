/**
 * Billing configuration — single source of truth.
 *
 * In mock mode (no Stripe keys set), the checkout API returns a fake
 * success URL so the frontend works and the site stays live.
 * Once you add real env vars in Vercel, flip BILLING_MOCK_MODE to "false".
 */

export const billingConfig = {
  // ─── Toggle this to false after you add real Stripe keys in Vercel ───
  mockMode: process.env.BILLING_MOCK_MODE !== "false",

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    priceId: process.env.STRIPE_PRICE_ID ?? "",
  },

  app: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    successPath: "/success",
    cancelPath: "/",
  },

  // ─── Displayed on the frontend billing card ───────────────────────────
  rental: {
    label: "Equipment Rental Fee",
    cycle: "Monthly",
    processingFee: "2.9% + $0.30",
  },
};
