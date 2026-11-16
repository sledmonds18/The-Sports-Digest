"use client";

type FullMember = {
  name: string;
  image: string;
  profile: string;
};

type GalleryImage = {
  title: string;
  detail: string;
  image: string;
  alt: string;
  credit: string;
  source: string;
};

const fullMembers: FullMember[] = [
  { name: "Afghanistan", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/iwjk0vb7agpa7tyhuzea", profile: "https://www.icc-cricket.com/teams/1188/afghanistan/" },
  { name: "Australia", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/h5apsohhlfsn9ydrivoe", profile: "https://www.icc-cricket.com/teams/1/australia/" },
  { name: "Bangladesh", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/jxmhkysemy0gkkmjwmct", profile: "https://www.icc-cricket.com/teams/2/bangladesh/" },
  { name: "England", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/pnintojotbm9ll60cczx", profile: "https://www.icc-cricket.com/teams/3/england/" },
  { name: "India", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/neu91cc4x40lphf6ubgh", profile: "https://www.icc-cricket.com/teams/4/india/" },
  { name: "Ireland", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/j5p9gymd8zwbdt102sta", profile: "https://www.icc-cricket.com/teams/13/ireland/" },
  { name: "New Zealand", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/ftjoqz45fxlacmrej5oc", profile: "https://www.icc-cricket.com/teams/5/new-zealand/" },
  { name: "Pakistan", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/iexljg3x5le23ts9xmwl", profile: "https://www.icc-cricket.com/teams/6/pakistan/" },
  { name: "South Africa", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/kaefiv6vudqhj1vbqq0h", profile: "https://www.icc-cricket.com/teams/7/south-africa/" },
  { name: "Sri Lanka", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/jb2iqj3djs8g2jbv25nm", profile: "https://www.icc-cricket.com/teams/8/sri-lanka/" },
  { name: "West Indies", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/vvn4mghhobtwnb2cv7yi", profile: "https://www.icc-cricket.com/teams/9/west-indies/" },
  { name: "Zimbabwe", image: "https://images.icc-cricket.com/image/upload/t_q-best/prd/vz1jpphfrjvbuowwrrtt", profile: "https://www.icc-cricket.com/teams/10/zimbabwe/" },
];

const matchOfficials = [
  {
    role: "On-field umpires",
    detail: "Apply the Laws of Cricket and the competition's playing conditions, manage the match on the field and make decisions on each delivery.",
  },
  {
    role: "Third umpire",
    detail: "Reviews referrals and replay-based decisions from the television umpire's position, using the technology available for that match.",
  },
  {
    role: "Match referee",
    detail: "Oversees the conduct of the match, handles disciplinary matters under the ICC Code of Conduct and submits an official match report.",
  },
  {
    role: "Reserve umpire",
    detail: "Supports match operations and can replace an on-field umpire when required under the playing conditions.",
  },
];

const matchdayGallery: GalleryImage[] = [
  {
    title: "Test cricket at Lord's",
    detail: "England and New Zealand contest a day of Test cricket in 2026.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/England_v_New_Zealand_3rd_Test_2026.jpg/960px-England_v_New_Zealand_3rd_Test_2026.jpg",
    alt: "England and New Zealand players during the third Test in 2026",
    credit: "Edwin of Northumbria · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:England_v_New_Zealand_3rd_Test_2026.jpg",
  },
  {
    title: "A T20 World Cup qualifier",
    detail: "Bermuda and Panama compete in an ICC Men's T20 World Cup Americas Qualifier.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/BER_vs_PAN_at_the_2023_ICC_Men%27s_T20_World_Cup_Americas_Qualifier_by_BugWarp_80.jpg/960px-BER_vs_PAN_at_the_2023_ICC_Men%27s_T20_World_Cup_Americas_Qualifier_by_BugWarp_80.jpg",
    alt: "Bermuda and Panama players in action at the 2023 ICC Men's T20 World Cup Americas Qualifier",
    credit: "BugWarp · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:BER_vs_PAN_at_the_2023_ICC_Men%27s_T20_World_Cup_Americas_Qualifier_by_BugWarp_80.jpg",
  },
  {
    title: "World champions celebrate",
    detail: "Australia celebrate after winning the 2020 ICC Women's T20 World Cup.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/2020_ICC_Women%27s_T20_World_Cup_champions.jpg/960px-2020_ICC_Women%27s_T20_World_Cup_champions.jpg",
    alt: "Australia's team celebrates its 2020 ICC Women's T20 World Cup victory",
    credit: "Storm machine · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:2020_ICC_Women%27s_T20_World_Cup_champions.jpg",
  },
];

const officialSources = [
  { label: "About the ICC", href: "https://www.icc-cricket.com/about/index" },
  { label: "ICC Full Members", href: "https://www.icc-cricket.com/about/members/full" },
  { label: "ICC teams and team profiles", href: "https://www.icc-cricket.com/teams/men" },
  { label: "ICC match officials", href: "https://www.icc-cricket.com/about/cricket/match-officials" },
  { label: "ICC events", href: "https://www.icc-cricket.com/icc-events" },
  { label: "ICC rankings", href: "https://www.icc-cricket.com/rankings" },
];

export default function CricketICC() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative isolate overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950">
        <img
          src="https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/2020_ICC_Women%27s_T20_World_Cup_Final.jpg/960px-2020_ICC_Women%27s_T20_World_Cup_Final.jpg"
          alt="The Melbourne Cricket Ground during the 2020 ICC Women's T20 World Cup Final"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_25%,rgba(220,38,38,0.25),transparent_38%)]" />
        <div className="mx-auto grid min-h-[420px] max-w-7xl gap-10 px-4 py-16 sm:px-6 md:min-h-[500px] md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Cricket</p>
            <p className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-300"><span className="h-px w-10 bg-red-500" />The global game</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">International Cricket Council</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">Discover the governing body behind international cricket: its history, Full Member teams, match officials and global competitions.</p>
          </div>
          <div className="flex min-h-48 items-end justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm sm:min-h-56 sm:p-10">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">Cricket worldwide</p><p className="mt-3 max-w-xs text-sm leading-6 text-gray-200">One governing body, national teams across every region and a calendar of international events.</p></div>
            <span aria-hidden="true" className="ml-4 select-none text-right text-5xl font-black italic leading-none text-red-500 sm:text-7xl">ICC</span>
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-5 text-xs text-gray-300 sm:px-6 lg:px-8">
          Hero photo: <a href="https://commons.wikimedia.org/wiki/File:2020_ICC_Women%27s_T20_World_Cup_Final.jpg" target="_blank" rel="noreferrer" className="underline hover:text-white">Storm machine · CC BY-SA 4.0</a>
          {" · "}<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline hover:text-white">License</a>
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The ICC story</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">From an international council to the game's global governing body</h2>
          <p className="mt-5 text-sm leading-7 text-gray-300">Founded in 1909 as the Imperial Cricket Conference, the organization brought together the cricket boards of England, Australia and South Africa. As the game spread, its membership and remit expanded. It became the International Cricket Conference in 1965 and adopted its present name, the International Cricket Council, in 1989. Today, the ICC administers international cricket, stages its events and works with member boards to grow the game.</p>
          <a href="https://www.icc-cricket.com/about/index" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Explore the ICC <span aria-hidden="true" className="ml-2">↗</span></a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { year: "1909", title: "The council is formed", detail: "England, Australia and South Africa establish the Imperial Cricket Conference." },
            { year: "1965", title: "Membership expands", detail: "The organization becomes the International Cricket Conference as international cricket grows." },
            { year: "1989", title: "The ICC name begins", detail: "The International Cricket Council becomes the organization's name." },
          ].map((milestone) => (
            <article key={milestone.year} className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <p className="text-2xl font-black text-red-500">{milestone.year}</p>
              <h3 className="mt-4 text-lg font-black">{milestone.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{milestone.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The international pathway</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">What the ICC oversees</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              { title: "Global events", detail: "ICC tournaments bring national teams together across men's, women's and age-group cricket." },
              { title: "Playing conditions", detail: "The ICC sets international playing conditions and administers regulations, including the Decision Review System." },
              { title: "Member development", detail: "The ICC works with member boards and regional structures to support participation and the development of the game." },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-black p-6">
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">ICC Full Members</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Twelve national cricket teams</h2>
          </div>
          <a href="https://www.icc-cricket.com/about/members/full" target="_blank" rel="noreferrer" className="text-sm font-bold text-red-400 hover:text-red-300">View the official member directory ↗</a>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">Each card links to the ICC team profile. West Indies represents a regional team rather than a single country's national side.</p>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {fullMembers.map((member) => (
            <a key={member.name} href={member.profile} target="_blank" rel="noreferrer" className="group flex min-h-32 items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:-translate-y-1 hover:border-red-500/60 hover:bg-zinc-900 sm:p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white p-2 transition group-hover:scale-105">
                <img src={member.image} alt={`${member.name} cricket team crest`} loading="lazy" className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white sm:text-base">{member.name}</h3>
                <p className="mt-1 text-xs text-gray-500">ICC Full Member</p>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-500">Team crests and profiles: <a href="https://www.icc-cricket.com/teams/men" target="_blank" rel="noreferrer" className="underline hover:text-white">International Cricket Council</a>.</p>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Fair play and integrity</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">The match officials</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">The ICC appoints officials for sanctioned international matches. Teams and appointments change by fixture, so these role cards explain the matchday team rather than list a roster that can quickly become outdated.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {matchOfficials.map((official, index) => (
              <article key={official.role} className="rounded-2xl border border-white/10 bg-black p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 text-lg font-black">{official.role}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{official.detail}</p>
              </article>
            ))}
          </div>
          <a href="https://www.icc-cricket.com/about/cricket/match-officials" target="_blank" rel="noreferrer" className="mt-6 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Read about ICC match officials <span aria-hidden="true" className="ml-2">↗</span></a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">Cricket on the world stage</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">From the longest format to World Cup qualifiers and finals, ICC cricket brings teams and supporters together.</p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {matchdayGallery.map((moment) => (
            <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <div className="overflow-hidden">
                <img src={moment.image} alt={moment.alt} loading="lazy" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black">{moment.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                <p className="mt-4 text-xs text-gray-500">Photo: <a href={moment.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.credit}</a></p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Trusted references</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Official ICC sources</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {officialSources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black p-5 text-sm font-bold text-gray-200 transition hover:border-red-500/50 hover:text-white">
                {source.label}<span aria-hidden="true" className="shrink-0 text-red-500">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
