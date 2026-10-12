    "use client";

    import Image from "next/image";

    interface GhanaFACupProps {
    onNavigate?: (page: string) => void;
    onToast?: (message: string) => void;
    }

    const stats = [
    {
        number: "1958",
        label: "First Edition",
    },
    {
        number: "19",
        label: "Different Winners",
    },
    {
        number: "Nations FC",
        label: "2025/26 Champions",
    },
    {
        number: "2027",
        label: "Historic Two-Legged Final",
    },
    ];

    const historicClubs = [
    {
        year: "1958",
        title: "Asante Kotoko",
        description:
        "Asante Kotoko became the first champions of the Ghana FA Cup, defeating Accra Hearts of Oak in the inaugural final.",
    },
    {
        year: "1961 – 1963",
        title: "Real Republicans",
        description:
        "Real Republicans established an early dynasty by winning the competition three consecutive times.",
    },
    {
        year: "1960s – 1990s",
        title: "The Giants",
        description:
        "Hearts of Oak, Great Olympics, Eleven Wise, Hasaacas and Okwahu United all became part of the competition's rich history.",
    },
    {
        year: "Modern Era",
        title: "A Wider Race",
        description:
        "Clubs such as Nania FC, New Edubiase United, Bechem United, Medeama, Dreams FC and Nsoatreman have added new chapters.",
    },
    ];

    const recentMoments = [
    {
        year: "2011",
        title: "Nania FC's Giant-Killing Run",
        description:
        "Nania FC captured the imagination of Ghanaian football by defeating Asante Kotoko 1 – 0 in the final.",
    },
    {
        year: "2023",
        title: "Dreams FC Lift the Trophy",
        description:
        "Dreams FC won the FA Cup in the 2022/23 season, adding their name to the modern list of champions.",
    },
    {
        year: "2024",
        title: "Nsoatreman Make History",
        description:
        "Nsoatreman FC defeated Bofoakwa Tano on penalties after a 1 – 1 draw to claim their first FA Cup title.",
    },
    {
        year: "2026",
        title: "Nations FC's Historic Triumph",
        description:
        "Nations FC defeated Dreams FC 5 – 4 on penalties after a 1 – 1 draw after extra time to win their first FA Cup.",
    },
    ];

    const nationsJourney = [
    {
        title: "First Final",
        text: "Nations FC reached the FA Cup final for the first time in the club's history.",
    },
    {
        title: "The Final",
        text: "They faced Dreams FC at the University of Ghana Stadium in the 2025/26 final.",
    },
    {
        title: "A Dramatic Finish",
        text: "The match ended 1 – 1 after extra time before Nations FC prevailed 5 – 4 in the penalty shootout.",
    },
    {
        title: "A New Chapter",
        text: "The triumph earned Nations FC a place in the CAF Confederation Cup and added their name to the FA Cup roll of honour.",
    },
    ];

    const road2026_27 = [
    {
        stage: "Preliminary Round",
        date: "October 23 – 26, 2026",
    },
    {
        stage: "Round of 64",
        date: "November 27 – 30, 2026",
    },
    {
        stage: "Round of 32",
        date: "February 12 – 15, 2027",
    },
    {
        stage: "Quarter-finals",
        date: "March 19 – 22, 2027",
    },
    {
        stage: "Semi-finals",
        date: "April 23 – 26, 2027",
    },
    {
        stage: "Final — Leg 1",
        date: "June 5 – 7, 2027",
    },
    {
        stage: "Final — Leg 2",
        date: "June 12 – 13, 2027",
    },
    ];

    export default function GhanaFACup({
    onNavigate,
    }: GhanaFACupProps) {
    return (
        <main className="bg-black text-white">
        {/* HERO */}
        <section className="relative min-h-[75vh] overflow-hidden">
            <Image
            src="/Ghana-FA-Cup-Graphics/ghana-fa-cup-hero.png"
            alt="Ghana FA Cup"
            fill
            priority
            className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />

            <div className="relative z-10 flex min-h-[75vh] items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 lg:px-12">
                <div className="max-w-4xl">
                

                <h1 className="text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Ghana FA Cup
                </h1>

                <p className="mt-4 max-w-2xl text-lg font-medium text-gray-200 md:text-xl">
                    Where Every Club Dreams
                </p>

                <p className="mt-5 max-w-2xl leading-7 text-gray-300">
                    Ghana&apos;s great knockout competition — a tournament where
                    clubs from different levels of the football pyramid can chase
                    one trophy and create unforgettable moments.
                </p>
                </div>
            </div>
            </div>
        </section>

        {/* QUICK STATS */}
        <section className="border-y border-white/10 bg-zinc-950">
            <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
                <div
                key={stat.label}
                className="border-r border-white/10 px-5 py-8 last:border-r-0 md:px-8 md:py-10"
                >
                <p className="text-2xl font-black text-red-500 md:text-3xl">
                    {stat.number}
                </p>

                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-400 md:text-sm">
                    {stat.label}
                </p>
                </div>
            ))}
            </div>
        </section>

        {/* THE BEGINNING */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                The Beginning
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-5xl">
                A Competition Built for Everyone
                </h2>

                <p className="mt-6 leading-8 text-gray-400">
                The Ghana FA Cup dates back to 1958, just a year after Ghana&apos;s
                independence. Asante Kotoko became the inaugural champions after
                defeating Accra Hearts of Oak.
                </p>

                <p className="mt-5 leading-8 text-gray-400">
                Over the decades, the competition has brought together some of
                Ghana&apos;s biggest clubs while also creating opportunities for
                lower-tier sides to challenge established football powers.
                </p>

                <p className="mt-5 leading-8 text-gray-400">
                Nineteen different clubs have lifted the trophy since its
                inception, underlining the unpredictable character of the
                competition.
                </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                <Image
                src="/Ghana-FA-Cup-Graphics/ghana-fa-cup-history.png"
                alt="History of the Ghana FA Cup"
                fill
                className="object-cover"
                />
            </div>
            </div>
        </section>

        {/* HISTORIC GIANTS */}
        <section className="bg-zinc-950 px-6 py-20 md:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                The Giants
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                Names That Shaped the Cup
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-gray-400">
                From the earliest champions to modern challengers, generations of
                Ghanaian clubs have left their mark on the competition.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {historicClubs.map((club) => (
                <article
                    key={club.title}
                    className="rounded-2xl border border-white/10 bg-black p-6 transition hover:-translate-y-1 hover:border-yellow-400/40"
                >
                    <p className="text-sm font-bold text-red-500">
                    {club.year}
                    </p>

                    <h3 className="mt-3 text-xl font-black uppercase">
                    {club.title}
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-gray-400">
                    {club.description}
                    </p>
                </article>
                ))}
            </div>
            </div>
        </section>

        {/* GREATEST MOMENTS */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
                <Image
                src="/Ghana-FA-Cup-Graphics/fa-cup-greatest-moments-old.png"
                alt="Greatest Ghana FA Cup moments"
                fill
                className="object-cover"
                />
            </div>

            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                Greatest Moments
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                When the Cup Wrote Its Own Stories
                </h2>

                <div className="mt-8 space-y-4">
                {recentMoments.map((moment) => (
                    <div
                    key={moment.title}
                    className="rounded-xl border border-white/10 bg-zinc-950 p-5"
                    >
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-red-500">
                        {moment.year}
                        </span>

                        <h3 className="font-bold">{moment.title}</h3>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                        {moment.description}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </section>

        {/* MODERN ERA */}
        <section className="bg-zinc-950 px-6 py-20 md:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                Modern Era
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                The Cup Keeps Changing
            </h2>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                <p className="leading-8 text-gray-400">
                    The modern FA Cup has continued to produce unexpected winners
                    and memorable runs. Clubs outside the traditional giants have
                    repeatedly shown that the knockout format can change everything
                    in ninety minutes — or even after extra time and penalties.
                </p>

                <p className="mt-5 leading-8 text-gray-400">
                    The competition also gives clubs a route toward continental
                    football, making every round meaningful for teams chasing a
                    place on the African stage.
                </p>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                <Image
                    src="/Ghana-FA-Cup-Graphics/fa-cup-modern-era.png"
                    alt="Modern Ghana FA Cup era"
                    fill
                    className="object-cover"
                />
                </div>
            </div>
            </div>
        </section>

        {/* 2025/26 */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
            <div className="overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-zinc-950 to-black">
            <div className="grid lg:grid-cols-2">
                <div className="relative min-h-[420px]">
                <Image
                    src="/Ghana-FA-Cup-Graphics/fa-cup-2025-26.png"
                    alt="Nations FC 2025/26 FA Cup triumph"
                    fill
                    className="object-cover"
                />
                </div>

                <div className="p-8 md:p-12">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                    2025/26
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                    Nations FC Make History
                </h2>

                <p className="mt-6 leading-8 text-gray-300">
                    Nations FC reached the FA Cup final for the first time and
                    faced Dreams FC at the University of Ghana Stadium.
                </p>

                <p className="mt-5 leading-8 text-gray-400">
                    After a 1 – 1 draw through extra time, the final went to
                    penalties. Nations FC held their nerve to win the shootout
                    5 – 4 and lift the trophy for the first time.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <p className="text-2xl font-black text-red-500">1 – 1</p>
                    <p className="mt-1 text-xs uppercase text-gray-500">
                        After Extra Time
                    </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <p className="text-2xl font-black text-red-500">5 – 4</p>
                    <p className="mt-1 text-xs uppercase text-gray-500">
                        Penalty Shootout
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* 2026/27 */}
        <section className="bg-zinc-950 px-6 py-20 md:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                2026/27 Season
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                A New Era Begins
                </h2>

                <p className="mt-5 leading-8 text-gray-400">
                The road to the next FA Cup final begins in October 2026. The
                competition will again bring clubs from different levels of
                Ghanaian football together in the pursuit of the trophy.
                </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {road2026_27.map((stage, index) => (
                <div
                    key={stage.stage}
                    className="relative rounded-2xl border border-white/10 bg-black p-6"
                >
                    <span className="absolute right-5 top-5 text-xs font-black text-red-500">
                    {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="text-lg font-black uppercase">
                    {stage.stage}
                    </p>

                    <p className="mt-2 text-sm text-gray-400">{stage.date}</p>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* TWO-LEGGED FINAL */}
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-black-500" />

            <div className="relative mx-auto max-w-7xl px-6 py-20 text-red-500 md:px-10 lg:px-12">
            <div className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-[0.25em]">
                History in the Making
                </p>

                <h2 className="mt-3 text-4xl font-black text-white uppercase leading-tight md:text-6xl">
                The Final Will Be Different
                </h2>

                <p className="mt-6 max-w-2xl  text-gray-400 text-lg font-medium leading-8">
                For the first time in Ghanaian domestic football history, the
                MTN FA Cup final will be contested over two legs.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-black p-6 text-white">
                    <p className="text-sm uppercase tracking-wider text-red-500">
                    First Leg
                    </p>
                    <p className="mt-2 text-2xl font-black">
                    June 5 – 7, 2027
                    </p>
                </div>

                <div className="rounded-2xl bg-black p-6 text-white">
                    <p className="text-sm uppercase tracking-wider text-red-500">
                    Return Leg
                    </p>
                    <p className="mt-2 text-2xl font-black">
                    June 12 – 13, 2027
                    </p>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* CURRENT CHAPTER */}
        <section className="mx-auto max-w-7xl px-6 py-20 text-center md:px-10 lg:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Current Chapter
            </p>

            <h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black uppercase md:text-5xl">
            The Road to Another Final Has Begun
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
            From the preliminary draw to the historic two-legged final, another
            chapter of Ghana&apos;s FA Cup story is about to be written.
            </p>

            
            
            
            
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
        </section>
        </main>
    );
    }

        