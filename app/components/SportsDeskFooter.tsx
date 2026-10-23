"use client";

export default function SportsDeskFooter({ desk, description, onNavigate }: { desk: string; description: string; onNavigate: (page: string) => void }) {
  return (
    <>
      <section className="border-t border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h3 className="font-bold text-white">The Sports Digest · {desk}</h3>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
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
    </>
  );
}
