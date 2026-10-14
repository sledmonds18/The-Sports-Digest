    "use client";

    import Image from "next/image";

    interface DivisionOneLeagueProps {
    onNavigate?: (page: string) => void;
    onToast?: (message: string) => void;
    }

    const stats = [
    {
        number: "1956",
        label: "First Season",
    },
    {
        number: "48",
        label: "2026/27 Clubs",
    },
    {
        number: "3",
        label: "Competition Zones",
    },
    {
        number: "2nd",
        label: "Tier of Ghana Football",
    },
    ];

            const divisionOneClubs = {
    "Zone 1A": [
        {
        name: "Steadfast FC",
        location: "Tamale",
        image: "/Ghana-Division-One-Teams/steadfast-fc.png",
        info: "A Tamale-based club with a strong reputation for developing young football talent and competing at a high level.",
        },
        {
        name: "Wa Power Sporting Club",
        location: "Wa",
        image: "/Ghana-Division-One-Teams/wa-power.png",
        info: "A proud Upper West side looking to turn regional ambition into a serious promotion challenge.",
        },
        {
        name: "Sankara Nationals",
        location: "Yendi",
        image: "/Ghana-Division-One-Teams/sankara-nationals.png",
        info: "A northern club carrying local pride and aiming to make a strong impact in the Division One campaign.",
        },
        {
        name: "Real Tamale United",
        location: "Tamale",
        image: "/Ghana-Division-One-Teams/real-tamale-united.png",
        info: "A historic Tamale club with Premier League experience and ambitions of returning to the top flight.",
        },
        {
        name: "Tamale City FC",
        location: "Tamale",
        image: "/Ghana-Division-One-Teams/tamale-city.png",
        info: "A Tamale-based side determined to compete for promotion and establish itself among Ghana's leading clubs.",
        },
        {
        name: "Northern City FC",
        location: "Tamale",
        image: "/Ghana-Division-One-Teams/northern-city.png",
        info: "A competitive northern side looking to build momentum throughout the 2026/27 campaign.",
        },
        {
        name: "Kalibi SC",
        location: "Wa",
        image: "/Ghana-Division-One-Teams/kalibi-sc.png",
        info: "Newly promoted Kalibi SC enters the Division One League with the ambition of making an immediate impression.",
        },
        {
        name: "Berekum City FC",
        location: "Bolgatanga",
        image: "/Ghana-Division-One-Teams/berekum-city.png",
        info: "A club with strong ambitions and a challenging campaign ahead in Zone 1A.",
        },
    ],

    "Zone 1B": [
        {
        name: "Victory Club Warriors",
        location: "Wenchi",
        image: "/Ghana-Division-One-Teams/victory-club-warriors.png",
        info: "A competitive Brong Ahafo side looking to build a strong promotion campaign.",
        },
        {
        name: "Bectero Sasana FC",
        location: "Sunyani",
        image: "/Ghana-Division-One-Teams/bectero-sasana.png",
        info: "A newly promoted club ready to test itself against experienced Division One opposition.",
        },
        {
        name: "K.A.C Soccer Academy",
        location: "Sunyani",
        image: "/Ghana-Division-One-Teams/kac-soccer-academy.png",
        info: "A development-focused club combining youth talent with competitive Division One football.",
        },
        {
        name: "Yapei United",
        location: "Buipe",
        image: "/Ghana-Division-One-Teams/yapei-united.png",
        info: "A determined side representing Yapei and looking to make its mark in Zone 1B.",
        },
        {
        name: "Techiman Eleven Wonders",
        location: "Techiman",
        image: "/Ghana-Division-One-Teams/techiman-eleven-wonders.png",
        info: "A well-known Ghanaian club returning to Division One with ambitions of climbing back toward the top flight.",
        },
        {
        name: "Wamanafo Mighty Royals",
        location: "Wamfie",
        image: "/Ghana-Division-One-Teams/wamanafo-mighty-royals.png",
        info: "A determined regional club looking to compete strongly throughout the season.",
        },
        {
        name: "Dormaa Unity FC",
        location: "Dormaa",
        image: "/Ghana-Division-One-Teams/dormaa-unity.png",
        info: "A Dormaa-based side aiming to establish itself as a serious force in Zone 1B.",
        },
        {
        name: "Techiman Liberty Youth",
        location: "Techiman",
        image: "/Ghana-Division-One-Teams/techiman-liberty-youth.png",
        info: "A club focused on youth development while competing for valuable Division One points.",
        },
    ],

    "Zone 2": [
        {
        name: "Nsuopon Fidelity",
        location: "Ashanti Region",
        image: "/Ghana-Division-One-Teams/nsuopon-fidelity-old.png",
        info: "A competitive side looking to turn consistency into a promotion push.",
        },
        {
        name: "Future Stars",
        location: "Ashanti Region",
        image: "/Ghana-Division-One-Teams/future-stars.png",
        info: "A developing club with ambitions of producing talent and competing at the top end of the zone.",
        },
        {
        name: "Ebiemo FC",
        location: "Nzema",
        image: "/Ghana-Division-One-Teams/ebiemo-fc.png",
        info: "A newly promoted side beginning its Division One journey with plenty to prove.",
        },
        {
        name: "Nations FC",
        location: "Ashanti Region",
        image: "/Ghana-Division-One-Teams/nations-fc.png",
        info: "A club with recent top-flight experience looking to compete for another promotion opportunity.",
        },
        {
        name: "Ebony FC",
        location: "Ashanti Region",
        image: "/Ghana-Division-One-Teams/ebony-fc.png",
        info: "A determined Division One side competing for points and regional pride.",
        },
        {
        name: "New Edubiase United",
        location: "Ashanti Region",
        image: "/Ghana-Division-One-Teams/new-edubiase-united.png",
        info: "A former Premier League club with ambitions of rebuilding and returning to the top flight.",
        },
        {
        name: "Pro-Sports Academy",
        location: "Ashanti Region",
        image: "/Ghana-Division-One-Teams/pro-sports-academy.png",
        info: "A newly promoted side combining player development with the demands of competitive league football.",
        },
        {
        name: "PAC Academy",
        location: "Central Region",
        image: "/Ghana-Division-One-Teams/pac-academy.png",
        info: "A football academy focused on developing players while competing in Ghana's second tier.",
        },
        {
        name: "Fettehman United",
        location: "Central Region",
        image: "/Ghana-Division-One-Teams/fettehman-united.png",
        info: "A newly promoted club facing its first major test among established Division One sides.",
        },
        {
        name: "Elmina Sharks",
        location: "Elmina",
        image: "/Ghana-Division-One-Teams/elmina-sharks.png",
        info: "A former Premier League club with experience and ambitions of fighting its way back to the top flight.",
        },
        {
        name: "King Faisal",
        location: "Kumasi",
        image: "/Ghana-Division-One-Teams/king-faisal.png",
        info: "A historic Ghanaian club with extensive Premier League experience and a strong desire to return.",
        },
        {
        name: "Sekondi Rospak SC",
        location: "Sekondi",
        image: "/Ghana-Division-One-Teams/sekondi-rospak.png",
        info: "A Western Region side competing to establish itself among the zone's leading clubs.",
        },
        {
        name: "Soccer Intellectuals",
        location: "Central Region",
        image: "/Ghana-Division-One-Teams/soccer-intellectuals.png",
        info: "A competitive club with a history of challenging strongly in Ghana's second tier.",
        },
        {
        name: "Sefwi All Stars",
        location: "Sefwi",
        image: "/Ghana-Division-One-Teams/sefwi-all-stars.png",
        info: "A Western Region side carrying local ambition into another demanding Division One campaign.",
        },
        {
        name: "Skyy FC",
        location: "Daboase",
        image: "/Ghana-Division-One-Teams/skyy-fc.png",
        info: "A respected Western Region club aiming to compete for promotion after several strong campaigns.",
        },
        {
        name: "Mysterious Dwarfs",
        location: "Cape Coast",
        image: "/Ghana-Division-One-Teams/mysterious-dwarfs.png",
        info: "A historic Ghanaian club with Premier League pedigree and ambitions of returning to the elite.",
        },
    ],

    "Zone 3": [
        {
        name: "7th Wave FC",
        location: "Greater Accra",
        image: "/Ghana-Division-One-Teams/7th-wave-fc.png",
        info: "A newly promoted club beginning its Division One journey with a chance to make an immediate statement.",
        },
        {
        name: "Accra Lions FC",
        location: "Accra",
        image: "/Ghana-Division-One-Teams/accra-lions.png",
        info: "A modern Accra club with Premier League experience and ambitions of returning to the top flight.",
        },
        {
        name: "Golden Warriors",
        location: "Greater Accra",
        image: "/Ghana-Division-One-Teams/golden-warriors.png",
        info: "A competitive Greater Accra side looking to challenge for promotion.",
        },
        {
        name: "True Democracy",
        location: "Greater Accra",
        image: "/Ghana-Division-One-Teams/true-democracy.png",
        info: "A determined club looking to establish itself among Zone Three's strongest teams.",
        },
        {
        name: "FC Nania",
        location: "Accra",
        image: "/Ghana-Division-One-Teams/fc-nania.png",
        info: "A respected Ghanaian club with a strong history of developing players and competing at a high level.",
        },
        {
        name: "Nukunu FC",
        location: "Volta Region",
        image: "/Ghana-Division-One-Teams/nukunu-fc.png",
        info: "A newly promoted side beginning its Division One campaign against experienced opposition.",
        },
        {
        name: "Golden Kick SC",
        location: "Greater Accra",
        image: "/Ghana-Division-One-Teams/golden-kick.png",
        info: "A competitive side looking to build a strong campaign and challenge higher up the table.",
        },
        {
        name: "WAFA SC",
        location: "Volta Region",
        image: "/Ghana-Division-One-Teams/wafa-sc.png",
        info: "A renowned Ghanaian development club with a strong reputation for producing young football talent.",
        },
        {
        name: "Home Stars FC",
        location: "Ho",
        image: "/Ghana-Division-One-Teams/home-stars.png",
        info: "A Volta Region club determined to make its home advantage count throughout the campaign.",
        },
        {
        name: "Okwahu United",
        location: "Eastern Region",
        image: "/Ghana-Division-One-Teams/okwahu-united.png",
        info: "A historic Ghanaian club with Premier League experience and ambitions of climbing back up.",
        },
        {
        name: "Hakla SC",
        location: "Volta Region",
        image: "/Ghana-Division-One-Teams/hakla-sc.png",
        info: "A competitive club looking to make its mark in a demanding Zone Three campaign.",
        },
        {
        name: "Semper Fi FC",
        location: "Greater Accra",
        image: "/Ghana-Division-One-Teams/semper-fi.png",
        info: "Last season's Zone Three runners-up return with a strong ambition to finish the job this time.",
        },
        {
        name: "Inter Allies",
        location: "Accra",
        image: "/Ghana-Division-One-Teams/inter-allies.png",
        info: "A former Premier League club looking to rebuild and fight its way back to Ghana's top division.",
        },
        {
        name: "Kotoku Royals",
        location: "Eastern Region",
        image: "/Ghana-Division-One-Teams/kotoku-royals.png",
        info: "A former Premier League side aiming to make another serious push toward promotion.",
        },
        {
        name: "Accra Great Olympics",
        location: "Accra",
        image: "/Ghana-Division-One-Teams/great-olympics.png",
        info: "One of Ghana's historic clubs, Great Olympics are targeting a return to the Premier League.",
        },
        {
        name: "Attram De Visser",
        location: "Accra",
        image: "/Ghana-Division-One-Teams/attram-de-visser.png",
        info: "A respected football academy and development club competing against some of Ghana's established sides.",
        },
    ],
    };
    const leagueHistory = [
    {
        year: "1956",
        title: "The Beginning",
        description:
        "The Division One League emerged as an important level of Ghanaian domestic football, creating a structured pathway for clubs competing below the top flight.",
    },
    {
        year: "1960s – 1980s",
        title: "Building the Pyramid",
        description:
        "The competition became an important platform for clubs and players looking to establish themselves within Ghana's growing football system.",
    },
    {
        year: "1990s – 2000s",
        title: "A Pathway to the Top",
        description:
        "Promotion battles became a defining feature of the league as ambitious clubs fought for the opportunity to join Ghana's elite.",
    },
    {
        year: "Modern Era",
        title: "The Next Generation",
        description:
        "The league continues to develop young talent while giving ambitious clubs the opportunity to compete for Premier League promotion.",
    },
    ];

    const zones = [
    {
        number: "01",
        title: "Zone One",
        description:
        "Clubs in the northern part of the country compete in a demanding regional battle for the opportunity to move closer to Premier League football.",
    },
    {
        number: "02",
        title: "Zone Two",
        description:
        "A highly competitive zone where established sides and emerging clubs fight throughout the season for promotion and regional supremacy.",
    },
    {
        number: "03",
        title: "Zone Three",
        description:
        "Clubs compete across the southern part of the country, producing another intense route toward Ghana's top flight.",
    },
    ];

    const promotionJourney = [
    {
        title: "The Challenge",
        text: "Clubs begin the season knowing that consistency across the campaign is essential to staying in the promotion conversation.",
    },
    {
        title: "The Race",
        text: "Every point becomes increasingly important as clubs battle for the leading positions within their respective zones.",
    },
    {
        title: "The Opportunity",
        text: "Success at Division One level can open the door to Ghana Premier League football and a new chapter for a club.",
    },
    {
        title: "The Next Level",
        text: "Promotion represents more than a change of division — it is an opportunity to compete among Ghana's best clubs.",
    },
    ];

    const modernMoments = [
    {
        year: "Development",
        title: "A Platform for Young Talent",
        description:
        "The league continues to provide young Ghanaian footballers with valuable competitive experience and a pathway toward higher levels of the game.",
    },
    {
        year: "Competition",
        title: "Ambitious Clubs",
        description:
        "Clubs across the country continue to invest in their squads and infrastructure as they pursue the dream of Premier League promotion.",
    },
    {
        year: "Community",
        title: "Regional Football",
        description:
        "Division One brings competitive football to communities across Ghana and remains an important part of the country's domestic football pyramid.",
    },
    {
        year: "The Future",
        title: "The Next Generation",
        description:
        "Every season introduces new players, new clubs and new stories that can shape the future of Ghanaian football.",
    },
    ];

    const season2026_27 = [
    {
        stage: "Season Begins",
        date: "September 2026",
    },
    {
        stage: "Regular Season",
        date: "2026 – 2027",
    },
    {
        stage: "Promotion Race",
        date: "Throughout the Season",
    },
    {
        stage: "Final League Push",
        date: "May 2027",
    },
    {
        stage: "Season Ends",
        date: "May 24, 2027",
    },
    ];

    export default function DivisionOneLeague({
    onNavigate,
    }: DivisionOneLeagueProps) {
    return (
        <main className="bg-black text-white">
    {/* HERO */}
    <section className="relative min-h-[75vh] overflow-hidden bg-black md:min-h-[75vh]">

        {/* Hero Image */}
        <Image
        src="/Ghana-Division-One-Graphics/division-one-hero-old.png"
        alt="Ghana Division One League"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center md:object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-[80vh] items-end">
        <div className="mx-auto w-full max-w-7xl px-6  md:px-10 lg:px-12">
            <div className="max-w-4xl">
            <h1 className="text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Ghana Division One League
            </h1>

                <p className="mt-4 max-w-2xl text-lg font-medium text-gray-200 md:text-xl">
                    The Road to the Top
                </p>

                <p className="mt-5 max-w-2xl leading-7 text-gray-300">
                    Ghana&apos;s second tier — where ambitious clubs, emerging
                    players and future Premier League stars compete for their
                    chance to reach the top flight.
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

        
        {/* HISTORY */}
            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
            <Image
                src="/Ghana-Division-One-Graphics/division-one-history.png"
                alt="Ghana Division One League History"
                width={1200}
                height={900}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="block h-auto w-full object-contain"
            />
            </div>
        </div>

            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                The Beginning
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                A Pathway That Keeps Producing Stories
                </h2>

                <div className="mt-8 space-y-4">
                {leagueHistory.map((moment) => (
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
            
        </section>



        {/* THE ZONES */}
        <section className="bg-zinc-950 px-6 py-20 md:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                The Structure
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                A League Built Around Zones
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-gray-400">
                Division One football is organized geographically, bringing clubs
                together in regional competitions while creating multiple routes
                toward promotion.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
                {zones.map((zone) => (
                <article
                    key={zone.title}
                    className="rounded-2xl border border-white/10 bg-black p-6 transition hover:-translate-y-1 hover:border-yellow-400/40"
                >
                    <p className="text-sm font-bold text-red-500">
                    {zone.number}
                    </p>

                    <h3 className="mt-3 text-xl font-black uppercase">
                    {zone.title}
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-gray-400">
                    {zone.description}
                    </p>
                </article>
                ))}
            </div>
            </div>
        </section>

            {/* THE CLUBS */}
    <section className="border-t border-white/10 bg-zinc-950 px-6 py-20">
    <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
            2026/27 Clubs
        </p>

        <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
            Meet the Clubs
        </h2>

        <p className="mt-5 text-base leading-7 text-gray-400 md:text-lg">
            Forty-eight clubs. Four zones. One dream of reaching Ghana's top
            flight. Get to know the teams competing in the 2026/27 Division One
            League.
        </p>
        </div>

        <div className="space-y-20">
        {Object.entries(divisionOneClubs).map(([zone, clubs]) => (
            <div key={zone}>
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                    2026/27
                </p>

                <h3 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
                    {zone}
                </h3>
                </div>

                <span className="hidden text-sm uppercase tracking-widest text-gray-500 sm:block">
                {clubs.length} Clubs
                </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {clubs.map((club) => (
                <article
                    key={club.name}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-black transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
                >
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                    <Image
                        src={club.image}
                        alt={`${club.name} Division One League`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    </div>

                    <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                        {club.location}
                    </p>

                    <h4 className="mt-2 text-xl font-bold text-white">
                        {club.name}
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                        {club.info}
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

        
        {/* THE journey */}
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-black" />

            <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
            <div className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                The Long Journey
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-5xl">
                The Foundation Below the Top Flight
                </h2>

                <p className="mt-6 leading-8 text-gray-400">
                The Division One League has played an important role in the
                development of Ghana&apos;s domestic football pyramid, providing
                clubs with a competitive environment below the Premier League.
                </p>

                <p className="mt-5 leading-8 text-gray-400">
                For generations of players, coaches and clubs, Division One has
                represented an opportunity to develop, compete and work toward
                the highest level of Ghanaian domestic football.
                </p>

                <p className="mt-5 leading-8 text-gray-400">
                Its importance goes beyond promotion. The league continues to
                serve as a platform for discovering talent and strengthening
                football across different regions of the country.
                </p>
            </div>

            
            </div>
        </section>

        {/* ROAD TO PREMIER LEAGUE */}
        <section className="bg-zinc-950 px-6 py-20 md:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                The Road to the Top
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                Every Match Matters
            </h2>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
                {promotionJourney.map((stage, index) => (
                <div
                    key={stage.title}
                    className="rounded-2xl border border-white/10 bg-black p-6"
                >
                    <span className="text-xs font-black text-red-500">
                    {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="mt-3 text-xl font-black uppercase">
                    {stage.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-gray-400">
                    {stage.text}
                    </p>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* MODERN ERA */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                Modern Era
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                Where Future Stars Begin
                </h2>

                <p className="mt-6 leading-8 text-gray-400">
                Modern Division One football continues to combine competitive
                club football with player development. For young footballers,
                the league can provide the experience needed to take the next
                step in their careers.
                </p>

                <p className="mt-5 leading-8 text-gray-400">
                For clubs, it is a chance to build, compete and establish a
                pathway toward Ghana&apos;s Premier League.
                </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <Image
                    src="/Ghana-Division-One-Graphics/division-one-modern-era.png"
                    alt="Ghana Division One League - Modern Era"
                    fill
                    priority
                    className="object-cover"
                />
            </div>
            </div>
        </section>

        {/* DIVISION ONE TODAY */}
        <section className="bg-zinc-950 px-6 py-20 md:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                Division One Today
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                More Than Just Promotion
            </h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {modernMoments.map((moment) => (
                <article
                    key={moment.title}
                    className="rounded-2xl border border-white/10 bg-black p-6 transition hover:-translate-y-1 hover:border-yellow-400/40"
                >
                    <p className="text-sm font-bold text-red-500">
                    {moment.year}
                    </p>

                    <h3 className="mt-3 text-xl font-black uppercase">
                    {moment.title}
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-gray-400">
                    {moment.description}
                    </p>
                </article>
                ))}
            </div>
            </div>
        </section>

        {/* 2026/27 */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
            

                <div className="p-8 md:p-12">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                    2026/27 Season
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                    A New Promotion Race Begins
                </h2>

                <p className="mt-6 leading-8 text-gray-300">
                    The 2026/27 Division One League brings another group of
                    ambitious clubs together in pursuit of one of the biggest
                    prizes in Ghanaian domestic football — promotion to the
                    Premier League.
                </p>

                <p className="mt-5 leading-8 text-gray-400">
                    Across the zones, clubs will compete throughout the season,
                    with every result capable of changing the promotion picture.
                </p>
                </div>
            
        </section>

        {/* SEASON ROADMAP */}
        <section className="bg-zinc-950 px-6 py-20 md:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                2026/27 Season
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                The Road to Promotion
                </h2>

                <p className="mt-5 leading-8 text-gray-400">
                Another Division One season is underway, with clubs across the
                country chasing points, momentum and the opportunity to reach
                the Ghana Premier League.
                </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {season2026_27.map((stage, index) => (
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

        {/* PROMOTION DREAM */}
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-black" />

            <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
            <div className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-red-500">
                The Ultimate Prize
                </p>

                <h2 className="mt-3 text-4xl font-black uppercase leading-tight md:text-6xl">
                The Dream Is Premier League Football
                </h2>

                <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-gray-400">
                For every club competing in Division One, the journey is about
                more than surviving the season. It is about earning the right
                to compete at the highest level of Ghanaian domestic football.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-950 p-6">
                    <p className="text-sm uppercase tracking-wider text-red-500">
                    The Target
                    </p>

                    <p className="mt-2 text-2xl font-black">
                    Premier League
                    </p>
                </div>

                <div className="rounded-2xl bg-zinc-950 p-6">
                    <p className="text-sm uppercase tracking-wider text-red-500">
                    The Journey
                    </p>

                    <p className="mt-2 text-2xl font-black">
                    One Season at a Time
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
            The Next Premier League Story Starts Here
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
            Across Ghana, clubs are chasing the same dream — to rise through
            Division One and earn their place among the country&apos;s elite.
            </p>

            {/* BACK HOME */}
            <section className="mt-20 border-t border-white/10 bg-[#080808] text-left">
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