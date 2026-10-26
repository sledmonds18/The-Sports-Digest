
    "use client";

    import Image from "next/image";
import GhanaNewsDeskCallout from "./GhanaNewsDeskCallout";
    import type { CSSProperties } from "react";

    interface GhanaPremierLeagueProps {
    onNavigate?: (page: string) => void;
    onToast?: (message: string) => void;
    }

    type PremierLeagueClub = {
    id: string;
    name: string;
    location: string;
    image: string;
    };

    const premierLeagueClubs: PremierLeagueClub[] = [
    {
        id: "medeama-sc",
        name: "Medeama SC",
        location: "Tarkwa",
        image: "/Ghana-Premier-League-Clubs/medeama-sc.png",
    },
    {
        id: "hearts-of-oak",
        name: "Hearts of Oak",
        location: "Accra",
        image: "/Ghana-Premier-League-Clubs/hearts-of-oak.png",
    },
    {
        id: "asante-kotoko",
        name: "Asante Kotoko",
        location: "Kumasi",
        image: "/Ghana-Premier-League-Clubs/asante-kotoko.png",
    },
    {
        id: "bibiani-gold-stars",
        name: "Bibiani Gold Stars",
        location: "Bibiani",
        image: "/Ghana-Premier-League-Clubs/bibiani-gold-stars.png",
    },
    {
        id: "heart-of-lions",
        name: "Heart of Lions",
        location: "Kpando",
        image: "/Ghana-Premier-League-Clubs/heart-of-lions.png",
    },
    {
        id: "dreams-fc",
        name: "Dreams FC",
        location: "Dawu",
        image: "/Ghana-Premier-League-Clubs/dreams-fc.png",
    },
    {
        id: "berekum-chelsea",
        name: "Berekum Chelsea",
        location: "Berekum",
        image: "/Ghana-Premier-League-Clubs/berekum-chelsea.png",
    },
    {
        id: "aduana-fc",
        name: "Aduana FC",
        location: "Dormaa Ahenkro",
        image: "/Ghana-Premier-League-Clubs/aduana-fc.png",
    },
    {
        id: "bechem-united",
        name: "Bechem United",
        location: "Bechem",
        image: "/Ghana-Premier-League-Clubs/bechem-united.png",
    },
    {
        id: "karela-united",
        name: "Karela United",
        location: "Nzema Anyinase",
        image: "/Ghana-Premier-League-Clubs/karela-united.png",
    },
    {
        id: "samartex-1996",
        name: "FC Samartex 1996",
        location: "Samreboi",
        image: "/Ghana-Premier-League-Clubs/samartex-1996.png",
    },
    {
        id: "vision-fc",
        name: "Vision FC",
        location: "Tema",
        image: "/Ghana-Premier-League-Clubs/vision-fc.png",
    },
    {
        id: "basake-holy-stars",
        name: "Basake Holy Stars",
        location: "Basake",
        image: "/Ghana-Premier-League-Clubs/basake-holy-stars.png",
    },
    {
        id: "young-apostles",
        name: "Young Apostles",
        location: "Wenchi",
        image: "/Ghana-Premier-League-Clubs/young-apostles.png",
    },
    {
        id: "legon-cities",
        name: "Legon Cities",
        location: "Accra",
        image: "/Ghana-Premier-League-Clubs/legon-cities.png",
    },
    {
        id: "port-city-fc",
        name: "Port City FC",
        location: "Tema",
        image: "/Ghana-Premier-League-Clubs/port-city-fc.png",
    },
    {
        id: "ashantigold-04",
        name: "FC AshantiGold 04",
        location: "Obuasi",
        image: "/Ghana-Premier-League-Clubs/ashantigold-04.png",
    },
    {
        id: "debibi-united",
        name: "Debibi United",
        location: "Debibi",
        image: "/Ghana-Premier-League-Clubs/debibi-united.png",
    },
    ];

    const tableHeaderStyle: CSSProperties = {
    border: "1px solid #444",
    padding: "16px",
    textAlign: "center",
    color: "#aaa",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    };

    const tableCellStyle: CSSProperties = {
    border: "1px solid #333",
    padding: "16px",
    textAlign: "center",
    color: "#ccc",
    };

    const stats = [
    { number: "1956", label: "Officially formed" },
    { number: "1993", label: "Professional era" },
    { number: "18", label: "Current clubs" },
    { number: "2026/27", label: "Current season" },
    ];

    const history = [
    {
        year: "1956",
        title: "The League Takes Shape",
        text: "The Ghana Premier League was officially formed in 1956 after the final Gold Coast Club competition.",
    },
    {
        year: "1959",
        title: "National League Era",
        text: "The national league structure helped create a stronger national football competition.",
    },
    {
        year: "1993",
        title: "Professional Football",
        text: "Ghana entered a new professional era with the first professional Premier League competition.",
    },
    {
        year: "2020s",
        title: "A Modern League",
        text: "The competition has continued to develop through stronger administration, club licensing and commercial structures.",
    },
    ];

    const leagueTable = [
    { position: 1, team: "Medeama SC", played: 4, won: 2, drawn: 2, lost: 0, gd: "+4", points: 8 },
    { position: 2, team: "FC Samartex 1996", played: 4, won: 2, drawn: 2, lost: 0, gd: "+3", points: 8 },
    { position: 3, team: "Hearts of Oak", played: 4, won: 2, drawn: 1, lost: 1, gd: "+4", points: 7 },
    { position: 4, team: "FC AshantiGold 04", played: 4, won: 2, drawn: 1, lost: 1, gd: "+2", points: 7 },
    { position: 5, team: "Port City FC", played: 4, won: 2, drawn: 1, lost: 1, gd: "+2", points: 7 },
    { position: 6, team: "Aduana FC", played: 4, won: 2, drawn: 1, lost: 1, gd: "+2", points: 7 },
    { position: 7, team: "Bechem United", played: 4, won: 2, drawn: 1, lost: 1, gd: "0", points: 7 },
    { position: 8, team: "Karela United", played: 4, won: 2, drawn: 0, lost: 2, gd: "0", points: 6 },
    { position: 9, team: "Basake Holy Stars", played: 4, won: 2, drawn: 0, lost: 2, gd: "-2", points: 6 },
    { position: 10, team: "Vision FC", played: 4, won: 1, drawn: 2, lost: 1, gd: "+1", points: 5 },
    { position: 11, team: "Heart of Lions", played: 4, won: 1, drawn: 2, lost: 1, gd: "0", points: 5 },
    { position: 12, team: "Swedru All Blacks", played: 4, won: 1, drawn: 2, lost: 1, gd: "0", points: 5 },
    { position: 13, team: "Asante Kotoko", played: 4, won: 1, drawn: 2, lost: 1, gd: "-1", points: 5 },
    { position: 14, team: "Debibi United", played: 4, won: 1, drawn: 1, lost: 2, gd: "+1", points: 4 },
    { position: 15, team: "Berekum Chelsea", played: 4, won: 1, drawn: 1, lost: 2, gd: "-3", points: 4 },
    { position: 16, team: "Bibiani Gold Stars", played: 4, won: 1, drawn: 0, lost: 3, gd: "-3", points: 3 },
    { position: 17, team: "Young Apostles", played: 4, won: 1, drawn: 0, lost: 3, gd: "-6", points: 3 },
    { position: 18, team: "Dreams FC", played: 4, won: 0, drawn: 1, lost: 3, gd: "-4", points: 1 },
    ];

    export default function GhanaPremierLeague({
    onNavigate,
    }: GhanaPremierLeagueProps) {
    const clubGroups = [
        {
        title: "The Established Giants",
        subtitle: "Tradition. History. Passion.",
        clubs: premierLeagueClubs.slice(0, 6),
        },
        {
        title: "The Title Challengers",
        subtitle: "Ambition. Quality. Competition.",
        clubs: premierLeagueClubs.slice(6, 12),
        },
        {
        title: "The Rising Contenders",
        subtitle: "New battles. New stories.",
        clubs: premierLeagueClubs.slice(12, 18),
        },
    ];

    return (
        <main className="min-h-screen bg-[#050505] text-white">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2rem] border-4 border-red-500 bg-black">
            <Image
            src="/Ghana-Premier-League-Graphics/gpl-hero3.png"
            alt="Ghana Premier League"
            width={1920}
            height={700}
            priority
            className="h-auto w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-5 text-center sm:pb-8">
            <h1 className="text-xl font-black  uppercase leading-tight text-white sm:text-3xl md:text-4xl">
                The Story of Ghana&apos;s Top Flight
            </h1>
            </div>
        </section>

        {/* QUICK STATS */}
        <section className="border-b border-white/10 bg-[#080808]">
            <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
            {stats.map((stat, index) => (
                <div
                key={stat.label}
                className={`min-w-0 px-4 py-7 sm:px-8 sm:py-10 ${
                    index !== 0 ? "border-l border-white/10" : ""
                }`}
                >
                <p className="break-words text-2xl font-black sm:text-4xl">
                    {stat.number}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:text-xs sm:tracking-[0.18em]">
                    {stat.label}
                </p>
                </div>
            ))}
            </div>
        </section>

        {/* HISTORY */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                The Story
            </p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                A legacy that lives on
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                From the early days of Ghanaian national football to the modern
                professional era, the Premier League has played a major role in
                shaping the country&apos;s football culture.
            </p>
            </div>

            <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] lg:grid-cols-2">
            <div className="relative min-h-[320px] overflow-hidden sm:min-h-[450px]">
                <Image
                src="/Ghana-Premier-League-Graphics/gpl-history-old.png"
                alt="History of the Ghana Premier League"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-10">
                <div className="space-y-8">
                {history.map((item) => (
                    <div
                    key={item.year}
                    className="relative border-l border-red-500/40 pl-6"
                    >
                    <span className="text-sm font-black text-red-500">
                        {item.year}
                    </span>
                    <h3 className="mt-1 text-xl font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        {item.text}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </section>

        {/* CLUBS THAT DEFINE THE LEAGUE */}
        <section className="bg-black px-4 py-16 text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">
            <div className="mb-10">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                The Clubs
                </p>
                <h2 className="text-3xl font-black uppercase sm:text-5xl">
                Clubs That Define the League
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Meet the clubs, communities and football traditions that shape
                Ghana&apos;s top-flight competition.
                </p>
            </div>

            <div className="space-y-10">
                {clubGroups.map((group, groupIndex) => (
                <div key={group.title}>
                    <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-500">
                        Group {String(groupIndex + 1).padStart(2, "0")}
                        </p>
                        <h3 className="text-xl font-extrabold uppercase sm:text-2xl">
                        {group.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                        {group.subtitle}
                        </p>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-gray-500">
                        {String(group.clubs.length).padStart(2, "0")} CLUBS
                    </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {group.clubs.map((club, index) => (
                        <article
                        key={club.id}
                        className="group min-w-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-red-500/70"
                        >
                        <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-zinc-900 to-black p-5">
                            <Image
                            src={club.image}
                            alt={`${club.name} crest`}
                            width={160}
                            height={160}
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 15vw"
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                            />
                        </div>

                        <div className="border-t border-white/10 p-3">
                            <p className="mb-1 text-xs font-bold text-red-500">
                            CLUB{" "}
                            {String(groupIndex * 6 + index + 1).padStart(2, "0")}
                            </p>
                            <h4 className="break-words text-sm font-bold leading-5 text-white">
                            {club.name}
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                            {club.location}
                            </p>
                        </div>
                        </article>
                    ))}
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* LEAGUE TABLE */}
        <section className="border-y border-white/10 bg-[#080808]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mb-10">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                2026/27 Standings
                </p>
                <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                The League Table
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Follow the Ghana Premier League standings and see how the title
                race is taking shape.
                </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-white">
                    <thead>
                    <tr className="bg-[#1a1a1a]">
                        <th style={tableHeaderStyle}>Pos</th>
                        <th style={{ ...tableHeaderStyle, textAlign: "left" }}>
                        Club
                        </th>
                        <th style={tableHeaderStyle}>P</th>
                        <th style={tableHeaderStyle}>W</th>
                        <th style={tableHeaderStyle}>D</th>
                        <th style={tableHeaderStyle}>L</th>
                        <th style={tableHeaderStyle}>GD</th>
                        <th style={tableHeaderStyle}>Pts</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leagueTable.map((team) => (
                        <tr
                        key={team.position}
                        style={{
                            backgroundColor:
                            team.position === 1
                                ? "rgba(239,68,68,0.08)"
                                : "#000",
                        }}
                        >
                        <td style={tableCellStyle}>
                            <strong
                            style={{
                                color: team.position <= 4 ? "#ef4444" : "#aaa",
                            }}
                            >
                            {team.position}
                            </strong>
                        </td>
                        <td
                            style={{
                            ...tableCellStyle,
                            textAlign: "left",
                            fontWeight: 700,
                            }}
                        >
                            {team.team}
                        </td>
                        <td style={tableCellStyle}>{team.played}</td>
                        <td style={tableCellStyle}>{team.won}</td>
                        <td style={tableCellStyle}>{team.drawn}</td>
                        <td style={tableCellStyle}>{team.lost}</td>
                        <td style={tableCellStyle}>{team.gd}</td>
                        <td
                            style={{
                            ...tableCellStyle,
                            fontWeight: 900,
                            color: "white",
                            }}
                        >
                            {team.points}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <div className="flex flex-wrap gap-5 px-5 py-5 text-xs text-[#777]">
                <span>P = Played</span>
                <span>W = Won</span>
                <span>D = Drawn</span>
                <span>L = Lost</span>
                <span>GD = Goal Difference</span>
                <span>Pts = Points</span>
                </div>
            </div>
            </div>
        </section>

        {/* HONOURS AND RIVALRY */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                Honours &amp; Rivalry
            </p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                A league built on winners
            </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
            <Image
                src="/Ghana-Premier-League-Graphics/gpl-clubs2.png"
                alt="Ghana Premier League honours and rivalry"
                width={1024}
                height={1536}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="h-auto w-full"
            />
            </div>
        </section>

        {/* SUPER CLASH */}
        <section className="border-y border-white/10 bg-red-950/10">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                    The Rivalry
                </p>
                <h2 className="mt-3 text-4xl font-black sm:text-6xl">
                    The Super Clash
                </h2>
                <p className="mt-6 max-w-xl leading-7 text-gray-400">
                    Asante Kotoko and Hearts of Oak are two of the clubs most
                    closely associated with the history and identity of Ghanaian
                    football.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-red-500/20 bg-black p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                        Kumasi
                    </p>
                    <h3 className="mt-2 text-lg font-black">Asante Kotoko</h3>
                    </div>

                    <div className="rounded-2xl border border-blue-500/20 bg-black p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                        Accra
                    </p>
                    <h3 className="mt-2 text-lg font-black">Hearts of Oak</h3>
                    </div>
                </div>
                </div>

                <div className="relative min-h-[260px] overflow-hidden rounded-3xl border border-white/10 bg-black sm:min-h-[380px]">
                <Image
                    src="/Ghana-Premier-League-Graphics/gpl-rivalry-honours.png"
                    alt="Ghana football's historic rivalry"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                />
                </div>
            </div>
            </div>
        </section>

        {/* 2026/27 SEASON */}
        <section
            id="season"
            className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
            <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                Current Campaign
            </p>
            <h2 className="mt-3 text-4xl font-black sm:text-6xl">2026/27</h2>
            <p className="mt-3 text-gray-500">
                A new chapter of Ghana Premier League football.
            </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
            <Image
                src="/Ghana-Premier-League-Graphics/gpl-season2.png"
                alt="2026/27 Ghana Premier League season"
                width={1024}
                height={1536}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="h-auto w-full"
            />
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
                <p className="text-4xl font-black text-red-500">18</p>
                <h3 className="mt-3 font-bold">Clubs</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                The league is structured around an 18-club competition. Confirm
                the official roster for the season before publication.
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
                <p className="text-4xl font-black text-red-500">34</p>
                <h3 className="mt-3 font-bold">Matches per club</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                In an 18-team double round-robin format, each club plays the
                other 17 clubs home and away.
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
                <p className="text-4xl font-black text-red-500">2</p>
                <h3 className="mt-3 font-bold">Meetings per opponent</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                Each team is scheduled to meet every other team twice in the
                standard home-and-away format.
                </p>
            </div>
            </div>
        </section>

        {onNavigate && <GhanaNewsDeskCallout topic="Ghana Premier League" currentPage="ghana-premier-league" onNavigate={onNavigate} />}

        {/* BACK HOME */}
        <section className="border-t border-white/10 bg-[#080808]">
            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-500">
                The Sports Digest
                </p>
                <h2 className="mt-2 text-2xl font-black">
                Where Sport Meets Story.
                </h2>
            </div>

            {onNavigate && (
                <button
                type="button"
                onClick={() => onNavigate("home")}
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
                >
                ← Back to Home
                </button>
            )}
            </div>
        </section>
        </main>
    );
    }
