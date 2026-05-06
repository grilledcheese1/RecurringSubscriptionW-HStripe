"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../icon.png";
import { NavAuthButton } from "@/app/components/NavAuthButton";

// ── Plan metadata ─────────────────────────────────────────────────────────────
const PLANS: Record<string, {
  label: string; price: string; unit: string;
  savings: string | null; description: string; features: string[];
}> = {
  monthly: {
    label: "Monthly",
    price: "$299",
    unit: "/ mo",
    savings: null,
    description: "Flexible month-to-month. Cancel anytime.",
    features: ["1 piece of equipment", "Standard support (M–F)", "Delivery & pickup included", "Monthly equipment swap", "No long-term commitment"],
  },
  "two-month": {
    label: "2-Month",
    price: "$539",
    unit: "total",
    savings: "Save 10%",
    description: "Short-term coverage for defined project phases.",
    features: ["1 piece of equipment", "Priority support", "Delivery & pickup included", "One free equipment swap", "Project coordination check-in"],
  },
  "six-month": {
    label: "6-Month",
    price: "$1,439",
    unit: "total",
    savings: "Save 20%",
    description: "Mid-range coverage with expanded equipment access.",
    features: ["Up to 2 pieces of equipment", "Priority support (7 days)", "Delivery & pickup included", "Free mid-term maintenance check", "Dedicated account rep", "Two free swaps"],
  },
  annual: {
    label: "1-Year",
    price: "$2,519",
    unit: "total",
    savings: "Save 30%",
    description: "Full project lifecycle at the lowest rate.",
    features: ["Up to 3 pieces of equipment", "24/7 priority support", "Delivery & pickup included", "Quarterly maintenance included", "Dedicated account manager", "Unlimited swaps", "Fuel assistance on select units"],
  },
};

// ── Inner component (uses useSearchParams) ────────────────────────────────────
function BillingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const planId = searchParams.get("plan") ?? "monthly";
  const productName = searchParams.get("productName") ?? "Equipment";
  const plan = PLANS[planId] ?? PLANS.monthly;

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#faf9f5" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src={logo} alt="PowerDillo logo" width={54} height={54} className="rounded-md" />
            <span className="text-gray-900 text-2xl font-bold tracking-tight">
              Power<span className="text-orange-500">Dillo</span>
            </span>
          </Link>
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden sm:flex items-center gap-8 text-sm text-gray-600">
              <button
                onClick={() => router.back()}
                className="font-extrabold hover:text-orange-500 transition-colors"
              >
                ← Back to Rentals
              </button>
            </div>
          </div>
          <div className="pl-20">
            <NavAuthButton fallbackLabel="Log In" fallbackHref="/login" />
          </div>
        </div>
      </nav>

      {/* ── Dark header ──────────────────────────────────────────────────────── */}
      <section className="bg-[#141413] text-white py-12 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs font-mono tracking-widest uppercase text-orange-500 mb-3">Secure Checkout</p>
          <h1
            className="text-4xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "'Poppins','Arial',sans-serif" }}
          >
            Complete Your Rental
          </h1>
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lora','Georgia',serif" }}>
            {productName} — {plan.label} term
          </p>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <p className="text-xs font-mono tracking-widest uppercase text-orange-500 mb-5">Order Summary</p>

            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2
                  className="text-xl font-bold text-[#141413] mb-1"
                  style={{ fontFamily: "'Poppins','Arial',sans-serif" }}
                >
                  {productName}
                </h2>
                <p className="text-sm text-gray-500" style={{ fontFamily: "'Lora','Georgia',serif" }}>
                  {plan.description}
                </p>
                {plan.savings && (
                  <span className="inline-block mt-2 text-xs font-semibold text-[#788c5d] bg-[#788c5d]/10 px-2.5 py-0.5 rounded-full">
                    {plan.savings}
                  </span>
                )}
              </div>
              <div className="text-right shrink-0 ml-4">
                <span
                  className="text-3xl font-bold text-[#141413]"
                  style={{ fontFamily: "'Poppins','Arial',sans-serif" }}
                >
                  {plan.price}
                </span>
                <span className="text-gray-400 text-xs block">{plan.unit}</span>
              </div>
            </div>

            <p className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-3">What&apos;s Included</p>
            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600" style={{ fontFamily: "'Lora','Georgia',serif" }}>
                  <svg className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <div className="pt-5 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500" style={{ fontFamily: "'Lora','Georgia',serif" }}>Processing fee</span>
              <span className="text-[#141413] font-medium">2.9% + $0.30</span>
            </div>
          </div>

          {/* Payment panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <p className="text-xs font-mono tracking-widest uppercase text-orange-500 mb-5">Payment</p>
            <h2
              className="text-xl font-bold text-[#141413] mb-2"
              style={{ fontFamily: "'Poppins','Arial',sans-serif" }}
            >
              Stripe Secure Checkout
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed" style={{ fontFamily: "'Lora','Georgia',serif" }}>
              You&apos;ll be redirected to Stripe&apos;s secure payment page to complete your rental setup. Your card details are never stored on our servers.
            </p>

            <div className="flex items-center gap-3 bg-[#faf9f5] border border-gray-100 rounded-xl p-4 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#788c5d] animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#141413]">{plan.label} Rental — {productName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{plan.price} {plan.unit}</p>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-5 text-center bg-red-50 rounded-xl p-3 border border-red-100">
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white font-semibold py-4 rounded-xl transition-all duration-200 text-sm tracking-wide cursor-pointer disabled:cursor-not-allowed"
              style={{ fontFamily: "'Poppins','Arial',sans-serif" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Redirecting to Stripe...
                </span>
              ) : (
                "Proceed to Payment →"
              )}
            </button>

            <p className="text-center text-gray-400 text-xs mt-4" style={{ fontFamily: "'Lora','Georgia',serif" }}>
              Secured by Stripe · 256-bit encryption
            </p>
          </div>

        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#141413] text-gray-500 py-10 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 text-xs text-center">
          <span className="text-white font-bold text-base tracking-tight">
            Power<span className="text-orange-500">Dillo</span>
          </span>
          <span>IT Construction · Subcontracting · Equipment Rental</span>
          <span className="text-gray-600 mt-1">© {new Date().getFullYear()} PowerDillo. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}

// ── Page (Suspense boundary for useSearchParams) ──────────────────────────────
export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#faf9f5" }}>
        <div className="w-6 h-6 rounded-full border-2 border-[#d97757] border-t-transparent animate-spin" />
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
