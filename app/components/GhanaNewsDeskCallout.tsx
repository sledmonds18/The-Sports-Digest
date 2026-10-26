"use client";

export default function GhanaNewsDeskCallout({
  topic,
  currentPage,
  onNavigate,
}: {
  topic: string;
  currentPage: string;
  onNavigate: (page: string) => void;
}) {
  const relatedSections = [
    { page: "ghana-premier-league", label: "Ghana Premier League" },
    { page: "black-stars", label: "Black Stars" },
    { page: "black-queens", label: "Black Queens" },
    { page: "ghana-fa-cup", label: "Ghana FA Cup" },
    { page: "division-one", label: "Division One League" },
  ].filter((section) => section.page !== currentPage);
  const officialSources: Record<string, { label: string; href: string }[]> = {
    "ghana-premier-league": [
      { label: "Ghana Premier League profile", href: "https://www.ghanafa.org/premier-league-profile" },
      { label: "Premier League news, fixtures and table", href: "https://www.ghanafa.org/category/premier-league" },
      { label: "Ghana Football Association", href: "https://www.ghanafa.org/" },
    ],
    "black-stars": [
      { label: "Black Stars team page", href: "https://www.ghanafa.org/black-stars" },
      { label: "Black Stars news and updates", href: "https://www.ghanafa.org/category/black-stars" },
      { label: "Ghana Football Association", href: "https://www.ghanafa.org/" },
    ],
    "black-queens": [
      { label: "Black Queens team page", href: "https://www.ghanafa.org/black-queens" },
      { label: "National teams news and updates", href: "https://www.ghanafa.org/category/national-teams" },
      { label: "Ghana Football Association", href: "https://www.ghanafa.org/" },
    ],
    "ghana-fa-cup": [
      { label: "FA Cup profile", href: "https://www.ghanafa.org/fa-cup-profile" },
      { label: "FA Cup news and updates", href: "https://www.ghanafa.org/category/fa-cup" },
      { label: "Ghana Football Association", href: "https://www.ghanafa.org/" },
    ],
    "division-one": [
      { label: "Division One League profile", href: "https://www.ghanafa.org/division-one-profile" },
      { label: "Ghana Football Association", href: "https://www.ghanafa.org/" },
      { label: "GFA regulations and competitions", href: "https://www.ghanafa.org/about-ghana-football-association" },
    ],
  }[currentPage] ?? [{ label: "Ghana Football Association", href: "https://www.ghanafa.org/" }];

  return (
    <>
      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Official sources</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Explore {topic}</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {officialSources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black p-5 transition hover:border-red-500/60"
              >
                <span className="text-sm font-bold leading-6 text-gray-200 group-hover:text-white">{source.label}</span>
                <span aria-hidden="true" className="shrink-0 text-lg text-red-500 transition group-hover:translate-x-1">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">More Ghana football</p>
          <h2 className="mt-3 text-2xl font-black">Explore related competitions</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {relatedSections.map((section) => (
              <button
                key={section.page}
                type="button"
                onClick={() => onNavigate(section.page)}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-gray-300 transition hover:border-red-500 hover:text-white"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The Ghana Sports News desk</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Latest {topic} stories</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">News and match updates are published in the dedicated Ghana news desk.</p>
          </div>
          <button type="button" onClick={() => onNavigate("ghana-sports")} className="shrink-0 rounded-xl bg-red-600 px-5 py-3 text-sm font-black transition hover:bg-red-700">
            Go to Ghana Sports News<span aria-hidden="true" className="ml-2">→</span>
          </button>
        </div>
      </section>
    </>
  );
}
