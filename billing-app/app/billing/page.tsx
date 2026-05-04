"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
      });
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
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        <div className="flex justify-center mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/70 border border-amber-500/20 px-4 py-1.5 rounded-full font-mono">
            Recurring Billing Portal
          </span>
        </div>

        <h1
          className="text-5xl font-bold text-center mb-3 leading-tight"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Equipment
          <br />
          <span className="text-amber-400">Rental Invoice</span>
        </h1>

        <p className="text-center text-zinc-500 text-sm mb-12 leading-relaxed">
          Secure recurring billing for authorized equipment rentals.
          <br />
          Payments processed via Stripe.
        </p>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-400 text-sm font-mono">BILLING CYCLE</span>
            <span className="text-zinc-400 text-sm font-mono">STATUS</span>
          </div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-white font-semibold">Monthly</span>
            <span className="text-emerald-400 text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Authorized
            </span>
          </div>

          <div className="border-t border-zinc-800 mb-8 pt-6">
            <div className="flex justify-between text-sm text-zinc-500 mb-2">
              <span>Equipment rental fee</span>
              <span className="text-white">See Stripe dashboard</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Processing fee</span>
              <span className="text-white">2.9% + $0.30</span>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center bg-red-400/10 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/40 text-black font-semibold py-4 rounded-xl transition-all duration-200 text-sm tracking-wide cursor-pointer disabled:cursor-not-allowed"
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
              "Set Up Recurring Payment →"
            )}
          </button>

          <p className="text-center text-zinc-600 text-xs mt-4">
            You&apos;ll be redirected to Stripe&apos;s secure checkout
          </p>
        </div>

        <p className="text-center text-zinc-700 text-xs mt-8 font-mono">
          SECURED BY STRIPE · 256-BIT ENCRYPTION
        </p>
      </div>
    </main>
  );
}
