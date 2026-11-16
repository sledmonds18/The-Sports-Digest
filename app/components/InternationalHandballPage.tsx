"use client";

type NationalTeam = {
  name: string;
  flag: string;
};

type GalleryMoment = {
  title: string;
  detail: string;
  image: string;
  alt: string;
  credit: string;
  source: string;
  license: string;
  licenseHref: string;
};

const nationalTeams: NationalTeam[] = [
  { name: "Denmark", flag: "https://www.ihf.info/sites/default/files/2018-12/Denmark.png" },
  { name: "France", flag: "https://www.ihf.info/sites/default/files/2018-12/France.png" },
  { name: "Croatia", flag: "https://www.ihf.info/sites/default/files/2018-12/Croatia.png" },
  { name: "Norway", flag: "https://www.ihf.info/sites/default/files/2018-12/Norway.png" },
  { name: "Germany", flag: "https://www.ihf.info/sites/default/files/2018-12/Germany.png" },
  { name: "Egypt", flag: "https://www.ihf.info/sites/default/files/2018-12/Egypt.png" },
  { name: "Tunisia", flag: "https://www.ihf.info/sites/default/files/2019-06/TUN%20CORRECT%20FLAG.png" },
  { name: "Spain", flag: "https://www.ihf.info/sites/default/files/2018-12/Spain.png" },
  { name: "Brazil", flag: "https://www.ihf.info/sites/default/files/2018-12/Brazil.png" },
  { name: "Japan", flag: "https://www.ihf.info/sites/default/files/2019-01/Japan-1.png" },
  { name: "Serbia", flag: "https://www.ihf.info/sites/default/files/2019-01/serbia.png" },
  { name: "Sweden", flag: "https://www.ihf.info/sites/default/files/2018-12/Sweden.png" },
];

const matchOfficials = [
  {
    role: "Two referees",
    detail: "Work together on the court to apply the rules, manage player conduct and make decisions on goals, fouls and restarts.",
  },
  {
    role: "Timekeeper",
    detail: "Operates the match clock and signals the end of playing time, time-outs and other timing matters.",
  },
  {
    role: "Scorekeeper",
    detail: "Maintains the official scoresheet, recording goals, player entries, suspensions and other match events.",
  },
  {
    role: "IHF delegate",
    detail: "At IHF competitions, supports match organization and monitors that the event and game are conducted in line with regulations.",
  },
];

const matchdayGallery: GalleryMoment[] = [
  {
    title: "World Championship final",
    detail: "Qatar and France meet in the final of the 2015 IHF Men's World Championship.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/2015_World_Men%27s_Handball_Championship_final%2C_Qatar_vs_France.jpg/960px-2015_World_Men%27s_Handball_Championship_final%2C_Qatar_vs_France.jpg",
    alt: "Qatar and France compete in the 2015 Men's Handball World Championship final",
    credit: "Zyzzzzzy",
    source: "https://commons.wikimedia.org/wiki/File:2015_World_Men%27s_Handball_Championship_final,_Qatar_vs_France.jpg",
    license: "CC BY-SA 4.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    title: "Brazil at the World Championship",
    detail: "Brazilian international José Toledo during the 2019 IHF Men's World Championship.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Jose_Toledo_Team_Brazil_Handball_Player_of_the_Match_against_Island_%2847875720271%29.jpg/960px-Jose_Toledo_Team_Brazil_Handball_Player_of_the_Match_against_Island_%2847875720271%29.jpg",
    alt: "Brazilian handball player José Toledo during the 2019 World Championship",
    credit: "dronepicr",
    source: "https://commons.wikimedia.org/wiki/File:Jose_Toledo_Team_Brazil_Handball_Player_of_the_Match_against_Island_(47875720271).jpg",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    title: "Beach handball in international competition",
    detail: "Germany and the Netherlands play a women's test match at the 2022 Beach Handball World Championships.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/2022_Beach_handball_World_Championships_Women_Test_match_GER-NED_12.jpg/960px-2022_Beach_handball_World_Championships_Women_Test_match_GER-NED_12.jpg",
    alt: "Germany and the Netherlands in women's beach handball at the 2022 World Championships",
    credit: "Jörg Gettwart",
    source: "https://commons.wikimedia.org/wiki/File:2022_Beach_handball_World_Championships_Women_Test_match_GER-NED_12.jpg",
    license: "CC BY-SA 3.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
];

const officialSources = [
  { label: "International Handball Federation", href: "https://www.ihf.info/" },
  { label: "IHF competitions", href: "https://www.ihf.info/competitions" },
  { label: "IHF Men's World Championship 2027", href: "https://www.ihf.info/competitions/men/308/30th-ihf-mens-handball-world-championship-2027-germany/263667" },
  { label: "IHF Rules of the Game", href: "https://www.ihf.info/regulations-documents/361" },
  { label: "IHF media centre", href: "https://www.ihf.info/media-center" },
];

export default function InternationalHandballPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative isolate overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950">
        <img
          src="https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/2022_Beach_handball_World_Championships_Women_Test_match_GER-NED_12.jpg/960px-2022_Beach_handball_World_Championships_Women_Test_match_GER-NED_12.jpg"
          alt="Germany and the Netherlands in a women's beach handball match"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_25%,rgba(220,38,38,0.25),transparent_38%)]" />
        <div className="mx-auto grid min-h-[420px] max-w-7xl gap-10 px-4 py-16 sm:px-6 md:min-h-[500px] md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Handball</p>
            <p className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-300"><span className="h-px w-10 bg-red-500" />Around the world</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">International Handball</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">Explore the national teams, formats, officials and competitions shaping handball across the international game.</p>
          </div>
          <div className="flex min-h-48 items-end justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm sm:min-h-56 sm:p-10">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">The global game</p><p className="mt-3 max-w-xs text-sm leading-6 text-gray-200">Fast transitions, technical skill and high-scoring contests on court and sand.</p></div>
            <span aria-hidden="true" className="ml-4 select-none text-right text-4xl font-black italic leading-none text-red-500 sm:text-6xl">HANDBALL</span>
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-5 text-xs text-gray-300 sm:px-6 lg:px-8">
          Hero photo: <a href="https://commons.wikimedia.org/wiki/File:2022_Beach_handball_World_Championships_Women_Test_match_GER-NED_12.jpg" target="_blank" rel="noreferrer" className="underline hover:text-white">Jörg Gettwart · CC BY-SA 3.0</a>
          {" · "}<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer" className="underline hover:text-white">License</a>
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The international game</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">A fast-paced sport with a global stage</h2>
          <p className="mt-5 text-sm leading-7 text-gray-300">Modern team handball developed in Europe and grew into an international sport played by national teams and clubs. Founded in 1946, the International Handball Federation (IHF) organizes world-level competitions and maintains the international rules of the game. Indoor handball is played by seven players per team, with two 30-minute halves at senior level. The sport also has beach and wheelchair formats.</p>
          <a href="https://www.ihf.info/" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Visit the IHF <span aria-hidden="true" className="ml-2">↗</span></a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Indoor handball", detail: "Seven players per side attack and defend on a 40-by-20-metre court, aiming to throw the ball into the opposing goal." },
            { title: "International events", detail: "The IHF stages senior, youth and junior world championships for national teams, alongside Olympic-cycle competition." },
            { title: "Beach handball", detail: "Played on sand, this distinct format uses short periods and points-based scoring that rewards spectacular goals." },
            { title: "A global calendar", detail: "Continental federations, national teams and club competitions create a year-round pathway from regional play to world events." },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <h3 className="text-lg font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">National teams</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-black sm:text-4xl">Countries on the international stage</h2>
            <a href="https://www.ihf.info/competitions/men/308/30th-ihf-mens-handball-world-championship-2027-germany/263667" target="_blank" rel="noreferrer" className="text-sm font-bold text-red-400 hover:text-red-300">Explore the 2027 IHF World Championship ↗</a>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">A selection of national teams drawn from the 2027 IHF Men's World Championship field, representing different handball regions. This is not a complete list of IHF member federations.</p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {nationalTeams.map((team) => (
              <a key={team.name} href="https://www.ihf.info/competitions/men/308/30th-ihf-mens-handball-world-championship-2027-germany/263667" target="_blank" rel="noreferrer" className="group flex min-h-28 items-center gap-4 rounded-2xl border border-white/10 bg-black p-4 transition hover:-translate-y-1 hover:border-red-500/60 hover:bg-zinc-950 sm:p-5">
                <div className="flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white p-2 transition group-hover:scale-105">
                  <img src={team.flag} alt={`${team.name} flag`} loading="lazy" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white sm:text-base">{team.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">IHF World Championship team</p>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">National flags provided by the IHF tournament team directory.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Fair play and match management</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">The match officials</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">Handball match officials work as a team to keep play safe, fair and on schedule. Appointments vary by fixture; these cards explain the roles rather than list officials for a particular event.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {matchOfficials.map((official, index) => (
            <article key={official.role} className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-lg font-black">{official.role}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{official.detail}</p>
            </article>
          ))}
        </div>
        <a href="https://www.ihf.info/regulations-documents/361" target="_blank" rel="noreferrer" className="mt-6 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Read the IHF Rules of the Game <span aria-hidden="true" className="ml-2">↗</span></a>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">International handball in action</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">World Championship intensity, national-team moments and the distinct spectacle of beach handball.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {matchdayGallery.map((moment) => (
              <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-black">
                <div className="overflow-hidden">
                  <img src={moment.image} alt={moment.alt} loading="lazy" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black">{moment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                  <p className="mt-4 text-xs text-gray-500">
                    Photo: <a href={moment.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.credit}</a>
                    {" · "}<a href={moment.licenseHref} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.license}</a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Trusted references</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">Official handball sources</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {officialSources.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-950 p-5 text-sm font-bold text-gray-200 transition hover:border-red-500/50 hover:text-white">
              {source.label}<span aria-hidden="true" className="shrink-0 text-red-500">↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
