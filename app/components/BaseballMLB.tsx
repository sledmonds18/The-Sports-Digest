"use client";

type BaseballPhoto = {
  title: string;
  detail: string;
  image: string;
  alt: string;
  credit: string;
  license: string;
  source: string;
};

const matchdayGallery: BaseballPhoto[] = [
  {
    title: "Opening day in Seoul",
    detail: "Shohei Ohtani at bat during the Dodgers–Padres game in Seoul.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/2024_MLB_World_Tour_Seoul_Series%2C_Shohei_Ohtani_%282%29.jpg/1280px-2024_MLB_World_Tour_Seoul_Series%2C_Shohei_Ohtani_%282%29.jpg",
    alt: "Shohei Ohtani batting during the 2024 MLB Seoul Series",
    credit: "U.S. Ambassador to Japan Rahm Emanuel",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:2024_MLB_World_Tour_Seoul_Series,_Shohei_Ohtani_(2).jpg",
  },
  {
    title: "A game in Montreal",
    detail: "The New York Mets and Toronto Blue Jays meet at Olympic Stadium.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Major_League_Baseball_in_Montreal_%2814100773944%29.jpg/1280px-Major_League_Baseball_in_Montreal_%2814100773944%29.jpg",
    alt: "The Mets and Blue Jays face one another during an exhibition game in Montreal",
    credit: "Mohammed Jaffar",
    license: "CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Major_League_Baseball_in_Montreal_(14100773944).jpg",
  },
  {
    title: "Batter against pitcher",
    detail: "Barry Bonds faces Dan Haren during the 2007 MLB All-Star Game.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Barry_Bonds%2C_Dan_Haren_2007_MLB_All-Star_Game.jpg/1280px-Barry_Bonds%2C_Dan_Haren_2007_MLB_All-Star_Game.jpg",
    alt: "Barry Bonds batting against Dan Haren at the 2007 MLB All-Star Game",
    credit: "Bryce Edwards",
    license: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Barry_Bonds,_Dan_Haren_2007_MLB_All-Star_Game.jpg",
  },
  {
    title: "A World Series home run",
    detail: "Dusty Rhodes rounds the bases after his home run in Game 2 of the 1954 World Series.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/1954_World_Series_game_two.jpeg/1280px-1954_World_Series_game_two.jpeg",
    alt: "Dusty Rhodes rounds the bases after a home run in the 1954 World Series",
    credit: "Unknown author",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:1954_World_Series_game_two.jpeg",
  },
];

const competitionMoments = [
  {
    title: "The at-bat",
    detail: "Each pitch changes the count and the options for both pitcher and batter. A walk, strikeout or ball in play can quickly change the inning.",
    photo: matchdayGallery[0],
  },
  {
    title: "The pitcher–batter duel",
    detail: "Pitch selection, control and timing create the central contest, while runners and defensive positioning add pressure to every delivery.",
    photo: matchdayGallery[2],
  },
  {
    title: "The decisive run",
    detail: "Home runs and late-inning rallies can turn a close game into a defining postseason moment.",
    photo: matchdayGallery[3],
  },
];

const officialSources = [
  { label: "Major League Baseball", detail: "Official league news, teams and competition information.", href: "https://www.mlb.com/" },
  { label: "MLB schedule", detail: "Official fixtures and game times.", href: "https://www.mlb.com/schedule" },
  { label: "MLB stats", detail: "Official player and team statistics.", href: "https://www.mlb.com/stats" },
  { label: "MLB rules", detail: "Official rules and regulations of the game.", href: "https://www.mlb.com/official-information/rules" },
  { label: "World Baseball Softball Confederation", detail: "International baseball and softball governance and competitions.", href: "https://www.wbsc.org/" },
];

export default function BaseballMLB({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative isolate overflow-hidden border-b-4 border-red-600 bg-zinc-950">
        <img
          src={matchdayGallery[0].image}
          alt={matchdayGallery[0].alt}
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="mx-auto grid min-h-[420px] max-w-7xl gap-10 px-4 py-16 sm:px-6 md:min-h-[500px] md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Baseball</p>
            <p className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-300"><span className="h-px w-10 bg-red-500" />Major League Baseball</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">MLB</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">
              Follow Major League Baseball: its clubs, season, matchups and defining moments, with links to official league information.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate("live-baseball")} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black transition hover:bg-red-500">Live Baseball</button>
              <button type="button" onClick={() => onNavigate("baseball-fixtures")} className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold transition hover:border-red-500">Fixtures</button>
              <button type="button" onClick={() => onNavigate("baseball-results")} className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold transition hover:border-red-500">Results</button>
              <button type="button" onClick={() => onNavigate("baseball-standings")} className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold transition hover:border-red-500">Standings</button>
              <button type="button" onClick={() => onNavigate("baseball-news")} className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold transition hover:border-red-500">Baseball News</button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-black/55 p-7 backdrop-blur-sm sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">The major-league season</p>
            <p className="mt-4 text-sm leading-7 text-gray-200">
              MLB brings together the American League and National League. Clubs navigate a long regular season before the postseason determines the World Series champion.
            </p>
            <a href="https://www.mlb.com/" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-white underline decoration-red-500 underline-offset-4 hover:text-red-300">Visit MLB.com ↗</a>
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-5 text-xs text-gray-300 sm:px-6 lg:px-8">
          Hero photo: <a href={matchdayGallery[0].source} target="_blank" rel="noreferrer" className="underline hover:text-white">{matchdayGallery[0].credit} · {matchdayGallery[0].license}</a>
        </p>
      </section>

      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Inside the competition</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Moments that shape baseball</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">From the first pitch of an at-bat to a game-changing run, these are the details that build the drama of a baseball game.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {competitionMoments.map(({ title, detail, photo }) => (
              <article key={title} className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <img src={photo.image} alt={photo.alt} loading="lazy" className="h-56 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{detail}</p>
                  <a href={photo.source} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-gray-300 underline decoration-white/30 underline-offset-4 hover:text-white">
                    Photo: {photo.credit} · {photo.license}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Baseball in action</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {matchdayGallery.map((photo) => (
              <article key={photo.title} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <img src={photo.image} alt={photo.alt} loading="lazy" className="h-52 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-black">{photo.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{photo.detail}</p>
                  <a href={photo.source} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-gray-300 underline decoration-white/30 underline-offset-4 hover:text-white">
                    {photo.credit} · {photo.license}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Official sources</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Follow the game at its source</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {officialSources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-black p-5 transition hover:border-red-500/60">
                <h3 className="font-black text-white">{source.label}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{source.detail}</p>
                <span className="mt-4 inline-flex text-xs font-bold text-red-400 group-hover:text-red-300">Official website ↗</span>
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-gray-500">Baseball image credits and licenses link to each original file page on Wikimedia Commons.</p>
        </div>
      </section>
    </main>
  );
}
