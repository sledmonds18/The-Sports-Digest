    "use client";

    import Image from "next/image";

    interface BlackQueensProps {
    onNavigate?: (page: string) => void;
    onToast?: (message: string) => void;
    }

    const stats = [
    { number: "3", label: "WAFCON final appearances" },
    { number: "7", label: "WAFCON podium finishes" },
    { number: "3", label: "Women's World Cup appearances" },
    { number: "2024", label: "Bronze medal" },
    ];

    export default function BlackQueens({
    onNavigate,
    onToast,
    }: BlackQueensProps) {
    return (
        <main className="bg-black text-white" >

        {/* Hero */}
        <section className="relative overflow-hidden">
            <Image
            src="/Black-Queens-Graphics/black-queens-hero.png"
            alt="Ghana Black Queens"
            width={1920}
            height={700}
            priority
            className="h-auto w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10 lg:px-16 lg:pb-14">
            <div className="mx-auto max-w-7xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                Ghana Women&apos;s National Team
                </p>

                <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
                Black Queens: The Fight for Glory
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
                A story of pioneers, unforgettable generations and a relentless
                pursuit of African women&apos;s football glory.
                </p>
            </div>
            </div>
        </section>

        {/* Quick Stats */}
        <section className="border-b border-white/10 bg-neutral-950">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
            {stats.map((stat) => (
                <div
                key={stat.label}
                className="px-5 py-8 text-center sm:px-6 lg:py-10"
                >
                <div className="text-3xl font-bold text-white sm:text-4xl">
                    {stat.number}
                </div>

                <div className="mt-2 text-xs uppercase tracking-wider text-gray-500 sm:text-sm">
                    {stat.label}
                </div>
                </div>
            ))}
            </div>
        </section>

        {/* Origins & Early Years */}
        <section className="bg-black px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                The Beginning
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Pioneers of Ghanaian Women&apos;s Football
            </h2>

            <p className="mt-6 leading-7 text-gray-400">
                The Black Queens emerged during a period when women&apos;s football
                was beginning to gain recognition in Ghana and across Africa. As the
                national women&apos;s team grew, Ghana became one of the early powers
                of the women&apos;s game on the continent.
            </p>

            <p className="mt-4 leading-7 text-gray-400">
                Their rise was built on talented players, competitive domestic
                football and a growing belief that Ghana could compete with the
                strongest women&apos;s teams in Africa. The Black Queens soon became
                synonymous with ambition, resilience and technical quality.
            </p>

            <p className="mt-4 leading-7 text-gray-400">
                That foundation would eventually lead Ghana to some of the biggest
                moments in the history of African women&apos;s football.
            </p>
            </div>

            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
            <Image
                src="/Black-Queens-Graphics/black-queens-history.png"
                alt="Historic Ghana Black Queens"
                width={1024}
                height={1536}
                className="h-full w-full object-cover"
            />
            </div>
        </div>
        </section>

            {/* 1998 Breakthrough */}
    <section className="bg-neutral-950 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            1998
        </p>

        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            The First Final
        </h2>

        <p className="mt-6 leading-7 text-gray-400">
            Ghana made history at the inaugural edition of the African Women&apos;s
            Championship in 1998, reaching the final and immediately establishing
            the Black Queens among the leading teams in African women&apos;s
            football.
        </p>

        <p className="mt-4 leading-7 text-gray-400">
            Their run ended against Nigeria, beginning a rivalry that would define
            some of the most important years of the Black Queens&apos; history.
            Although Ghana fell short of the trophy, reaching the final marked a
            major achievement for a team still building its identity on the
            continental stage.
        </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black p-6 sm:p-8">
            <div className="text-4xl font-bold text-white">1998</div>
            <div className="mt-2 text-sm uppercase tracking-wider text-gray-500">
            First WAFCON final
            </div>
            <p className="mt-4 leading-7 text-gray-400">
            Ghana reached the final of the first edition of the continental
            women&apos;s championship.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6 sm:p-8">
            <div className="text-4xl font-bold text-white">Nigeria</div>
            <div className="mt-2 text-sm uppercase tracking-wider text-gray-500">
            Final opponent
            </div>
            <p className="mt-4 leading-7 text-gray-400">
            The defeat introduced a rivalry that would continue through the
            Black Queens&apos; golden generation.
            </p>
        </div>
        </div>
    </div>
    </section>

        {/* Golden Generation */}
    <section className="bg-black px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            2000 — 2006
        </p>

        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            The Golden Generation
        </h2>

        <p className="mt-6 leading-7 text-gray-400">
            The early 2000s became one of the most successful periods in Black
            Queens history. Ghana consistently challenged for honours and
            established itself as one of the leading forces in African women&apos;s
            football.
        </p>

        <p className="mt-4 leading-7 text-gray-400">
            Ghana finished third in 2000, returned to the final in 2002, claimed
            another third-place finish in 2004 and reached the final again in
            2006. The consistency of that generation remains one of the defining
            achievements of the Black Queens.
        </p>
        </div>

        {/* Tournament Timeline */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6">
            <div className="text-3xl font-bold text-white">2000</div>

            <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-red-500">
            Third Place
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
            Ghana continued its strong run on the continent with another
            podium finish.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6">
            <div className="text-3xl font-bold text-white">2002</div>

            <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-red-500">
            Final
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
            The Black Queens returned to the continental final, once again
            facing Nigeria for the title.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6">
            <div className="text-3xl font-bold text-white">2004</div>

            <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-red-500">
            Third Place
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
            Ghana remained among Africa&apos;s elite, securing another podium
            finish.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6">
            <div className="text-3xl font-bold text-white">2006</div>

            <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-red-500">
            Final
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
            The Black Queens reached the final for the third time, completing
            an extraordinary run across the continent.
            </p>
        </div>
        </div>
    </div>
    </section>

    {/* Three Finals, One Missing Trophy */}
    <section className="bg-neutral-950 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        {/* Text */}
        <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            The Unfinished Story
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Three Finals, One Missing Trophy
            </h2>

            <p className="mt-6 leading-7 text-gray-400">
            The Black Queens have reached the continental final three times:
            1998, 2002 and 2006. Each time, Ghana came within one match of
            becoming African champions.
            </p>

            <p className="mt-4 leading-7 text-gray-400">
            All three finals ended against Nigeria, one of the dominant forces
            in African women&apos;s football. The repeated encounters helped
            define one of the continent&apos;s most familiar rivalries.
            </p>

            <p className="mt-4 leading-7 text-gray-400">
            For generations of Ghanaian players and supporters, the missing
            WAFCON trophy has remained one of the great unfinished stories in
            the history of the Black Queens.
            </p>
        </div>

        {/* Final appearances */}
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black px-6 py-5">
            <div>
                <div className="text-2xl font-bold text-white">1998</div>
                <div className="mt-1 text-sm text-gray-500">
                First continental final
                </div>
            </div>

            <div className="text-right">
                <div className="text-sm font-semibold uppercase tracking-wider text-red-500">
                Runner-up
                </div>
                <div className="mt-1 text-xs text-gray-500">
                vs Nigeria
                </div>
            </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black px-6 py-5">
            <div>
                <div className="text-2xl font-bold text-white">2002</div>
                <div className="mt-1 text-sm text-gray-500">
                Second continental final
                </div>
            </div>

            <div className="text-right">
                <div className="text-sm font-semibold uppercase tracking-wider text-red-500">
                Runner-up
                </div>
                <div className="mt-1 text-xs text-gray-500">
                vs Nigeria
                </div>
            </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black px-6 py-5">
            <div>
                <div className="text-2xl font-bold text-white">2006</div>
                <div className="mt-1 text-sm text-gray-500">
                Third continental final
                </div>
            </div>

            <div className="text-right">
                <div className="text-sm font-semibold uppercase tracking-wider text-red-500">
                Runner-up
                </div>
                <div className="mt-1 text-xs text-gray-500">
                vs Nigeria
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </section>

        {/* World Cup Journey */}
    <section className="bg-black px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="order-2 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 lg:order-1">
            <Image
            src="/Black-Queens-Graphics/black-queens-world-cup-old.png"
            alt="Ghana Black Queens at the FIFA Women's World Cup"
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            />
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            The World Stage
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Ghana on the World Stage
            </h2>

            <p className="mt-6 leading-7 text-gray-400">
            The Black Queens took their place on the global stage at the FIFA
            Women&apos;s World Cup, making three appearances in 1999, 2003 and
            2007.
            </p>

            <p className="mt-4 leading-7 text-gray-400">
            One of the defining moments came in 2003, when Ghana recorded its
            first-ever Women&apos;s World Cup victory. Alberta Sackey scored
            twice as the Black Queens defeated Australia 2–1.
            </p>

            <p className="mt-4 leading-7 text-gray-400">
            That victory became one of the landmark moments in Ghanaian women&apos;s
            football and cemented Sackey&apos;s place among the country&apos;s
            most celebrated footballers.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-neutral-950 p-4 text-center">
                <div className="text-2xl font-bold text-white">1999</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                Debut
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-950 p-4 text-center">
                <div className="text-2xl font-bold text-white">2003</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                First win
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-950 p-4 text-center">
                <div className="text-2xl font-bold text-white">2007</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                Third appearance
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </section>

        {/* Difficult Years */}
    <section className="bg-neutral-950 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            A Difficult Chapter
        </p>

        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            The Years of Rebuilding
        </h2>

        <p className="mt-6 leading-7 text-gray-400">
            After years of competing among Africa&apos;s elite, the Black Queens
            entered a difficult period. Ghana missed the 2012 and 2022 editions of
            the Women&apos;s Africa Cup of Nations, while several tournament
            appearances ended in the group stage.
        </p>

        <p className="mt-4 leading-7 text-gray-400">
            The team&apos;s struggles reflected a period of transition as Ghana
            searched for consistency, developed new players and worked to rebuild
            its position in African women&apos;s football.
        </p>

        <p className="mt-4 leading-7 text-gray-400">
            Yet the Black Queens never disappeared from the conversation. A new
            generation gradually emerged, bringing renewed energy and belief that
            Ghana could once again challenge the continent&apos;s strongest teams.
        </p>
        </div>

        {/* Timeline */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-3xl font-bold text-white">2008</div>
            <p className="mt-2 text-sm uppercase tracking-wider text-red-500">
            Group Stage
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-400">
            Ghana exited at the group stage as the team entered a more
            challenging period.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-3xl font-bold text-white">2010</div>
            <p className="mt-2 text-sm uppercase tracking-wider text-red-500">
            Group Stage
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-400">
            Another group-stage exit highlighted the growing challenge of
            remaining among Africa&apos;s elite.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-3xl font-bold text-white">2012</div>
            <p className="mt-2 text-sm uppercase tracking-wider text-red-500">
            Missed
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-400">
            Ghana failed to qualify for the tournament.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-3xl font-bold text-white">2022</div>
            <p className="mt-2 text-sm uppercase tracking-wider text-red-500">
            Missed
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-400">
            Another absence from the tournament underlined the need for a
            new beginning.
            </p>
        </div>
        </div>
    </div>
    </section>

        {/* 2024 Revival */}
    <section className="bg-black px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Text */}
        <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            2024
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            The Revival
            </h2>

            <p className="mt-6 leading-7 text-gray-400">
            Ghana&apos;s return to the continental podium marked an important
            turning point. After missing the previous edition, the Black Queens
            returned with renewed confidence and a determination to restore
            their place among Africa&apos;s best.
            </p>

            <p className="mt-4 leading-7 text-gray-400">
            Ghana defeated Algeria on penalties in the quarter-finals before
            facing Morocco in the semi-finals. After another penalty shootout,
            the Black Queens finished the tournament with a bronze medal after
            overcoming South Africa.
            </p>

            <p className="mt-4 leading-7 text-gray-400">
            The result did more than add another medal to Ghana&apos;s record.
            It showed that the Black Queens were capable of competing at the
            highest level again.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-full border border-white/10 bg-neutral-950 px-5 py-2 text-sm text-gray-300">
                Quarter-finalists
            </div>

            <div className="rounded-full border border-white/10 bg-neutral-950 px-5 py-2 text-sm text-gray-300">
                Semi-finalists
            </div>

            <div className="rounded-full border border-white/10 bg-neutral-950 px-5 py-2 text-sm text-gray-300">
                Bronze medal
            </div>
            </div>
        </div>

        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
            <Image
            src="/Black-Queens-Graphics/black-queens-2024.png"
            alt="Ghana Black Queens celebrating their 2024 WAFCON bronze medal"
            width={1200}
            height={900}
            className="h-full w-full object-cover"
            />
        </div>
        </div>
    </div>
    </section>

        {/* 2026 WAFCON Journey */}
    <section className="bg-neutral-950 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            2026 WAFCON
        </p>

        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            The Fight Continues
        </h2>

        <p className="mt-6 leading-7 text-gray-400">
            Ghana entered the 2026 Women&apos;s Africa Cup of Nations looking to
            build on the momentum of its bronze-medal finish. The Black Queens
            qualified by defeating Egypt 7–0 on aggregate and entered the
            tournament determined to go further.
        </p>

        <p className="mt-4 leading-7 text-gray-400">
            Ghana opened the tournament with a 2–0 victory over Cape Verde before
            losing 1–0 to Cameroon. A 1–1 draw with Mali in the final group match
            was enough to send the Black Queens through to the quarter-finals.
        </p>
        </div>

        {/* Tournament Journey */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-2xl font-bold text-white">7–0</div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-red-500">
            Qualification
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
            Ghana defeated Egypt 7–0 on aggregate to qualify for WAFCON 2026.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-2xl font-bold text-white">2–0</div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-red-500">
            Cape Verde
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
            A winning start gave Ghana three valuable points.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-2xl font-bold text-white">0–1</div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-red-500">
            Cameroon
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
            Ghana suffered a narrow defeat in the second group match.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-2xl font-bold text-white">1–1</div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-red-500">
            Mali
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
            The draw secured Ghana&apos;s place in the quarter-finals.
            </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-2xl font-bold text-white">2–1</div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-red-500">
            Côte d&apos;Ivoire
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
            Ghana won the WAFCON play-off to keep its 2027 World Cup hopes alive.
            </p>
        </div>
        </div>
    </div>
    </section>

        {/* Black Queens Legends */}
    <section className="bg-black px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            The Icons
        </p>

        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Black Queens Legends
        </h2>

        <p className="mt-6 leading-7 text-gray-400">
            Across generations, remarkable players have carried the Black Queens
            story forward. From pioneers of Ghana&apos;s early World Cup campaigns
            to the leaders of the modern team, these players have left a lasting
            mark on the national side.
        </p>
        </div>

        {/* Legends */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Alberta Sackey */}
        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
            <div className="aspect-[4/5] overflow-hidden">
            <Image
                src="/Black-Queens-Graphics/legend-alberta-sackey 1.png"
                alt="Alberta Sackey"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            </div>

            <div className="p-6">
            <h3 className="text-xl font-bold text-white">
                Alberta Sackey
            </h3>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-red-500">
                World Cup Pioneer
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-400">
                A landmark figure in Ghanaian women&apos;s football who scored
                both goals in Ghana&apos;s first Women&apos;s World Cup victory
                in 2003.
            </p>
            </div>
        </div>

        {/* Adjoa Bayor */}
        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
            <div className="aspect-[4/5] overflow-hidden">
            <Image
                src="/Black-Queens-Graphics/legend-adjoa-bayor-old.png"
                alt="Adjoa Bayor"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            </div>

            <div className="p-6">
            <h3 className="text-xl font-bold text-white">
                Adjoa Bayor
            </h3>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-red-500">
                Ghana Icon
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-400">
                One of the celebrated figures of Ghanaian women&apos;s football,
                representing the Black Queens with distinction across a
                remarkable career.
            </p>
            </div>
        </div>

        {/* Portia Boakye */}
        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
            <div className="aspect-[4/5] overflow-hidden">
            <Image
                src="/Black-Queens-Graphics/legend-portia-boakye.png"
                alt="Portia Boakye"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            </div>

            <div className="p-6">
            <h3 className="text-xl font-bold text-white">
                Portia Boakye
            </h3>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-red-500">
                Captain & Leader
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-400">
                A modern leader of the Black Queens who has represented Ghana
                across major international tournaments.
            </p>
            </div>
        </div>

        {/* Evelyn Badu */}
        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
            <div className="aspect-[4/5] overflow-hidden">
            <Image
                src="/Black-Queens-Graphics/legend-evelyn-badu.png"
                alt="Evelyn Badu"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            </div>

            <div className="p-6">
            <h3 className="text-xl font-bold text-white">
                Evelyn Badu
            </h3>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-red-500">
                New Generation
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-400">
                Part of the new generation carrying Ghana&apos;s hopes forward
                and helping shape the next chapter of the Black Queens.
            </p>
            </div>
        </div>
        </div>
    </div>
    </section>

        {/* Current Chapter */}
    <section className="relative overflow-hidden bg-neutral-950 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
    <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
        The Story Continues
        </p>

        <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
        The Wait for the Crown Continues
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
        The Black Queens have come close to continental glory, produced
        generations of outstanding players and returned to the WAFCON podium.
        But the biggest prize remains just beyond their reach.
        </p>

        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
        After reaching the 2027 FIFA Women&apos;s World Cup inter-confederation
        play-offs, Ghana&apos;s journey continues. A new generation now carries
        the responsibility of writing the next chapter.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-3xl font-bold text-white">2027</div>
            <div className="mt-2 text-xs uppercase tracking-wider text-gray-500">
            World Cup Play-offs
            </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-3xl font-bold text-white">3</div>
            <div className="mt-2 text-xs uppercase tracking-wider text-gray-500">
            WAFCON Finals
            </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-6">
            <div className="text-3xl font-bold text-white">1</div>
            <div className="mt-2 text-xs uppercase tracking-wider text-gray-500">
            Dream Still Alive
            </div>
        </div>
        </div>
    </div>
    </section>
    </main>
    );
    }
        