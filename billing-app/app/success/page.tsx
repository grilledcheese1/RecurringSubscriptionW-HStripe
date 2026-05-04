export default function Success() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Billing <span className="text-emerald-400">Active</span>
        </h1>

        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
          Recurring billing has been set up successfully.
          <br />
          You&apos;ll receive a confirmation email from Stripe shortly.
        </p>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-left">
          <p className="text-zinc-400 text-xs font-mono tracking-widest uppercase mb-3">What happens next</p>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex gap-2"><span className="text-emerald-400">→</span> Stripe sends a receipt to the billing email</li>
            <li className="flex gap-2"><span className="text-emerald-400">→</span> Your card will be charged on the same date each cycle</li>
            <li className="flex gap-2"><span className="text-emerald-400">→</span> Payouts arrive in your bank account within 2 business days</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
