"use client";

import InternationalSportsNews from "./InternationalSportsNews";

export default function InternationalSportsNewsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · International</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">International Sports News</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">Follow the latest stories across the Premier League, Champions League, Europe’s top leagues, MLS, FIFA and UEFA. Every story is reviewed by our editorial desk before it goes live.</p>
        </div>
      </section>

      <InternationalSportsNews category="All International" />

      <section className="border-t border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h3 className="font-bold text-white">The Sports Digest · International Sports Desk</h3>
            <p className="mt-1 text-xs text-gray-500">International football news, reviewed by our editorial team before publication.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">The Sports Digest</p>
            <h2 className="mt-2 text-2xl font-black">Where Sport Meets Story.</h2>
          </div>
          <button type="button" onClick={() => onNavigate("home")} className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold transition hover:bg-white/10">← Back to Home</button>
        </div>
      </section>
    </main>
  );
}
