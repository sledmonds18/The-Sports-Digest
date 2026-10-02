    "use client";

    interface SportsPageProps {
    section: string;
    onNavigate: (page: string) => void;
    onToast?: (message: string) => void;
    }

    interface NewsStory {
    category: string;
    title: string;
    excerpt: string;
    image: string;
    }

    interface Fixture {
    competition: string;
    home: string;
    away: string;
    date: string;
    time: string;
    }

    const titles: Record<string, string> = {
    "ghana-premier-league": "Ghana Premier League",
    "black-stars": "Black Stars",
    "black-queens": "Black Queens",
    "ghana-fa-cup": "Ghana FA Cup",
    "division-one": "Division One League",
    "ghana-football": "Ghana Football News",
    "ghana-sports": "Ghana Sports News",

    "premier-league": "Premier League",
    "champions-league": "UEFA Champions League",
    "la-liga": "La Liga",
    "bundesliga": "Bundesliga",
    "serie-a": "Serie A",
    "ligue-1": "Ligue 1",
    "mls": "MLS",
    "international-football": "International Football",
    "fifa": "FIFA",
    "uefa": "UEFA",

    "transfers": "Football Transfers",
    "live": "Live Football",
    "fixtures": "Football Fixtures",
    "results": "Football Results",
    "standings": "Football Standings",
    };

    const sportImages = {
    football:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=85",
    football2:
        "https://images.unsplash.com/photo-1526232761682-d26e03ac1483?w=900&q=85",
    football3:
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=85",
    football4:
        "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=900&q=85",
    };

    const footballNews: NewsStory[] = [
    {
        category: "Ghana Premier League",
        title: "The Ghana Premier League Race Is Heating Up",
        excerpt:
        "The early stages of the 2026/27 campaign are already producing important results as clubs battle for points at both ends of the table.",
        image: sportImages.football,
    },
    {
        category: "Black Stars",
        title: "A New Generation of Black Stars Emerges",
        excerpt:
        "Ghana's next generation of football talent continues to attract attention as the national team looks toward the future.",
        image: sportImages.football2,
    },
    {
        category: "International",
        title: "European Football Enters Another Competitive Weekend",
        excerpt:
        "Clubs across Europe's major leagues continue their campaigns with crucial fixtures and growing pressure for points.",
        image: sportImages.football3,
    },
    {
        category: "Transfers",
        title: "Transfer Watch: Clubs Continue to Build for the Season",
        excerpt:
        "Keep track of the latest transfer stories, squad developments and reported moves from around the football world.",
        image: sportImages.football4,
    },
    ];

    const fixtures: Fixture[] = [
    {
        competition: "Ghana Premier League",
        home: "Dreams FC",
        away: "Hearts of Oak",
        date: "Sun, Oct 4",
        time: "TBC",
    },
    {
        competition: "Ghana Premier League",
        home: "Samartex",
        away: "Young Apostles",
        date: "Sun, Oct 4",
        time: "TBC",
    },
    {
        competition: "Ghana Premier League",
        home: "Medeama",
        away: "Debibi United",
        date: "Sun, Oct 4",
        time: "TBC",
    },
    ];

    export default function SportsPage({
    section,
    onNavigate,
    }: SportsPageProps) {
    const title = titles[section] || "Football";

    const isGhana =
        section.includes("ghana") ||
        section === "black-stars" ||
        section === "black-queens";

    const isInternational =
        section === "premier-league" ||
        section === "champions-league" ||
        section === "la-liga" ||
        section === "bundesliga" ||
        section === "serie-a" ||
        section === "ligue-1" ||
        section === "mls" ||
        section === "international-football" ||
        section === "fifa" ||
        section === "uefa";

    const sectionLabel = isGhana
        ? "GHANA FOOTBALL"
        : isInternational
        ? "WORLD FOOTBALL"
        : "FOOTBALL";

    return (
        <main className="min-h-screen bg-gray-50 text-black">

        {/* =====================================================
            HERO HEADER
        ====================================================== */}
        <section className="relative overflow-hidden bg-black text-white">

            <div className="absolute inset-0 opacity-20">
            <img
                src={sportImages.football}
                alt=""
                className="h-full w-full object-cover"
            />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50" />

            <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-red-500">
                The Sports Digest
            </p>

            <div className="flex items-center gap-3">
                <span className="h-1 w-10 bg-red-600" />
                <span className="text-sm font-bold uppercase tracking-widest text-gray-300">
                {sectionLabel}
                </span>
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                {title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                Your destination for breaking news, match coverage, analysis,
                fixtures, results, statistics and the stories shaping football.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

                <button
                onClick={() => onNavigate("articles")}
                className="rounded-lg bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                Latest Stories
                </button>

                <button
                onClick={() => onNavigate("live")}
                className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-black"
                >
                🔴 Live Scores
                </button>

            </div>

            </div>
        </section>


        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <section className="mx-auto max-w-7xl px-6 py-12">

            {/* =================================================
                FEATURED STORY
            ================================================== */}
            <section>

            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                    Top Story
                </p>

                <h2 className="mt-2 text-3xl font-black md:text-4xl">
                    Featured Football
                </h2>
                </div>

                <button
                onClick={() => onNavigate("articles")}
                className="hidden text-sm font-bold text-red-600 hover:underline sm:block"
                >
                View all stories →
                </button>
            </div>


            <article className="group overflow-hidden rounded-2xl bg-white shadow-lg">

                <div className="grid md:grid-cols-2">

                <div className="relative min-h-[300px] overflow-hidden md:min-h-[430px]">

                    <img
                    src={footballNews[0].image}
                    alt={footballNews[0].title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <span className="absolute bottom-5 left-5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase text-white">
                    Featured
                    </span>

                </div>


                <div className="flex flex-col justify-center p-7 md:p-10">

                    <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                    {footballNews[0].category}
                    </p>

                    <h3 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                    {footballNews[0].title}
                    </h3>

                    <p className="mt-5 leading-7 text-gray-600">
                    {footballNews[0].excerpt}
                    </p>

                    <div className="mt-7 flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <span>THE SPORTS DIGEST</span>
                    <span>•</span>
                    <span>Football</span>
                    </div>

                    <button
                    onClick={() => onNavigate("articles")}
                    className="mt-7 w-fit rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                    >
                    Read Story →
                    </button>

                </div>

                </div>

            </article>

            </section>


            {/* =================================================
                LATEST NEWS
            ================================================== */}
            <section className="mt-16">

            <div className="mb-7 flex items-end justify-between">

                <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                    Newsroom
                </p>

                <h2 className="mt-2 text-3xl font-black">
                    Latest Football News
                </h2>
                </div>

                <button
                onClick={() => onNavigate("articles")}
                className="text-sm font-bold text-red-600 hover:underline"
                >
                More news →
                </button>

            </div>


            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {footballNews.map((story, index) => (

                <article
                    key={story.title}
                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                    <div className="relative h-52 overflow-hidden">

                    <img
                        src={story.image}
                        alt={story.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    <span className="absolute left-3 top-3 rounded-md bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        {story.category}
                    </span>

                    </div>


                    <div className="p-5">

                    <p className="text-xs font-semibold text-gray-400">
                        THE SPORTS DIGEST
                    </p>

                    <h3 className="mt-2 text-lg font-black leading-snug">
                        {story.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        {story.excerpt}
                    </p>

                    <button
                        onClick={() => onNavigate("articles")}
                        className="mt-4 text-sm font-bold text-red-600 hover:underline"
                    >
                        Read more →
                    </button>

                    </div>

                </article>

                ))}

            </div>

            </section>


            {/* =================================================
                FOOTBALL CENTRE
            ================================================== */}
            <section className="mt-16">

            <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Match Centre
                </p>

                <h2 className="mt-2 text-3xl font-black">
                Football Centre
                </h2>

                <p className="mt-2 max-w-2xl text-gray-600">
                Follow fixtures, results, standings and live football from
                Ghana and around the world.
                </p>
            </div>


            <div className="grid gap-6 md:grid-cols-3">

                {/* LIVE */}
                <div className="rounded-2xl bg-black p-6 text-white shadow-lg">

                <div className="flex items-center justify-between">

                    <h3 className="text-lg font-black">
                    Live Football
                    </h3>

                    <span className="flex items-center gap-2 text-xs font-bold text-red-500">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    LIVE
                    </span>

                </div>

                <p className="mt-5 text-sm leading-6 text-gray-400">
                    Follow live scores and match updates from major football
                    competitions.
                </p>

                <button
                    onClick={() => onNavigate("live")}
                    className="mt-6 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-700"
                >
                    Open Live Centre
                </button>

                </div>


                {/* FIXTURES */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

                <div className="flex items-center justify-between">

                    <h3 className="text-lg font-black">
                    Fixtures
                    </h3>

                    <span className="text-2xl">📅</span>

                </div>

                <div className="mt-5 space-y-4">

                    {fixtures.slice(0, 2).map((fixture) => (

                    <div
                        key={`${fixture.home}-${fixture.away}`}
                        className="border-b pb-4 last:border-0 last:pb-0"
                    >

                        <p className="text-[10px] font-bold uppercase tracking-wide text-red-600">
                        {fixture.competition}
                        </p>

                        <p className="mt-1 text-sm font-bold">
                        {fixture.home}
                        </p>

                        <p className="text-sm text-gray-500">
                        vs {fixture.away}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                        {fixture.date}
                        </p>

                    </div>

                    ))}

                </div>

                <button
                    onClick={() => onNavigate("fixtures")}
                    className="mt-5 text-sm font-bold text-red-600 hover:underline"
                >
                    View all fixtures →
                </button>

                </div>


                {/* RESULTS */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

                <div className="flex items-center justify-between">

                    <h3 className="text-lg font-black">
                    Latest Results
                    </h3>

                    <span className="text-2xl">📊</span>

                </div>

                <div className="mt-5 rounded-xl bg-gray-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    Ghana Premier League
                    </p>

                    <div className="mt-3 flex items-center justify-between">

                    <span className="text-sm font-bold">
                        Latest Results
                    </span>

                    <span className="rounded-md bg-black px-3 py-1 text-xs font-bold text-white">
                        FT
                    </span>

                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                    Check the complete results centre for recent matches.
                    </p>

                </div>

                <button
                    onClick={() => onNavigate("results")}
                    className="mt-5 text-sm font-bold text-red-600 hover:underline"
                >
                    View results →
                </button>

                </div>

            </div>

            </section>


            {/* =================================================
                GHANA PREMIER LEAGUE
            ================================================== */}
            <section className="mt-16 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">

            <div className="bg-gradient-to-r from-black to-gray-900 p-7 text-white md:p-9">

                <div className="flex flex-wrap items-center justify-between gap-4">

                <div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                    Ghana Football
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                    Ghana Premier League
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                    Follow the latest league news, fixtures, results and
                    standings from the 2026/27 campaign.
                    </p>

                </div>

                <button
                    onClick={() => onNavigate("ghana-premier-league")}
                    className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold transition hover:bg-red-600"
                >
                    Open GPL Centre →
                </button>

                </div>

            </div>


            <div className="grid gap-0 md:grid-cols-3">

                <div className="border-b p-6 md:border-b-0 md:border-r">

                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Featured
                </p>

                <h3 className="mt-2 text-lg font-black">
                    The title race is taking shape
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                    Keep track of the clubs competing for points during the
                    opening stages of the campaign.
                </p>

                </div>


                <div className="border-b p-6 md:border-b-0 md:border-r">

                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Fixtures
                </p>

                <h3 className="mt-2 text-lg font-black">
                    Matchday 5
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                    Dreams FC face Hearts of Oak, while Samartex meet Young
                    Apostles on Sunday.
                </p>

                </div>


                <div className="p-6">

                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Statistics
                </p>

                <h3 className="mt-2 text-lg font-black">
                    Standings & Top Scorers
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                    Explore league tables, player statistics and team
                    performance.
                </p>

                <button
                    onClick={() => onNavigate("standings")}
                    className="mt-4 text-sm font-bold text-red-600 hover:underline"
                >
                    View standings →
                </button>

                </div>

            </div>

            </section>


            {/* =================================================
                INTERNATIONAL FOOTBALL
            ================================================== */}
            <section className="mt-16">

            <div className="mb-7">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Around the World
                </p>

                <h2 className="mt-2 text-3xl font-black">
                International Football
                </h2>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {[
                ["Premier League", "premier-league"],
                ["Champions League", "champions-league"],
                ["La Liga", "la-liga"],
                ["Bundesliga", "bundesliga"],
                ].map(([name, route]) => (

                <button
                    key={route}
                    onClick={() => onNavigate(route)}
                    className="group rounded-xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg"
                >

                    <div className="flex items-center justify-between">

                    <h3 className="font-black">
                        {name}
                    </h3>

                    <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-600">
                        →
                    </span>

                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                    Latest news, fixtures, results and stories.
                    </p>

                </button>

                ))}

            </div>

            </section>


            {/* =================================================
                QUICK LINKS
            ================================================== */}
            <section className="mt-16">

            <div className="mb-6">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Explore
                </p>

                <h2 className="mt-2 text-3xl font-black">
                Football Shortcuts
                </h2>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <button
                onClick={() => onNavigate("articles")}
                className="rounded-xl bg-black p-5 text-left text-white transition hover:bg-red-600"
                >
                <span className="text-2xl">📰</span>
                <h3 className="mt-3 font-black">
                    Latest Articles
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                    Read the latest football stories.
                </p>
                </button>


                <button
                onClick={() => onNavigate("transfers")}
                className="rounded-xl bg-white p-5 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg"
                >
                <span className="text-2xl">🔄</span>
                <h3 className="mt-3 font-black">
                    Transfers
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Follow transfer stories and squad moves.
                </p>
                </button>


                <button
                onClick={() => onNavigate("standings")}
                className="rounded-xl bg-white p-5 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg"
                >
                <span className="text-2xl">🏆</span>
                <h3 className="mt-3 font-black">
                    Standings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Check tables and competition rankings.
                </p>
                </button>


                <button
                onClick={() => onNavigate("home")}
                className="rounded-xl bg-white p-5 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg"
                >
                <span className="text-2xl">←</span>
                <h3 className="mt-3 font-black">
                    Back to Home
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Return to The Sports Digest homepage.
                </p>
                </button>

            </div>

            </section>

        </section>

        </main>
    );
    }