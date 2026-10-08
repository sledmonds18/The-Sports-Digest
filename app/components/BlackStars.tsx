    "use client";

    import Image from "next/image";

    interface BlackStarsProps {
    onNavigate?: (page: string) => void;
    onToast?: (message: string) => void;
    }

    const stats = [
    { number: "4", label: "AFCON titles", },
    { number: "5", label: "World Cup appearances", }, 
    { number: "2006", label: "First World Cup",  },
    { number: "2010", label: "Best World Cup finish", },   
    ];

    const history = [
    {
        year: "1920",
        title: "The Football Story Begins",
        text: "Organised football began taking shape in the Gold Coast during the early 20th century, laying the foundations for the national game that would later emerge.",
    },
    {
        year: "1957",
        title: "A Nation Is Born",
        text: "Ghana gained independence on 6 March 1957, beginning a new chapter for the country's national identity — including its growing football culture.",
    },
    {
        year: "1958",
        title: "Ghana Joins FIFA",
        text: "Ghana became a FIFA member in 1958, officially entering the international football community and opening the door to competitive global football.",
    },
    {
        year: "1960",
        title: "The Black Stars Take Shape",
        text: "With Ghana's football structures developing rapidly, the national team began establishing the identity and reputation that would soon make the Black Stars a force in Africa.",
    },
    ];

    export default function BlackStars({
    onNavigate,
    }: BlackStarsProps) {
    return (
        <main className="min-h-screen bg-[#050505] text-white">

        {/* =========================================
            HERO
        ========================================= */}
        <section className="relative overflow-hidden rounded-[2rem] border-4 border-red-500 bg-black">

            <Image
            src="/Black-Stars-Graphics/black-stars-hero.png"
            alt="Ghana Black Stars"
            width={1920}
            height={700}
            priority
            className="h-auto w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-4 text-center md:p-6">

            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 sm:text-xs">
                Ghana National Team
            </p>

            <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl md:text-5xl">
                Black Stars: A Nation's Football Story
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
            ORIGINS & HISTORY
        ========================================= */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="mb-10">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                The Beginning
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Before the Black Stars
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Ghana's national football story began long before the Black Stars
                became one of Africa's most recognised teams. From the Gold Coast
                era to independence, football gradually became part of the nation's
                identity.
            </p>

            </div>


            <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] lg:grid-cols-2">

            {/* Historical Image */}
            <div className="relative overflow-hidden">

                            <Image
            src="/Black-Stars-Graphics/black-stars-history.png"
            alt="Historic Ghana national football team"
            width={1024}
            height={1536}
            className="h-full w-full object-cover"
            />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            </div>


            {/* Timeline */}
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

                {/* =========================
            AFCON LEGACY
        ========================== */}
        <section className="border-y border-white/10 bg-[#080808]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="mb-10 max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                African Glory
                </p>

                <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Four stars on the African crown
                </h2>

                <p className="mt-4 leading-7 text-gray-400">
                Before Ghana became a regular presence on the world stage,
                the Black Stars had already established themselves as one of
                Africa's great footballing powers.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                {/* 1963 */}
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] transition hover:border-red-500/40">
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                    src="/Black-Stars-Graphics/afcon-1963.png"
                    alt="Ghana winning the 1963 Africa Cup of Nations"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute bottom-5 left-5">
                    <span className="text-4xl font-black text-white">
                        1963
                    </span>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">
                    First continental crown
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                    Ghana conquers Africa
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                    Ghana hosted the Africa Cup of Nations and won the
                    tournament on home soil, defeating Sudan 3–0 in the final.
                    </p>
                </div>
                </div>

                {/* 1965 */}
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] transition hover:border-red-500/40">
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                    src="/Black-Stars-Graphics/afcon-1965-old.png"
                    alt="Ghana winning the 1965 Africa Cup of Nations"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute bottom-5 left-5">
                    <span className="text-4xl font-black text-white">
                        1965
                    </span>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">
                    Champions again
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                    Back-to-back glory
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                    Ghana successfully defended the continental crown in
                    Tunisia, defeating the hosts in extra time to become
                    champions for the second consecutive tournament.
                    </p>
                </div>
                </div>

                {/* 1978 */}
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] transition hover:border-red-500/40">
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                    src="/Black-Stars-Graphics/afcon-1978.png"
                    alt="Ghana winning the 1978 Africa Cup of Nations"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute bottom-5 left-5">
                    <span className="text-4xl font-black text-white">
                        1978
                    </span>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">
                    Three-time champions
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                    The crown returns home
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                    Hosting the tournament once again, Ghana lifted the
                    continental trophy for a third time after defeating Uganda
                    in the final.
                    </p>
                </div>
                </div>

                {/* 1982 */}
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] transition hover:border-red-500/40">
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                    src="/Black-Stars-Graphics/afcon-1982.png"
                    alt="Ghana winning the 1982 Africa Cup of Nations"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute bottom-5 left-5">
                    <span className="text-4xl font-black text-white">
                        1982
                    </span>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">
                    The fourth crown
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                    Ghana's golden generation
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                    In Libya, Ghana defeated the host nation on penalties
                    after a dramatic final to claim their fourth and most
                    recent Africa Cup of Nations title.
                    </p>
                </div>
                </div>

            </div>

            <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8">
                <p className="text-center text-sm leading-7 text-gray-400">
                Ghana's four AFCON triumphs came in
                <span className="font-black text-white">
                    {" "}1963, 1965, 1978 and 1982
                </span>
                . The Ghana Football Association records the Black Stars as
                four-time continental champions.
                </p>
            </div>

            </div>
        </section>

                {/* =========================
            2006 WORLD CUP
        ========================== */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] lg:grid-cols-2">

            {/* IMAGE */}
            <div className="relative min-h-[320px] overflow-hidden lg:min-h-[520px]">
                <Image
                src="/Black-Stars-Graphics/world-cup-2006.png"
                alt="Ghana Black Stars at the 2006 FIFA World Cup"
                fill
                className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                    Germany 2006
                </p>

                <p className="mt-2 text-5xl font-black text-white">
                    2006
                </p>
                </div>
            </div>

            {/* STORY */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                The breakthrough
                </p>

                <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                Ghana arrives on the world stage
                </h2>

                <p className="mt-6 leading-7 text-gray-400">
                After decades of continental success, Ghana finally reached
                the FIFA World Cup in 2006. The Black Stars made their debut
                in Germany and immediately showed that they belonged among
                the world's elite.
                </p>

                <div className="mt-8 space-y-5">

                <div className="border-l-2 border-red-500 pl-5">
                    <p className="text-sm font-black text-white">
                    Group stage
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                    Ghana competed in Group E alongside Italy, the Czech
                    Republic and the United States.
                    </p>
                </div>

                <div className="border-l-2 border-red-500 pl-5">
                    <p className="text-sm font-black text-white">
                    A historic first win
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                    The Black Stars defeated the Czech Republic 2–0,
                    recording their first World Cup victory.
                    </p>
                </div>

                <div className="border-l-2 border-red-500 pl-5">
                    <p className="text-sm font-black text-white">
                    Round of 16
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                    Ghana advanced from the group and reached the knockout
                    stage in their first appearance.
                    </p>
                </div>

                </div>

                <div className="mt-10 flex flex-wrap gap-3">

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300">
                    First World Cup
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300">
                    Round of 16
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300">
                    Germany 2006
                </span>

                </div>

            </div>

            </div>

        </section>

                {/* =========================
            2010 WORLD CUP
        ========================== */}
        <section className="border-y border-white/10 bg-[#080808]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="mb-10 max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                South Africa 2010
                </p>

                <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                The night Ghana came within a kick of history
                </h2>

                <p className="mt-4 leading-7 text-gray-400">
                Four years after their World Cup debut, the Black Stars went
                even further. Ghana became the third African nation to reach
                a World Cup quarter-final and came agonisingly close to
                becoming the first African semi-finalist.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                {/* GROUP STAGE */}
                <div className="rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 sm:p-8">
                <span className="text-5xl font-black text-red-500">
                    01
                </span>

                <p className="mt-6 text-xs font-black uppercase tracking-widest text-gray-500">
                    Group Stage
                </p>

                <h3 className="mt-2 text-2xl font-black">
                    Ghana survives Group D
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                    The Black Stars finished second in a group containing
                    Germany, Serbia and Australia, securing qualification for
                    the knockout stage.
                </p>
                </div>

                {/* ROUND OF 16 */}
                <div className="rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 sm:p-8">
                <span className="text-5xl font-black text-red-500">
                    02
                </span>

                <p className="mt-6 text-xs font-black uppercase tracking-widest text-gray-500">
                    Round of 16
                </p>

                <h3 className="mt-2 text-2xl font-black">
                    Extra-time victory
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                    Ghana defeated the United States 2–1 after extra time,
                    with Asamoah Gyan scoring the decisive goal from the
                    penalty spot.
                </p>
                </div>

                {/* QUARTER-FINAL */}
                <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-7 sm:p-8">
                <span className="text-5xl font-black text-red-500">
                    03
                </span>

                <p className="mt-6 text-xs font-black uppercase tracking-widest text-red-500">
                    Quarter-final
                </p>

                <h3 className="mt-2 text-2xl font-black">
                    A moment frozen in time
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                    Against Uruguay, Ghana went into extra time and had a
                    chance to reach the semi-finals when a late header was
                    stopped on the goal line.
                </p>
                </div>

            </div>

            {/* THE MOMENT */}
            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c]">

                <div className="grid lg:grid-cols-2">

                <div className="relative min-h-[320px] lg:min-h-[480px]">
                    <Image
                    src="/Black-Stars-Graphics/2010-ghana-uruguay.png"
                    alt="Ghana versus Uruguay at the 2010 FIFA World Cup"
                    fill
                    className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute bottom-6 left-6">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                        Johannesburg
                    </p>

                    <p className="mt-2 text-3xl font-black">
                        Ghana vs Uruguay
                    </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

                    <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                    2 July 2010
                    </p>

                    <h3 className="mt-3 text-3xl font-black sm:text-4xl">
                    The penalty that changed everything
                    </h3>

                    <p className="mt-5 leading-7 text-gray-400">
                    Deep into extra time, Luis Suárez handled the ball on
                    the goal line to prevent Dominic Adiyiah's header from
                    going into the net. Suárez was sent off and Ghana were
                    awarded a penalty.
                    </p>

                    <p className="mt-4 leading-7 text-gray-400">
                    Asamoah Gyan stepped forward but struck the penalty
                    against the crossbar. Uruguay eventually won the
                    shootout, ending Ghana's historic run.
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-3xl font-black text-white">
                        QF
                        </p>

                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Best World Cup finish
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-3xl font-black text-white">
                        2010
                        </p>

                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Historic campaign
                        </p>
                    </div>

                    </div>

                </div>

                </div>

            </div>

            </div>
        </section>

                {/* =========================
            THE JOURNEY CONTINUES
        ========================== */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                The Journey Continues
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Glory, setbacks and another return
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
                The years after 2010 brought a mixture of unforgettable moments,
                disappointment and rebuilding. The Black Stars remained one of
                Africa's most recognisable football teams.
            </p>
            </div>

            <div className="relative">

            {/* TIMELINE LINE */}
            <div className="absolute left-4 top-0 hidden h-full w-px bg-red-500/30 md:block" />

            <div className="space-y-8">

                {/* 2014 */}
                <div className="relative md:pl-14">
                <div className="absolute left-0 top-2 hidden h-9 w-9 items-center justify-center rounded-full border border-red-500/50 bg-[#050505] md:flex">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c]">

                    <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

                    <div className="relative min-h-[260px]">
                        <Image
                        src="/Black-Stars-Graphics/world-cup-2014.png"
                        alt="Ghana Black Stars at the 2014 FIFA World Cup"
                        fill
                        className="object-cover"
                        />
                    </div>

                    <div className="p-7 sm:p-9">

                        <span className="text-sm font-black text-red-500">
                        2014
                        </span>

                        <h3 className="mt-2 text-2xl font-black">
                        Another World Cup, another chapter
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-gray-400">
                        Ghana qualified for a third consecutive World Cup,
                        entering Brazil 2014 with high expectations after
                        reaching the quarter-finals four years earlier.
                        </p>

                        <p className="mt-3 text-sm leading-7 text-gray-500">
                        The campaign ended in the group stage after matches
                        against the United States, Germany and Portugal.
                        </p>

                    </div>

                    </div>

                </div>
                </div>

                {/* 2018 */}
                <div className="relative md:pl-14">
                <div className="absolute left-0 top-2 hidden h-9 w-9 items-center justify-center rounded-full border border-red-500/50 bg-[#050505] md:flex">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 sm:p-9">

                    <span className="text-sm font-black text-red-500">
                    2018
                    </span>

                    <h3 className="mt-2 text-2xl font-black">
                    The painful absence
                    </h3>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
                    For the first time since their breakthrough in 2006,
                    Ghana failed to qualify for the FIFA World Cup. The
                    absence brought an end to the Black Stars' run of three
                    consecutive World Cup appearances.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-gray-400">
                        No World Cup
                    </span>

                    <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-gray-400">
                        Rebuilding
                    </span>
                    </div>

                </div>
                </div>

                {/* 2022 */}
                <div className="relative md:pl-14">
                <div className="absolute left-0 top-2 hidden h-9 w-9 items-center justify-center rounded-full border border-red-500/50 bg-[#050505] md:flex">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c]">

                    <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

                    <div className="relative min-h-[260px]">
                        <Image
                        src="/Black-Stars-Graphics/world-cup-2022.png"
                        alt="Ghana Black Stars at the 2022 FIFA World Cup"
                        fill
                        className="object-cover"
                        />
                    </div>

                    <div className="p-7 sm:p-9">

                        <span className="text-sm font-black text-red-500">
                        2022
                        </span>

                        <h3 className="mt-2 text-2xl font-black">
                        Back on football's biggest stage
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-gray-400">
                        Ghana returned to the World Cup in Qatar after
                        missing the previous tournament. The campaign
                        included a dramatic group containing Portugal,
                        South Korea and Uruguay.
                        </p>

                        <p className="mt-3 text-sm leading-7 text-gray-500">
                        A 3–2 victory over South Korea provided one of the
                        tournament's memorable matches, but Ghana ultimately
                        exited during the group stage.
                        </p>

                    </div>

                    </div>

                </div>
                </div>

            </div>
            </div>

        </section>

                {/* =========================
            2026 WORLD CUP
        ========================== */}
        <section className="border-y border-white/10 bg-[#080808]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] lg:grid-cols-2">

                {/* IMAGE */}
                <div className="relative min-h-[360px] lg:min-h-[560px]">
                <Image
                    src="/Black-Stars-Graphics/world-cup-2026.png"
                    alt="Ghana Black Stars at the 2026 FIFA World Cup"
                    fill
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-7 left-7">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
                    Canada • Mexico • United States
                    </p>

                    <p className="mt-2 text-5xl font-black text-white sm:text-6xl">
                    2026
                    </p>
                </div>
                </div>

                {/* STORY */}
                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                    The latest chapter
                </p>

                <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                    Back on the world's biggest stage
                </h2>

                <p className="mt-6 leading-7 text-gray-400">
                    Ghana returned to the FIFA World Cup in 2026, once again
                    carrying the hopes of a football-mad nation onto the
                    international stage.
                </p>

                <div className="mt-8 space-y-5">

                    <div className="border-l-2 border-red-500 pl-5">
                    <p className="text-sm font-black text-white">
                        Group stage
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                        The Black Stars progressed from a group containing
                        England, Croatia and Panama, advancing to the expanded
                        knockout stage.
                    </p>
                    </div>

                    <div className="border-l-2 border-red-500 pl-5">
                    <p className="text-sm font-black text-white">
                        Round of 32
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                        Ghana's campaign ended with a narrow 1–0 defeat to
                        Colombia in Kansas City.
                    </p>
                    </div>

                    <div className="border-l-2 border-red-500 pl-5">
                    <p className="text-sm font-black text-white">
                        A step forward
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                        Reaching the knockout stage represented an improvement
                        on Ghana's group-stage exit at the 2022 World Cup.
                    </p>
                    </div>

                </div>

                <div className="mt-10 grid grid-cols-2 gap-4">

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-3xl font-black text-white">
                        R32
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                        2026 finish
                    </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-3xl font-black text-white">
                        6th
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                        World Cup appearance
                    </p>
                    </div>

                </div>

                </div>

            </div>

            </div>
        </section>

        {/* =========================
            CURRENT CHAPTER
        ========================== */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                The Current Chapter
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                A new chapter begins
            </h2>

                            <p className="mt-4 leading-7 text-gray-400">
                Ghana's fifth World Cup campaign has added another chapter to the
                Black Stars story. The focus now turns towards rebuilding, developing
                the next generation and preparing for the challenges ahead.
                </p>
                            </div>

            <div className="grid gap-6 md:grid-cols-3">

            {/* COACHING */}
            <div className="rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 sm:p-8">

                <span className="text-4xl font-black text-red-500">
                01
                </span>

                <p className="mt-6 text-xs font-black uppercase tracking-widest text-gray-500">
                Leadership
                </p>

                <h3 className="mt-2 text-2xl font-black">
                A vacant coaching role
                </h3>

                <h3>Leadership</h3>
                <p>
                Following the 2026 World Cup, Ghana entered a new phase of transition as
                the search for the next Black Stars head coach began.
                </p>
            </div>

            {/* SEARCH */}
            <div className="rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 sm:p-8">

                <span className="text-4xl font-black text-red-500">
                02
                </span>

                <p className="mt-6 text-xs font-black uppercase tracking-widest text-gray-500">
                The next manager
                </p>

                <h3 className="mt-2 text-2xl font-black">
                Ghana begins the search
                </h3>

                                <h4>What Comes Next</h4>
                                <p>
                                The focus now turns to rebuilding, developing the next generation and
                                preparing the Black Stars for the challenges ahead.
                                </p>

            </div>

            {/* FUTURE */}
            <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-7 sm:p-8">

                <span className="text-4xl font-black text-red-500">
                03
                </span>

                <p className="mt-6 text-xs font-black uppercase tracking-widest text-red-500">
                What comes next
                </p>

                <h3 className="mt-2 text-2xl font-black">
                Rebuilding for the future
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                With a new coaching era ahead, the Black Stars face the
                challenge of rebuilding momentum and competing for future
                continental honours.
                </p>

            </div>

            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-[#0c0c0c] p-7 sm:p-10">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                    Black Stars
                </p>

                <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                    The next generation is already here.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                    From established internationals to emerging young talent,
                    Ghana's next chapter will be shaped by the players,
                    coaches and football culture that follow.
                </p>
                </div>

                <div className="shrink-0 rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-black text-red-400">
                Ghana • Always Black Stars
                </div>

            </div>

            </div>

        </section>

                {/* =========================
            BLACK STARS LEGENDS
        ========================== */}
        <section className="border-y border-white/10 bg-[#080808]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                    The Greats
                </p>

                <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                    Names that shaped a nation
                </h2>
                </div>

                <p className="max-w-xl text-sm leading-7 text-gray-500">
                Across generations, Ghana has produced players whose
                performances, personalities and achievements have become
                part of the Black Stars' identity.
                </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {/* ABEDI PELE */}
                <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] transition duration-300 hover:-translate-y-1 hover:border-red-500/40">

                <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                    src="/Black-Stars-Graphics/legend-abedi-pele.png"
                    alt="Abedi Pele"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">
                        The Maestro
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-white">
                        Abedi Pele
                    </h3>
                    </div>
                </div>

                <div className="p-5">
                    <p className="text-sm leading-6 text-gray-500">
                    One of Africa's greatest footballers and a defining
                    figure of Ghana's golden generation.
                    </p>
                </div>

                </article>

                {/* STEPHEN APPIAH */}
                <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] transition duration-300 hover:-translate-y-1 hover:border-red-500/40">

                <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                    src="/Black-Stars-Graphics/legend-stephen-appiah.png"
                    alt="Stephen Appiah"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">
                        The Captain
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-white">
                        Stephen Appiah
                    </h3>
                    </div>
                </div>

                <div className="p-5">
                    <p className="text-sm leading-6 text-gray-500">
                    A powerful midfielder and influential captain who
                    helped lead Ghana into its first World Cup.
                    </p>
                </div>

                </article>

                {/* MICHAEL ESSIEN */}
                <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] transition duration-300 hover:-translate-y-1 hover:border-red-500/40">

                <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                    src="/Black-Stars-Graphics/legend-michael-essien.png"
                    alt="Michael Essien"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">
                        The Bison
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-white">
                        Michael Essien
                    </h3>
                    </div>
                </div>

                <div className="p-5">
                    <p className="text-sm leading-6 text-gray-500">
                    A world-class midfielder whose strength, intelligence
                    and energy made him one of Ghana's most celebrated
                    football exports.
                    </p>
                </div>

                </article>

                {/* ASAMOAH GYAN */}
                <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] transition duration-300 hover:-translate-y-1 hover:border-red-500/40">

                <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                    src="/Black-Stars-Graphics/legend-asamoah-gyan.png"
                    alt="Asamoah Gyan"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">
                        The Goalscorer
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-white">
                        Asamoah Gyan
                    </h3>
                    </div>
                </div>

                <div className="p-5">
                    <p className="text-sm leading-6 text-gray-500">
                    Ghana's all-time leading scorer and a defining figure
                    of the Black Stars' modern era.
                    </p>
                </div>

                </article>

            </div>

            {/* LEGACY STATEMENT */}
            <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/5 p-7 text-center sm:p-10">

                <p className="mx-auto max-w-3xl text-lg font-bold leading-8 text-gray-300 sm:text-xl">
                From Abedi Pele's creativity to Asamoah Gyan's goals,
                generations of Black Stars have carried the same colours,
                the same badge and the same national ambition.
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