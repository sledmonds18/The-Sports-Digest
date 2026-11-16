"use client";

import { useEffect, useMemo, useState } from "react";
import SportsDeskFooter from "./SportsDeskFooter";

type Photo = {
  image: string;
  alt: string;
  credit: string;
  source: string;
  license: string;
  licenseHref: string;
};

type Moment = Photo & {
  title: string;
  detail: string;
};

const NFL_PLAYOFF_PHOTOS = {
  hero: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/NFL_Playoff_Wildcard_Game_-_Kyren_Williams_Running_Back_Rams_%2854266524948%29.jpg/1280px-NFL_Playoff_Wildcard_Game_-_Kyren_Williams_Running_Back_Rams_%2854266524948%29.jpg",
  first: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/NFL_Playoff_Wildcard_Game_-_LA_Rams_vs_Minnesota_Vikings_-_01-13-2025_-_MNF_%2854265410432%29.jpg/1280px-NFL_Playoff_Wildcard_Game_-_LA_Rams_vs_Minnesota_Vikings_-_01-13-2025_-_MNF_%2854265410432%29.jpg",
  second: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/NFL_Playoff_Wildcard_Game_-_LA_Rams_vs_Minnesota_Vikings_-_01-13-2025_-_MNF_%2854266294631%29.jpg/1280px-NFL_Playoff_Wildcard_Game_-_LA_Rams_vs_Minnesota_Vikings_-_01-13-2025_-_MNF_%2854266294631%29.jpg",
  third: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/NFL_Playoff_Wildcard_Game_-_LA_Rams_vs_Minnesota_Vikings_-_01-13-2025_-_MNF_%2854266710765%29.jpg/1280px-NFL_Playoff_Wildcard_Game_-_LA_Rams_vs_Minnesota_Vikings_-_01-13-2025_-_MNF_%2854266710765%29.jpg",
};

const SUPER_BOWL_PHOTOS = {
  hero: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Super_Bowl_XLVIII_%2812292064305%29.jpg/1280px-Super_Bowl_XLVIII_%2812292064305%29.jpg",
  kickoff: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Super_Bowl_XLVIII_kicking.jpg/1280px-Super_Bowl_XLVIII_kicking.jpg",
  game: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Super_Bowl_XLVIII_%2812292083675%29.jpg/1280px-Super_Bowl_XLVIII_%2812292083675%29.jpg",
  finish: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Super_Bowl_XLVIII_%2812292114053%29.jpg/1280px-Super_Bowl_XLVIII_%2812292114053%29.jpg",
};

const nflMoments: Moment[] = [
  {
    title: "The snap and the read",
    detail: "At the snap, the quarterback reads the defense and decides whether to pass, hand the ball off or keep it.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/25/Rodgersthrowing2018redskins.jpg",
    alt: "Aaron Rodgers throws a pass during a 2018 NFL game",
    credit: "Keith Allison · CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Rodgersthrowing2018redskins.jpg",
    license: "CC BY-SA 2.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  {
    title: "Move the chains",
    detail: "Four downs to gain ten yards turn each series into a sequence of field position, play calls and execution.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Tight_End_Taylor_Thompson_%2884%29.jpg/1280px-Tight_End_Taylor_Thompson_%2884%29.jpg",
    alt: "Tennessee Titans tight end Taylor Thompson during an NFL game",
    credit: "Kevin O'Sullivan · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Tight_End_Taylor_Thompson_(84).jpg",
    license: "CC BY-SA 4.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    title: "Red-zone decisions",
    detail: "Inside the opponent's 20-yard line, compact space makes play selection, protection and finishing especially important.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Mason_Foster_2018.jpg/1280px-Mason_Foster_2018.jpg",
    alt: "Washington linebacker Mason Foster during a game against Indianapolis",
    credit: "Keith Allison · CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Mason_Foster_2018.jpg",
    license: "CC BY-SA 2.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
];

const nflGallery: Moment[] = [
  {
    title: "Playoff football",
    detail: "The Los Angeles Rams and Minnesota Vikings meet in an NFL Wild Card playoff game.",
    image: NFL_PLAYOFF_PHOTOS.hero,
    alt: "Kyren Williams carries the ball in the Rams-Vikings NFL playoff game",
    credit: "James Larrison · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:NFL_Playoff_Wildcard_Game_-_Kyren_Williams_Running_Back_Rams_(54266524948).jpg",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    title: "A postseason matchup",
    detail: "The Rams and Vikings compete under the lights during the 2025 NFL playoffs.",
    image: NFL_PLAYOFF_PHOTOS.first,
    alt: "Rams and Vikings players line up during a 2025 NFL playoff game",
    credit: "James Larrison · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:NFL_Playoff_Wildcard_Game_-_LA_Rams_vs_Minnesota_Vikings_-_01-13-2025_-_MNF_(54265410432).jpg",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    title: "The road through the playoffs",
    detail: "Each postseason game is win-or-go-home on the route to the Super Bowl.",
    image: NFL_PLAYOFF_PHOTOS.second,
    alt: "An NFL playoff play between the Los Angeles Rams and Minnesota Vikings",
    credit: "James Larrison · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:NFL_Playoff_Wildcard_Game_-_LA_Rams_vs_Minnesota_Vikings_-_01-13-2025_-_MNF_(54266294631).jpg",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
  },
];

const superBowlMoments: Moment[] = [
  {
    title: "The opening kick",
    detail: "A championship game begins with special teams setting the tone and the field-position battle underway.",
    image: SUPER_BOWL_PHOTOS.kickoff,
    alt: "Seattle Seahawks kick a field goal against the Denver Broncos in Super Bowl XLVIII",
    credit: "MichelinStar · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Super_Bowl_XLVIII_kicking.jpg",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    title: "A season on the line",
    detail: "One game brings together conference champions, a single-match strategy and the pressure of the biggest stage.",
    image: SUPER_BOWL_PHOTOS.game,
    alt: "Action during Super Bowl XLVIII",
    credit: "Josh Lackey · CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Super_Bowl_XLVIII_(12292083675).jpg",
    license: "CC BY-SA 2.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  {
    title: "The final whistle",
    detail: "The last possession, a defensive stop or a decisive score can define the champion and the game's legacy.",
    image: SUPER_BOWL_PHOTOS.finish,
    alt: "A moment from Super Bowl XLVIII between the Seattle Seahawks and Denver Broncos",
    credit: "Josh Lackey · CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Super_Bowl_XLVIII_(12292114053).jpg",
    license: "CC BY-SA 2.0",
    licenseHref: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
];

const superBowlGallery: Moment[] = [
  {
    title: "Super Bowl XLV after the game",
    detail: "Postgame scenes from Super Bowl XLV and the closing moments of the championship.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Super_Bowl_XLV_post-game_%286843409239%29.jpg/1280px-Super_Bowl_XLV_post-game_%286843409239%29.jpg",
    alt: "A postgame scene following Super Bowl XLV",
    credit: "John Seb Barber · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Super_Bowl_XLV_post-game_(6843409239).jpg",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    title: "The championship stage",
    detail: "The NFL title game brings the league's season to a close.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Super_Bowl_XLV_post-game_%286843406043%29.jpg/1280px-Super_Bowl_XLV_post-game_%286843406043%29.jpg",
    alt: "Celebrations after the Super Bowl XLV championship game",
    credit: "John Seb Barber · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Super_Bowl_XLV_post-game_(6843406043).jpg",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    title: "The final celebration",
    detail: "The celebrations begin when the final whistle confirms the champion.",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Super_Bowl_XLV_post-game_%286843407125%29.jpg/1280px-Super_Bowl_XLV_post-game_%286843407125%29.jpg",
    alt: "A championship celebration following Super Bowl XLV",
    credit: "John Seb Barber · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Super_Bowl_XLV_post-game_(6843407125).jpg",
    license: "CC BY 2.0",
    licenseHref: "https://creativecommons.org/licenses/by/2.0/",
  },
];

const sources = [
  { label: "NFL", href: "https://www.nfl.com/" },
  { label: "NFL schedules", href: "https://www.nfl.com/schedules/" },
  { label: "NFL Super Bowl", href: "https://www.nfl.com/super-bowl/" },
  { label: "NFL rules and policies", href: "https://operations.nfl.com/the-rules/" },
  { label: "NFL Football Operations", href: "https://operations.nfl.com/" },
  { label: "API-Sports American Football data", href: "https://www.api-football.com/american-football-api" },
];

function PhotoCredit({ photo }: { photo: Photo }) {
  return (
    <p className="mt-4 text-xs text-gray-500">
      Photo: <a href={photo.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{photo.credit}</a>
      {" · "}<a href={photo.licenseHref} target="_blank" rel="noreferrer" className="underline hover:text-white">{photo.license}</a>
    </p>
  );
}

function MomentsSection({ title, moments }: { title: string; moments: Moment[] }) {
  return (
    <section className="border-y border-white/10 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Inside the competition</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {moments.map((moment) => (
            <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-black">
              <div className="overflow-hidden">
                <img src={moment.image} alt={moment.alt} loading="lazy" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black">{moment.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                <PhotoCredit photo={moment} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ title, moments }: { title: string; moments: Moment[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
      <h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {moments.map((moment) => (
          <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
            <div className="overflow-hidden">
              <img src={moment.image} alt={moment.alt} loading="lazy" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-black">{moment.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
              <PhotoCredit photo={moment} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AmericanFootballProfile({ section, onNavigate }: { section: "nfl" | "super-bowl"; onNavigate: (page: string) => void }) {
  const isSuperBowl = section === "super-bowl";
  const title = isSuperBowl ? "Super Bowl" : "NFL";
  const heroPhoto: Photo = isSuperBowl
    ? {
        image: SUPER_BOWL_PHOTOS.hero,
        alt: "Super Bowl XLVIII at MetLife Stadium",
        credit: "Josh Lackey · CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Super_Bowl_XLVIII_(12292064305).jpg",
        license: "CC BY-SA 2.0",
        licenseHref: "https://creativecommons.org/licenses/by-sa/2.0/",
      }
    : {
        image: NFL_PLAYOFF_PHOTOS.hero,
        alt: "Los Angeles Rams running back Kyren Williams during an NFL playoff game",
        credit: "James Larrison · CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:NFL_Playoff_Wildcard_Game_-_Kyren_Williams_Running_Back_Rams_(54266524948).jpg",
        license: "CC BY 2.0",
        licenseHref: "https://creativecommons.org/licenses/by/2.0/",
      };
  const moments = isSuperBowl ? superBowlMoments : nflMoments;
  const gallery = isSuperBowl ? superBowlGallery : nflGallery;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative isolate overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950">
        <img src={heroPhoto.image} alt={heroPhoto.alt} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_25%,rgba(220,38,38,0.25),transparent_38%)]" />
        <div className="mx-auto grid min-h-[420px] max-w-7xl gap-10 px-4 py-16 sm:px-6 md:min-h-[500px] md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · American Football</p>
            <p className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-300"><span className="h-px w-10 bg-red-500" />{isSuperBowl ? "Championship Sunday" : "The National Football League"}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">
              {isSuperBowl
                ? "The NFL's championship game brings the AFC and NFC champions together for one defining contest."
                : "Follow the league, its teams and the strategy behind every down, drive and game."}
            </p>
          </div>
          <div className="flex min-h-48 items-end justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm sm:min-h-56 sm:p-10">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">{isSuperBowl ? "One game. One champion." : "Every down matters."}</p><p className="mt-3 max-w-xs text-sm leading-6 text-gray-200">{isSuperBowl ? "The season's final matchup, played for the Vince Lombardi Trophy." : "A 17-game regular season leads into the single-elimination playoffs."}</p></div>
            <span aria-hidden="true" className="ml-4 select-none text-right text-4xl font-black italic leading-none text-red-500 sm:text-6xl">{isSuperBowl ? "SB" : "NFL"}</span>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8"><PhotoCredit photo={heroPhoto} /></div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">{isSuperBowl ? "The championship" : "League history"}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{isSuperBowl ? "The road to the Lombardi Trophy" : "A league built around the next play"}</h2>
          <p className="mt-5 text-sm leading-7 text-gray-300">
            {isSuperBowl
              ? "The Super Bowl is the final game of the NFL season, matching the champions of the American Football Conference and National Football Conference. First played in 1967, it became the unified championship after the NFL and American Football League merger. The winner receives the Vince Lombardi Trophy."
              : "Founded in 1920 as the American Professional Football Association, the league adopted the National Football League name in 1922. The 1970 merger with the American Football League created the modern conference structure. Today, 32 teams compete across the AFC and NFC, with the regular season followed by the playoffs and Super Bowl."}
          </p>
          <a href={isSuperBowl ? "https://www.nfl.com/super-bowl/" : "https://www.nfl.com/" } target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Explore the official {isSuperBowl ? "Super Bowl" : "NFL"} site <span aria-hidden="true" className="ml-2">↗</span></a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {(isSuperBowl
            ? [
                { title: "AFC champion", detail: "The American Football Conference representative earns its place through the playoff bracket." },
                { title: "NFC champion", detail: "The National Football Conference champion advances through its own single-elimination path." },
                { title: "Super Bowl Sunday", detail: "The two conference champions meet in a neutral-site game for the league title." },
              ]
            : [
                { title: "32 franchises", detail: "The league is organized into the American Football Conference and National Football Conference, each with four divisions." },
                { title: "Regular season", detail: "Each team plays 17 games over 18 weeks, with one bye week in the current regular-season format." },
                { title: "Playoffs", detail: "Seven teams from each conference qualify for a single-elimination postseason, leading to the Super Bowl." },
              ]
          ).map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <h3 className="text-lg font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <MomentsSection title={isSuperBowl ? "Moments that shape the Super Bowl" : "Moments that shape American football"} moments={moments} />
      <GallerySection title={isSuperBowl ? "Super Bowl matchday moments" : "NFL matchday gallery"} moments={gallery} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Match centre</p><h2 className="mt-2 text-2xl font-black">Follow the NFL season</h2><p className="mt-2 text-sm text-gray-400">Browse scheduled games, final scores and conference standings.</p></div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => onNavigate("nfl-fixtures")} className="rounded-lg border border-white/20 px-4 py-3 text-sm font-bold transition hover:border-red-500 hover:bg-red-600">Fixtures</button>
            <button type="button" onClick={() => onNavigate("nfl-results")} className="rounded-lg border border-white/20 px-4 py-3 text-sm font-bold transition hover:border-red-500 hover:bg-red-600">Results</button>
            <button type="button" onClick={() => onNavigate("nfl-standings")} className="rounded-lg border border-white/20 px-4 py-3 text-sm font-bold transition hover:border-red-500 hover:bg-red-600">Standings</button>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Trusted references</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Official NFL sources</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black p-5 text-sm font-bold text-gray-200 transition hover:border-red-500/50 hover:text-white">
                {source.label}<span aria-hidden="true" className="shrink-0 text-red-500">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <SportsDeskFooter desk={isSuperBowl ? "Super Bowl Desk" : "NFL Desk"} description={isSuperBowl ? "The championship game, its history and the moments that define it." : "NFL stories, competition details and season coverage."} onNavigate={onNavigate} />
    </main>
  );
}

type NflTeam = { id?: number; name?: string; logo?: string };
type NflGame = {
  id?: number;
  date?: string;
  week?: string | number;
  season?: number | string;
  status?: string | { short?: string; long?: string };
  teams?: { home?: NflTeam; away?: NflTeam };
  scores?: {
    home?: number | null | { total?: number | null; points?: number | null };
    away?: number | null | { total?: number | null; points?: number | null };
  };
  league?: { name?: string; logo?: string };
  venue?: { name?: string; city?: string };
};
type PageStatus = "loading" | "ready" | "unconfigured" | "season_unavailable" | "error";
type Standing = {
  team: NflTeam;
  group: string;
  played?: number;
  wins?: number;
  losses?: number;
  ties?: number;
  pointsFor?: number;
  pointsAgainst?: number;
  rank?: number;
};

function apiScore(score: unknown): number | null {
  if (typeof score === "number") return score;
  if (score !== null && typeof score === "object") {
    const item = score as { total?: unknown; points?: unknown };
    const total = item.total ?? item.points;
    return typeof total === "number" ? total : null;
  }
  return null;
}

function normalizeGame(value: unknown): NflGame | null {
  if (value === null || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const game = row.game !== null && typeof row.game === "object"
    ? row.game as Record<string, unknown>
    : row;
  const rawDate = game.date;
  let date: string | undefined;
  if (typeof rawDate === "string") {
    date = rawDate;
  } else if (rawDate !== null && typeof rawDate === "object") {
    const dateInfo = rawDate as { date?: unknown; timestamp?: unknown; time?: unknown; timezone?: unknown };
    if (typeof dateInfo.timestamp === "number") {
      date = new Date(dateInfo.timestamp * 1000).toISOString();
    } else if (typeof dateInfo.date === "string") {
      const time = typeof dateInfo.time === "string" ? dateInfo.time : "00:00:00";
      date = `${dateInfo.date}T${time}${dateInfo.timezone === "UTC" ? "Z" : ""}`;
    }
  }
  const teams = row.teams !== null && typeof row.teams === "object"
    ? row.teams as NflGame["teams"]
    : undefined;
  if (!date || typeof teams?.home?.name !== "string" || typeof teams.away?.name !== "string") return null;
  return {
    id: typeof game.id === "number" ? game.id : undefined,
    date,
    week: typeof game.week === "string" || typeof game.week === "number" ? game.week : undefined,
    status: typeof game.status === "string" || (game.status !== null && typeof game.status === "object")
      ? game.status as NflGame["status"]
      : undefined,
    teams,
    scores: row.scores !== null && typeof row.scores === "object"
      ? row.scores as NflGame["scores"]
      : undefined,
    league: row.league !== null && typeof row.league === "object"
      ? row.league as NflGame["league"]
      : undefined,
    venue: game.venue !== null && typeof game.venue === "object"
      ? game.venue as NflGame["venue"]
      : undefined,
  };
}

function teamInitials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function TeamBadge({ team }: { team: NflTeam }) {
  const [failed, setFailed] = useState(false);
  const name = team.name || "Team";
  return team.logo && !failed
    ? <img src={team.logo} alt="" onError={() => setFailed(true)} className="h-9 w-9 shrink-0 object-contain" />
    : <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-gray-300">{teamInitials(name)}</span>;
}

function readName(value: unknown): string {
  if (typeof value === "string") return value;
  return value !== null && typeof value === "object" && "name" in value && typeof value.name === "string" ? value.name : "";
}

function readNumber(...values: unknown[]): number | undefined {
  const value = values.map((item) => {
    if (item !== null && typeof item === "object" && "total" in item) return item.total;
    return item;
  }).find((item) => typeof item === "number" || (typeof item === "string" && item.trim() !== ""));
  if (typeof value === "number") return value;
  if (typeof value === "string" && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function readList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data !== null && typeof data === "object" && "response" in data && Array.isArray(data.response)) return data.response;
  return [];
}

function flattenStandings(value: unknown, inheritedGroup = "", output: Standing[] = []): Standing[] {
  if (Array.isArray(value)) {
    for (const item of value) flattenStandings(item, inheritedGroup, output);
    return output;
  }
  if (value === null || typeof value !== "object") return output;

  const row = value as Record<string, unknown>;
  const group = readName(row.division) || readName(row.conference) || readName(row.group) || inheritedGroup;
  const team = row.team !== null && typeof row.team === "object" ? row.team as NflTeam : null;
  if (team && typeof team.name === "string") {
    const record = row.record !== null && typeof row.record === "object" ? row.record as Record<string, unknown> : {};
    const wins = readNumber(row.won, row.wins, row.win, record.wins);
    const losses = readNumber(row.lost, row.losses, row.loss, record.losses);
    const ties = readNumber(row.tied, row.ties, row.tie, record.ties);
    const points = row.points !== null && typeof row.points === "object" ? row.points as Record<string, unknown> : {};
    const played = readNumber(row.played, row.games, row.gp);
    output.push({
      team,
      group,
      rank: readNumber(row.position, row.rank, row.place),
      wins,
      losses,
      ties,
      played: played ?? (wins !== undefined && losses !== undefined ? wins + losses + (ties || 0) : undefined),
      pointsFor: readNumber(row.points_for, row.pointsFor, points.for, points.scored),
      pointsAgainst: readNumber(row.points_against, row.pointsAgainst, points.against, points.conceded),
    });
    return output;
  }

  for (const [key, nested] of Object.entries(row)) {
    flattenStandings(nested, readName({ name: key }) || group, output);
  }
  return output;
}

function getStatus(game: NflGame): string {
  if (typeof game.status === "string") return game.status;
  return game.status?.long || game.status?.short || "";
}

function isGameFinished(game: NflGame): boolean {
  return /(final|finished|complete|ended|^ft$)/i.test(getStatus(game));
}

function isGameInProgress(game: NflGame): boolean {
  return /(progress|quarter|half|overtime|^live$|^q[1-4]$|^ot$)/i.test(getStatus(game));
}

function GameCard({ game, showScore }: { game: NflGame; showScore: boolean }) {
  const home = game.teams?.home || {};
  const away = game.teams?.away || {};
  const kickoff = game.date ? new Date(game.date) : null;
  const dateLabel = kickoff && !Number.isNaN(kickoff.getTime())
    ? kickoff.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
    : "Date TBC";
  const timeLabel = kickoff && !Number.isNaN(kickoff.getTime())
    ? kickoff.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const homeScore = apiScore(game.scores?.home);
  const awayScore = apiScore(game.scores?.away);

  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300"><span>{game.league?.name || "National Football League"}</span>{game.week && <span className="text-gray-500">· Week {game.week}</span>}</div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-300">{dateLabel}{timeLabel ? ` · ${timeLabel}` : ""}{showScore ? ` · ${getStatus(game) || "Final"}` : ""}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6 sm:gap-5">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center"><TeamBadge team={home} /><span className="text-sm font-bold text-white sm:text-base">{home.name || "Home"}</span></div>
        {showScore
          ? <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-2xl font-black tabular-nums text-white sm:text-3xl"><span>{homeScore ?? "–"}</span><span className="text-gray-600">:</span><span>{awayScore ?? "–"}</span></div>
          : <span className="rounded-lg border border-white/10 px-4 py-2 text-sm font-black uppercase tracking-wider text-gray-300">vs</span>}
        <div className="flex min-w-0 flex-col items-center gap-3 text-center"><TeamBadge team={away} /><span className="text-sm font-bold text-white sm:text-base">{away.name || "Away"}</span></div>
      </div>
      {game.venue?.name && <p className="border-t border-white/10 pt-3 text-center text-xs text-gray-500">{game.venue.name}{game.venue.city ? ` · ${game.venue.city}` : ""}</p>}
    </article>
  );
}

function MatchCenterHeader({ title, description, onNavigate }: { title: string; description: string; onNavigate: (page: string) => void }) {
  return (
    <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">{description}</p>
        <button type="button" onClick={() => onNavigate("live-nfl")} className="mt-6 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500 hover:bg-red-600">Go to Live NFL <span aria-hidden="true">→</span></button>
      </div>
    </section>
  );
}

function DataState({ status, kind, message }: { status: PageStatus; kind: string; message: string }) {
  if (status === "loading") return <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">Loading NFL {kind}…</div>;
  if (status === "unconfigured") return <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">NFL data isn’t connected yet</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">Add <code className="text-gray-200">API_NFL_KEY</code> to the server environment to load the American Football schedule and standings.</p></div>;
  if (status === "season_unavailable") return <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-10 text-center"><h3 className="text-lg font-bold">Current-season NFL data isn’t included</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-300">{message} Choose an available season above to view historical standings, or check Live NFL for current game coverage.</p></div>;
  return <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">NFL {kind} are temporarily unavailable</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">{message || `The data provider could not return these ${kind}. Please try again later.`}</p></div>;
}

export function AmericanFootballMatchCenter({ section, onNavigate }: { section: "nfl-fixtures" | "nfl-results" | "nfl-standings"; onNavigate: (page: string) => void }) {
  const [items, setItems] = useState<unknown[]>([]);
  const [status, setStatus] = useState<PageStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const currentSeason = new Date().getUTCMonth() >= 7 ? new Date().getUTCFullYear() : new Date().getUTCFullYear() - 1;
  const [season, setSeason] = useState(currentSeason);
  const seasons = Array.from({ length: 5 }, (_, index) => currentSeason - index);
  const kind = section === "nfl-fixtures" ? "fixtures" : section === "nfl-results" ? "results" : "standings";
  const title = kind === "fixtures" ? "NFL Fixtures" : kind === "results" ? "NFL Results" : "NFL Standings";

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch(`/api/nfl?view=${kind}&season=${season}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (data.status === "unconfigured") {
          setItems([]);
          setStatus("unconfigured");
          return;
        }
        if (data.status === "season_unavailable") {
          setItems([]);
          setErrorMessage(data.message || "The configured API plan does not include this NFL season.");
          setStatus("season_unavailable");
          return;
        }
        if (!response.ok || data.status === "error") {
          setErrorMessage(data.message || `NFL ${kind} unavailable.`);
          throw new Error(data.message || `NFL ${kind} unavailable.`);
        }
        setItems(readList(data.response));
        setErrorMessage("");
        setUpdatedAt(typeof data.updatedAt === "string" ? data.updatedAt : null);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(`NFL ${kind} could not be loaded:`, error);
        if (error instanceof Error) setErrorMessage(error.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, [kind, season]);

  const games = useMemo(() => items
    .map(normalizeGame)
    .filter((game): game is NflGame => game !== null), [items]);
  const now = Date.now();
  const recent = now - 7 * 24 * 60 * 60 * 1000;
  const nextWeek = now + 7 * 24 * 60 * 60 * 1000;
  const filteredGames = games
    .filter((game) => {
      const time = Date.parse(game.date || "");
      if (!Number.isFinite(time)) return false;
      return kind === "fixtures"
        ? time >= now && time <= nextWeek && !isGameFinished(game) && !isGameInProgress(game)
        : time >= recent && time < now && isGameFinished(game);
    })
    .sort((first, second) => kind === "fixtures"
      ? Date.parse(first.date || "") - Date.parse(second.date || "")
      : Date.parse(second.date || "") - Date.parse(first.date || ""));

  const standings = useMemo(() => {
    const rows = flattenStandings(items);
    return rows.sort((a, b) => {
      const group = a.group.localeCompare(b.group);
      if (group !== 0) return group;
      const difference = (b.wins || 0) - (a.wins || 0) ||
        (b.ties || 0) - (a.ties || 0) ||
        ((b.pointsFor || 0) - (b.pointsAgainst || 0)) - ((a.pointsFor || 0) - (a.pointsAgainst || 0));
      return a.rank !== undefined && b.rank !== undefined ? a.rank - b.rank : difference;
    });
  }, [items]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <MatchCenterHeader
        title={title}
        description={kind === "fixtures" ? "Upcoming NFL games for the next seven days, with kickoff dates and matchups." : kind === "results" ? "Final scores from NFL games played during the past seven days." : "Track divisional records and conference races across the NFL season."}
        onNavigate={onNavigate}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">{kind === "fixtures" ? "Coming up" : kind === "results" ? "Final scores" : "League table"}</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">{kind === "fixtures" ? "Next seven days" : kind === "results" ? "Last seven days" : `NFL ${season} season`}</h2></div>
          <label className="flex items-center gap-3 text-xs font-bold text-gray-400">Season<select value={season} onChange={(event) => setSeason(Number(event.target.value))} className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white">{seasons.map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
        </div>

        {status !== "ready" ? <DataState status={status} kind={kind} message={errorMessage} />
          : kind === "standings" ? standings.length === 0
            ? <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">NFL standings are not available</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">The provider did not return a standings table for the {season} season.</p></div>
            : <div className="space-y-8">
              {Array.from(new Set(standings.map((row) => row.group || "NFL"))).map((group) => {
                const rows = standings.filter((row) => (row.group || "NFL") === group);
                return <section key={group} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                  <h3 className="border-b border-white/10 px-5 py-4 text-lg font-black">{group}</h3>
                  <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-white/[0.04] text-[10px] uppercase tracking-wider text-gray-500"><tr><th className="px-4 py-3">Pos</th><th className="px-4 py-3">Team</th><th className="px-3 py-3 text-center">P</th><th className="px-3 py-3 text-center">W</th><th className="px-3 py-3 text-center">L</th><th className="px-3 py-3 text-center">T</th><th className="px-3 py-3 text-center">PF</th><th className="px-3 py-3 text-center">PA</th></tr></thead>
                    <tbody className="divide-y divide-white/[0.06]">{rows.map((row, index) => <tr key={`${group}-${row.team.id || row.team.name}`} className="transition hover:bg-white/[0.03]">
                      <td className="px-4 py-3 font-bold text-gray-400">{row.rank || index + 1}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><TeamBadge team={row.team} /><span className="font-bold text-white">{row.team.name}</span></div></td>
                      <td className="px-3 py-3 text-center text-gray-300">{row.played ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.wins ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.losses ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.ties ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.pointsFor ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.pointsAgainst ?? "—"}</td>
                    </tr>)}</tbody>
                  </table></div>
                </section>;
              })}
            </div>
          : filteredGames.length === 0
            ? <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">No NFL {kind} found</h3><p className="mt-2 text-sm text-gray-400">There are no NFL {kind} in the provider feed for the selected date range.</p></div>
            : <div className="grid gap-4 md:grid-cols-2">{filteredGames.map((game) => <GameCard key={`${game.id}-${game.date}`} game={game} showScore={kind === "results"} />)}</div>}
        {status === "ready" && updatedAt && <p className="mt-4 text-right text-xs text-gray-600">Data supplied by API-Sports · Updated {new Date(updatedAt).toLocaleString()}</p>}
      </section>
      <SportsDeskFooter desk={`NFL ${title.replace("NFL ", "")} Desk`} description={`${title} and standings from the NFL season.`} onNavigate={onNavigate} />
    </main>
  );
}
