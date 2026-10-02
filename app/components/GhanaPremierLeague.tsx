    "use client";

    import Image from "next/image";

    interface GhanaPremierLeagueProps {
    onNavigate?: (page: string) => void;
    onToast?: (message: string) => void;
    }

    const stats = [
    {
        number: "1956",
        label: "Officially formed",
    },
    {
        number: "1993",
        label: "Professional era",
    },
    {
        number: "18",
        label: "Current clubs",
    },
    {
        number: "2026/27",
        label: "Current season",
    },
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

    export default function GhanaPremierLeague({
    onNavigate,
    }: GhanaPremierLeagueProps) {
    return (
        <main className="min-h-screen bg-[#050505] text-white" >

                {/* =========================================
            HERO
        ========================================= */}
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2rem] border-4 border-red-500 bg-yellow-300">
        <Image
            src="/Ghana-Premier-League-Graphics/gpl-hero.png"
            alt="Ghana Premier League"
            width={1920}
            height={700}
            priority
            className="h-auto w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">
        

            <h1 className="text-4xl font-black text-white md:text-6xl">
            The Story of Ghana's Top Flight
            </h1>
        </div>
        </section>

        {/* =========================================
            QUICK STATS
        ========================================= */}
        <section className="border-b border-white/10 bg-[#080808]">
            <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
            {stats.map((stat, index) => (
                <div
                key={stat.label}
                className={`px-5 py-8 sm:px-8 sm:py-10 ${
                    index !== 0 ? "border-l border-white/10" : ""
                }`}
                >
                <p className="text-3xl font-black sm:text-4xl">
                    {stat.number}
                </p>

                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
                    {stat.label}
                </p>
                </div>
            ))}
            </div>
        </section>

        {/* =========================================
            HISTORY
        ========================================= */}
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
                shaping the country's football culture.
            </p>
            </div>

            <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] lg:grid-cols-2">
            <div className="relative overflow-hidden">
        <Image
            src="/Ghana-Premier-League-Graphics/gpl-history.png"
            alt="History of the Ghana Premier League"
            width={1024}
            height={1536}
            className="h-auto w-full"
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

                    <h3 className="mt-1 text-xl font-bold">
                        {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        {item.text}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </section>

        {/* =========================================
            CLUBS
        ========================================= */}
        <section className="bg-[#0b0b0b] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mb-10">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                The Clubs
                </p>

                <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Clubs that define the league
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
                Historic giants and modern challengers have all contributed to
                the story of Ghanaian domestic football.
                </p>
            </div>

            {/* Main graphic */}
            <div className="mb-8 overflow-hidden rounded-3xl border border-white/10">
                <Image
                src="/Ghana-Premier-League-Graphics/gpl-clubs.png"
                alt="Ghana Premier League clubs and championship celebration"
                width={1024}
                height={1536}
                className="h-auto w-full"
                />
            </div>
            </div>
            </section>

        {/* =========================================
            HONOURS + RIVALRY
        ========================================= */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                Honours & Rivalry
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                A league built on winners
            </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
            <Image
                src="/Ghana-Premier-League-Graphics/gpl-rivalry-honours.png"
                alt="Ghana Premier League honours and Super Clash"
                width={1024}
                height={1536}
                className="h-auto w-full"
            />
            </div>

        </section>

        {/* =========================================
            SUPER CLASH STORY
        ========================================= */}
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
                    closely associated with the history and identity of the Ghana
                    Premier League.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">

                    <div className="rounded-2xl border border-red-500/20 bg-black p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-600">
                        Kumasi
                    </p>

                    <h3 className="mt-2 text-lg font-black">
                        Asante Kotoko
                    </h3>
                    </div>

                    <div className="rounded-2xl border border-blue-500/20 bg-black p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-600">
                        Accra
                    </p>

                    <h3 className="mt-2 text-lg font-black">
                        Hearts of Oak
                    </h3>
                    </div>

                </div>
                </div>


            </div>
            </div>
        </section>

        {/* =========================================
            2026/27 SEASON
        ========================================= */}
        <section
            id="season"
            className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >

            <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                Current Campaign
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-6xl">
                2026/27
            </h2>

            <p className="mt-3 text-gray-500">
                A new chapter of Ghana Premier League football.
            </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
            <Image
                src="/Ghana-Premier-League-Graphics/gpl-season.png"
                alt="2026/27 Ghana Premier League season"
                width={1024}
                height={1536}
                className="h-auto w-full"
            />
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
                <p className="text-4xl font-black text-red-500">
                18
                </p>

                <h3 className="mt-3 font-bold">
                Clubs
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                Eighteen clubs are competing in the 2026/27 campaign.
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
                <p className="text-4xl font-black text-red-500">
                3
                </p>

                <h3 className="mt-3 font-bold">
                Debutants
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                Port City, Ashantigold '04 and Debibi United enter the league as
                debutants.
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
                <p className="text-4xl font-black text-red-500">
                34
                </p>

                <h3 className="mt-3 font-bold">
                Matches per club
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                Each club has a 34-match league campaign.
                </p>
            </div>

            </div>

        </section>

        {/* =========================================
            BACK HOME
        ========================================= */}
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