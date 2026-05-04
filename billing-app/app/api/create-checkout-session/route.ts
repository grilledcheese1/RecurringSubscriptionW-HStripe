import { NextResponse } from "next/server";
import Stripe from "stripe";
import { billingConfig } from "@/app/lib/config";

export async function POST() {
  const { mockMode, stripe: stripeConfig, app } = billingConfig;

  // ── Mock mode: site is live but Stripe isn't wired up yet ──────────────
  if (mockMode) {
    return NextResponse.json({
      url: `${app.baseUrl}${app.successPath}?mock=true`,
    });
  }

  // ── Live mode: real Stripe checkout ────────────────────────────────────
  try {
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: "2026-04-22.dahlia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: stripeConfig.priceId, quantity: 1 }],
      success_url: `${app.baseUrl}${app.successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${app.baseUrl}${app.cancelPath}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
