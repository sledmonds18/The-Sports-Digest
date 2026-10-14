export type SportCategory =
  | "All Sports"
  | "Football"
  | "Boxing"
  | "Athletics"
  | "Basketball"
  | "Armwrestling"
  | "Hockey"
  | "Volleyball"
  | "Combat & Others";

export type EditorialStatus = "draft" | "pending" | "approved" | "rejected";

export type DiscoverySourceType =
  | "automated_wire"
  | "federation_dispatch"
  | "field_correspondent"
  | "press_release";

export interface GhanaSportArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: Exclude<SportCategory, "All Sports">;
  image?: string;
  slug: string;
  author: string;
  publishedAt: string;
  status: EditorialStatus;
  featured?: boolean;
  readTime: string;

  discoverySource: {
    type: DiscoverySourceType;
    sourceName: string;
    sourceUrl?: string;
    discoveredAt: string;
    rawSnippet?: string;
  };

  editorialVerification?: {
    verifiedBy: string;
    verifiedAt: string;
    factChecked: boolean;
    sourceVerified: boolean;
    editorialNotes: string;
  };
}

export const GHANA_SPORTS_CATEGORIES: SportCategory[] = [
  "All Sports",
  "Football",
  "Boxing",
  "Athletics",
  "Basketball",
  "Armwrestling",
  "Hockey",
  "Volleyball",
  "Combat & Others",
];

// Curated authentic seed articles covering all Ghanaian sports without repetition
export const INITIAL_GHANA_ARTICLES: GhanaSportArticle[] = [
  // --- 1. FOOTBALL ---
  {
    id: "gha-fb-001",
    title: "GPL Title Race Intensifies: Tactical Evolution Across Top Four Contenders",
    slug: "gpl-title-race-tactical-evolution",
    category: "Football",
    featured: true,
    status: "approved",
    author: "Kwame Darko · Chief Football Analyst",
    publishedAt: "Oct 14, 2026",
    readTime: "5 min",
    image: "/gpl-race-heating-up.png.png",
    excerpt:
      "A deep tactical breakdown of how high pressing and transition speed have reshaped the Ghana Premier League this season as Samartex, Kotoko, Hearts, and Nations FC vie for the crown.",
    content: [
      "The Ghana Premier League is experiencing a notable tactical modernization. Across the top four clubs, traditional low-block counter-attacking schemes have increasingly yielded to synchronized midfield pressing and coordinated half-space overloads.",
      "Defending champions FC Samartex continue to lead by example with their disciplined 4-3-3 formation, maximizing width and quick ball circulation. Meanwhile, Asante Kotoko's renewed emphasis on positional play under their tactical revamp has made them significantly more resilient in away fixtures.",
      "With key fixtures looming ahead of the international break, tactical discipline and squad rotation will dictate who sustains the championship pace heading into the second round.",
    ],
    discoverySource: {
      type: "field_correspondent",
      sourceName: "Sports Digest Accra Bureau",
      sourceUrl: "https://thesportsdigest.com/coverage/gpl",
      discoveredAt: "2026-10-14T08:30:00Z",
    },
    editorialVerification: {
      verifiedBy: "Shem Bravon Lamptey (Editor-in-Chief)",
      verifiedAt: "2026-10-14T10:00:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes:
        "Verified match tape review, GPS physical metrics, and post-match press conferences in Kumasi and Tarkwa.",
    },
  },
  {
    id: "gha-fb-002",
    title: "Women's Premier League: Ampem Darkoa and Hasaacas Ladies Set for Showdown",
    slug: "womens-premier-league-ampem-darkoa-hasaacas-ladies",
    category: "Football",
    featured: false,
    status: "approved",
    author: "Selorm Agyemang · Domestic Football",
    publishedAt: "Oct 13, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    excerpt:
      "Ghana's preeminent women's football rivalry takes center stage as Northern and Southern zone champions clash with continental qualification on the line.",
    content: [
      "The Ghana Women's Premier League continues to demonstrate significant technical elevation. Ampem Darkoa Ladies and Hasaacas Ladies have both dominated their regional zones, setting up an eagerly anticipated championship playoff.",
      "Both squads feature key national team players who starred in recent African Olympic qualifiers, providing an elite tactical benchmark for domestic women's football.",
      "Match commissioners have confirmed that the fixture will feature full broadcast coverage and certified match analytics tracking.",
    ],
    discoverySource: {
      type: "federation_dispatch",
      sourceName: "Ghana FA Women's Desk",
      sourceUrl: "https://ghanafa.org/wpl-championship-2026",
      discoveredAt: "2026-10-13T14:00:00Z",
    },
    editorialVerification: {
      verifiedBy: "Sports Desk Verification Team",
      verifiedAt: "2026-10-13T17:00:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes: "Confirmed with GFA Women's Competitions Committee.",
    },
  },

  // --- 2. BOXING ---
  {
    id: "gha-bx-002",
    title: "Bukom Fight Night: Rising Featherweight Sensation Secures WBO Africa Title Shot",
    slug: "bukom-fight-night-featherweight-wbo-africa",
    category: "Boxing",
    featured: false,
    status: "approved",
    author: "Nii Ayitey Hammond · Combat Sports Correspondent",
    publishedAt: "Oct 13, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
    excerpt:
      "A pulsating 10-round slugfest at the Bukom Boxing Arena has produced Ghana's next world title challenger, cementing Accra's enduring legacy as the cradle of African boxing champions.",
    content: [
      "The Bukom Boxing Arena erupted in thunderous applause on Saturday as 22-year-old Emmanuel Tagoe Jr. dismantled his seasoned continental rival with a masterclass in counter-punching and ring generalship.",
      "Ghana Boxing Authority (GBA) officials confirmed post-bout that sanctioning documents for an official WBO Africa Featherweight eliminator bout have been completed, with an international staging targeted for December.",
      "Accra's coastal boxing enclave continues to supply world-class pugilists, keeping alive the lineage pioneered by legends like Azumah Nelson, Ike Quartey, and Joshua Clottey.",
    ],
    discoverySource: {
      type: "federation_dispatch",
      sourceName: "Ghana Boxing Authority (GBA) Media Desk",
      sourceUrl: "https://ghanaboxing.org/news/title-eliminator",
      discoveredAt: "2026-10-13T22:15:00Z",
    },
    editorialVerification: {
      verifiedBy: "Sports Desk Verification Team",
      verifiedAt: "2026-10-14T07:15:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes:
        "Scorecards cross-checked with certified GBA ringside judges. Sanctioning fee deposit confirmed.",
    },
  },
  {
    id: "gha-bx-003",
    title: "Golden Gloves Academy: Azumah Nelson Foundation Expands Youth Gyms Across Volta",
    slug: "golden-gloves-academy-azumah-nelson-volta-gyms",
    category: "Boxing",
    featured: false,
    status: "approved",
    author: "Nii Ayitey Hammond · Combat Sports Desk",
    publishedAt: "Oct 11, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    excerpt:
      "A major grassroots initiative aims to extend Ghana's elite pugilistic training beyond Greater Accra into the Volta and Eastern regions with modern ring facilities.",
    content: [
      "The Azumah Nelson Foundation has officially commissioned two state-of-the-art youth boxing gyms in Ho and Kpando.",
      "The facilities include international-standard regulation rings, speed bags, and conditioning equipment designed to discover and hone teenage amateur talents.",
      "Ghana Olympic Committee representatives commended the private-public collaboration for preparing fighters for international tournament qualifications.",
    ],
    discoverySource: {
      type: "press_release",
      sourceName: "Azumah Nelson Foundation Communications",
      discoveredAt: "2026-10-11T09:30:00Z",
    },
    editorialVerification: {
      verifiedBy: "Shem Bravon Lamptey (Editor-in-Chief)",
      verifiedAt: "2026-10-11T12:00:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes: "Gym launch verified on site with Ho Municipal Sports Council.",
    },
  },

  // --- 3. ATHLETICS ---
  {
    id: "gha-at-003",
    title: "National Sprint Camp Opens in Kumasi Ahead of World Athletics Relays",
    slug: "ghana-athletics-national-sprint-camp-kumasi",
    category: "Athletics",
    featured: false,
    status: "approved",
    author: "Kwame Darko · Athletics Desk",
    publishedAt: "Oct 12, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80",
    excerpt:
      "Ghana's men's and women's 4x100m relay pools have assembled at the Paa Joe Stadium in Kumasi, focusing on baton exchanges and top-end speed mechanics.",
    content: [
      "The Ghana Athletics Association (GAA) has officially opened its high-performance residential camp in Kumasi. Sixteen elite sprinters from both domestic clubs and collegiate ranks abroad have reported for technical baton drills.",
      "Following Ghana's podium finishes at the African Games, technical coaches are emphasizing precision during baton handovers inside the 30-meter changeover box to shave critical tenths of a second off their season-best times.",
      "With direct qualification for the upcoming World Athletics Championships on the line, the coaching staff expressed strong optimism regarding the squad's physical conditioning.",
    ],
    discoverySource: {
      type: "federation_dispatch",
      sourceName: "Ghana Athletics Association (GAA) Communications",
      sourceUrl: "https://ghanaathletics.org/press/relays-2026",
      discoveredAt: "2026-10-12T11:00:00Z",
    },
    editorialVerification: {
      verifiedBy: "Shem Bravon Lamptey (Editor-in-Chief)",
      verifiedAt: "2026-10-12T14:30:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes:
        "Roster verified directly with GAA Technical Director at Paa Joe Stadium.",
    },
  },
  {
    id: "gha-at-004",
    title: "National Circuit Championship: Northern Athletes Shine in Tamale Field Events",
    slug: "national-circuit-championship-tamale-field-events",
    category: "Athletics",
    featured: false,
    status: "approved",
    author: "Abena Mensah · Athletics Desk",
    publishedAt: "Oct 09, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    excerpt:
      "Records fell at the Aliu Mahama Sports Stadium as collegiate athletes set new personal bests in long jump, javelin, and middle-distance steeplechase.",
    content: [
      "Day two of the GAA National Circuit in Tamale delivered outstanding results across track and field categories.",
      "University of Development Studies (UDS) athletes dominated the men's long jump and women's 800m, earning provisional qualification marks for national trials.",
      "Coaches highlighted the surging quality of collegiate athletics training facilities across northern Ghana as a vital pipeline for future national teams.",
    ],
    discoverySource: {
      type: "field_correspondent",
      sourceName: "Tamale Stadium Sports Desk",
      discoveredAt: "2026-10-09T18:00:00Z",
    },
    editorialVerification: {
      verifiedBy: "Sports Desk Verification Team",
      verifiedAt: "2026-10-10T08:00:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes: "Electronic timing receipts and official score sheets corroborated.",
    },
  },

  // --- 4. ARMWRESTLING ---
  {
    id: "gha-aw-004",
    title: "Golden Arms: Ghana Sets Sights on World Armwrestling Championship Podium",
    slug: "golden-arms-ghana-world-armwrestling-championship",
    category: "Armwrestling",
    featured: false,
    status: "approved",
    author: "Abena Mensah · Olympic & Combat Sports",
    publishedAt: "Oct 11, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    excerpt:
      "After sweeping 41 medals at the continental showpiece, Ghana's national armwrestling team, the Golden Arms, kicks off final preparations for international competition.",
    content: [
      "Armwrestling remains one of Ghana's fastest-growing and most successful sporting disciplines. President of the Ghana Armwrestling Federation (GAF), Charles Osei Asibey, announced that 12 national pullers will represent the nation at the upcoming global tournament.",
      "Heavyweight stars Grace Mintah and Edward Asamoah lead the contingent after commanding gold-medal sweeps in both left and right-arm categories during the African Games.",
      "With grassroots talent discovery programs expanding across Ashanti, Greater Accra, and Western regions, Ghana is positioning itself as the undisputed powerhouse of African pullers.",
    ],
    discoverySource: {
      type: "press_release",
      sourceName: "Ghana Armwrestling Federation (GAF)",
      sourceUrl: "https://armwrestlingghana.com/releases/world-champs-prep",
      discoveredAt: "2026-10-11T13:20:00Z",
    },
    editorialVerification: {
      verifiedBy: "Sports Desk Verification Team",
      verifiedAt: "2026-10-11T16:00:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes:
        "Official federation squad list confirmed against Ministry of Youth & Sports clearance.",
    },
  },
  {
    id: "gha-aw-005",
    title: "Greater Accra Pulling Championship: University Teams Dominate Lightweight Categories",
    slug: "greater-accra-pulling-championship-universities",
    category: "Armwrestling",
    featured: false,
    status: "approved",
    author: "Kofi Boateng · Armwrestling Desk",
    publishedAt: "Oct 08, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
    excerpt:
      "Legon and UPSA pullers demonstrated exceptional hand control and top-roll technique during the regional armwrestling cup in Accra.",
    content: [
      "Over sixty student pullers took to the table during the Greater Accra Armwrestling Championship held at the University of Ghana Sports Complex.",
      "Technical coaches praised the rapid adoption of international tournament grip techniques, hook transitions, and strap management among emerging youth athletes.",
      "The top three finishers in each weight division will earn direct entry into the 2027 National Golden Arms selection trials.",
    ],
    discoverySource: {
      type: "field_correspondent",
      sourceName: "GAF Regional Liaison Desk",
      discoveredAt: "2026-10-08T19:30:00Z",
    },
    editorialVerification: {
      verifiedBy: "Shem Bravon Lamptey (Editor-in-Chief)",
      verifiedAt: "2026-10-09T08:30:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes: "Match referee bracket cards verified in Accra.",
    },
  },

  // --- 5. BASKETBALL ---
  {
    id: "gha-bk-005",
    title: "Accra Basketball League: Braves Edge Reformers in Thrilling Overtime Derby",
    slug: "abl-braves-edge-reformers-overtime-thriller",
    category: "Basketball",
    featured: false,
    status: "approved",
    author: "Kofi Boateng · Basketball Desk",
    publishedAt: "Oct 10, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    excerpt:
      "A buzzer-beating floater in extra time sealed an 84-82 victory for Braves of Customs against Prisons Reformers at the Cantonments Basketball Court.",
    content: [
      "The Accra Basketball League (ABL) Men's Division 1 provided pure drama on Friday night as defending champions Braves of Customs overcame a 14-point fourth-quarter deficit to defeat fierce rivals Prisons Reformers.",
      "Guard Nana Kwame paced the Braves with 26 points and 8 assists, sinking the decisive floating jumper off the glass with just 1.8 seconds remaining in overtime.",
      "The result tightens the standings at the summit of the ABL table, with the playoff picture coming into sharp focus heading into the final month of the regular season.",
    ],
    discoverySource: {
      type: "field_correspondent",
      sourceName: "ABL Cantonments Court Correspondent",
      discoveredAt: "2026-10-10T21:40:00Z",
    },
    editorialVerification: {
      verifiedBy: "Sports Desk Verification Team",
      verifiedAt: "2026-10-11T09:00:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes:
        "Official score sheet inspected and signed by ABL Chief Scorer and Match Commissioner.",
    },
  },
  {
    id: "gha-bk-006",
    title: "Sprite Ball Championship: High School Powerhouses Prepare for Regional Qualifiers",
    slug: "sprite-ball-championship-high-school-qualifiers",
    category: "Basketball",
    featured: false,
    status: "approved",
    author: "Selorm Agyemang · High School Sports",
    publishedAt: "Oct 07, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    excerpt:
      "Western and Eastern region giants Mfantsipim, Prempeh College, and Keta Business College announce their rosters for the prestigious Sprite Ball Championship.",
    content: [
      "Ghana's most renowned high school basketball tournament, Sprite Ball, has announced its qualification schedule spanning six regional centers.",
      "Defending boys' division champions Mfantsipim School will face stiff competition from Kumasi's Prempeh College, while Sacred Heart Senior High looks to repeat in the girls' division.",
      "The tournament continues to serve as the single most critical scout recruiting platform for collegiate scholarships and national junior team call-ups.",
    ],
    discoverySource: {
      type: "press_release",
      sourceName: "Rite Sports Organizing Secretariat",
      discoveredAt: "2026-10-07T12:00:00Z",
    },
    editorialVerification: {
      verifiedBy: "Sports Desk Verification Team",
      verifiedAt: "2026-10-07T15:30:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes: "Verified with Ghana Education Service (GES) sports coordinator.",
    },
  },

  // --- 6. HOCKEY ---
  {
    id: "gha-hk-006",
    title: "Sapholda Hockey League: Ex-Chequers and GRA Ladies Set for Title Clash",
    slug: "sapholda-hockey-exchequers-gra-ladies-title-clash",
    category: "Hockey",
    featured: false,
    status: "approved",
    author: "The Sports Digest Sports Desk",
    publishedAt: "Oct 09, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80",
    excerpt:
      "All eyes turn to the Theodosia Okoh National Hockey Stadium in Accra this weekend as the premier hockey clubs in Ghana face off for the league title.",
    content: [
      "The Greater Accra Hockey Association has confirmed the schedule for this weekend's pivotal Sapholda Hockey League fixtures at the National Hockey Stadium.",
      "In the men's division, table-toppers Ex-Chequers take on Trustees in a match that will determine the destination of the trophy. In the women's division, GRA Ladies look to preserve their unblemished record against Reformers Ladies.",
      "Both clubs are also using the competition to finalize roster combinations ahead of the African Hockey Club Championship.",
    ],
    discoverySource: {
      type: "federation_dispatch",
      sourceName: "Greater Accra Hockey Association",
      sourceUrl: "https://ghanahockey.org/fixtures/oct-2026",
      discoveredAt: "2026-10-09T14:15:00Z",
    },
    editorialVerification: {
      verifiedBy: "Shem Bravon Lamptey (Editor-in-Chief)",
      verifiedAt: "2026-10-09T17:00:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes:
        "Confirmed through GAHA Secretariat fixture bulletin and umpire coordinator.",
    },
  },

  // --- 7. VOLLEYBALL ---
  {
    id: "gha-vb-007",
    title: "National Beach Volleyball Camp Established in Ada Ahead of Continental Tour",
    slug: "national-beach-volleyball-camp-ada-continental-tour",
    category: "Volleyball",
    featured: false,
    status: "approved",
    author: "Selorm Agyemang · Volleyball Desk",
    publishedAt: "Oct 08, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
    excerpt:
      "Ghana Volleyball Association (GVA) convenes a high-intensity sand training camp on the Ada coastline to prepare men's and women's pairs for CAVB qualifiers.",
    content: [
      "The Ghana Volleyball Association has launched a dedicated two-week training camp in Ada for eight national beach volleyball duos.",
      "The training regimen focuses on wind adaptation, quick lateral transitions on soft sand, and specialized jump-float service reception.",
      "The head coach noted that recent performances on the West African circuit demonstrate Ghana has the physical presence and agility to compete with the continent's top-seeded pairs.",
    ],
    discoverySource: {
      type: "press_release",
      sourceName: "Ghana Volleyball Association (GVA)",
      sourceUrl: "https://ghanavolley.org/ada-camp-2026",
      discoveredAt: "2026-10-08T10:45:00Z",
    },
    editorialVerification: {
      verifiedBy: "Sports Desk Verification Team",
      verifiedAt: "2026-10-08T13:30:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes:
        "Coach interview and player travel allowances corroborated with GVA General Secretary.",
    },
  },

  // --- 8. COMBAT & OTHERS ---
  {
    id: "gha-co-008",
    title: "National Table Tennis Championship: Junior Phenoms Impress in Trust Sports Emporium Showcase",
    slug: "national-table-tennis-championship-junior-phenoms",
    category: "Combat & Others",
    featured: false,
    status: "approved",
    author: "Nii Ayitey Hammond · Olympic Sports",
    publishedAt: "Oct 07, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&q=80",
    excerpt:
      "Over 120 competitors from across ten regions converged on the Trust Sports Emporium in Accra for the 2026 National Table Tennis Top 16 Championship.",
    content: [
      "The Ghana Table Tennis Association (GTTA) concluded its premier domestic competition over the weekend, spotlighting rapid developmental strides among teenage contenders.",
      "Fourteen-year-old sensation Blessing Darko swept the girls' under-18 category with crisp forehand loops and aggressive backhand counter-blocks, earning an automatic invitation to the senior national trials.",
      "GTTA leadership praised corporate partners for supporting equipment upgrades and regional grassroots development across public schools.",
    ],
    discoverySource: {
      type: "field_correspondent",
      sourceName: "Trust Sports Emporium Media Desk",
      discoveredAt: "2026-10-07T16:00:00Z",
    },
    editorialVerification: {
      verifiedBy: "Shem Bravon Lamptey (Editor-in-Chief)",
      verifiedAt: "2026-10-07T19:00:00Z",
      factChecked: true,
      sourceVerified: true,
      editorialNotes:
        "Official tournament draw sheets and trophy presentation records verified.",
    },
  },

  // --- PENDING QUEUE STORIES (Editorial Verification Gatekeeper) ---
  {
    id: "gha-pnd-001",
    title: "[WIRE DISCOVERY] Black Stars Scouting Team Tracks Three Dual-National Talents in Europe",
    slug: "black-stars-scouting-dual-national-talents",
    category: "Football",
    status: "pending",
    author: "Automated Wire Ingestion / Feed #14",
    publishedAt: "Pending Editorial Approval",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
    excerpt:
      "Automated sports wire alert: Ghana FA technical scouts were sighted in Germany and Belgium monitoring two under-21 Bundesliga wingers ahead of next month's international window.",
    content: [
      "Wire dispatch: GFA technical scouts reportedly attended matches in the German Bundesliga and Belgian Pro League to assess eligible Ghanaian dual-nationals.",
      "Initial reports suggest contact has been initiated with the players' legal representatives, though no official nationality-switch dossier has been filed with FIFA yet.",
      "Awaiting direct confirmation from the GFA Communications Director before publishing to the public feed.",
    ],
    discoverySource: {
      type: "automated_wire",
      sourceName: "African Football NewsWire Bot (RSS Aggregator)",
      sourceUrl: "https://wire.africanfootball.example/scouting-ghana",
      discoveredAt: "2026-10-14T12:10:00Z",
      rawSnippet:
        "GFA scouts spotted at Bundesliga match; dual nationals approached for Black Stars call-ups.",
    },
    editorialVerification: {
      verifiedBy: "Pending Verification",
      verifiedAt: "",
      factChecked: false,
      sourceVerified: false,
      editorialNotes:
        "Under review by Chief Football Analyst. Need to confirm whether player passports have been submitted to FIFA Player Status Committee.",
    },
  },
  {
    id: "gha-pnd-002",
    title: "[FEDERATION DRAFT] Ghana Judo Federation Announces 6-Athlete Team for Dakar Open",
    slug: "ghana-judo-federation-dakar-open-squad",
    category: "Combat & Others",
    status: "pending",
    author: "Federation Liaison Desk",
    publishedAt: "Pending Editorial Approval",
    readTime: "2 min",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    excerpt:
      "Draft press release submitted by the Ghana Judo Federation detailing travel plans, weight categories, and Olympic ranking points at stake in Senegal.",
    content: [
      "The Ghana Judo Federation has submitted a provisional traveling list of six judokas for the upcoming Dakar African Open.",
      "The team will feature three men (-66kg, -73kg, -81kg) and three women (-57kg, -63kg, -70kg).",
      "Editorial verification required: check visa approvals and confirmed travel itinerary with National Sports Authority (NSA).",
    ],
    discoverySource: {
      type: "press_release",
      sourceName: "Ghana Judo Federation Press Office",
      discoveredAt: "2026-10-14T13:45:00Z",
    },
    editorialVerification: {
      verifiedBy: "Pending Verification",
      verifiedAt: "",
      factChecked: false,
      sourceVerified: false,
      editorialNotes:
        "Pending National Sports Authority (NSA) flight ticket confirmation.",
    },
  },
];

// Curated bank of unique wire discovery templates to prevent duplicate headlines
export const WIRE_DISCOVERY_TEMPLATES: Array<{
  category: Exclude<SportCategory, "All Sports">;
  title: string;
  excerpt: string;
  source: string;
  image: string;
}> = [
  {
    category: "Armwrestling",
    title: "[AUTOMATED WIRE] Golden Arms Announce 14-Puller National Roster for All-Africa Challenge",
    excerpt: "Automated crawler captured GAF official secretariat communique listing weight categories for the upcoming continental clash in Cairo.",
    source: "Pan-African Sports Wire Crawler",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
  },
  {
    category: "Boxing",
    title: "[AUTOMATED WIRE] Commonwealth Boxing Council Approves Accra Title Defense for December",
    excerpt: "Wire alert: Sanctioning agreement signed for Bukom Arena defense featuring Ghana's super-bantamweight champion.",
    source: "Commonwealth Boxing Press Feed",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
  },
  {
    category: "Basketball",
    title: "[AUTOMATED WIRE] BAL Qualifiers: Customs Braves Secure West Division Group Draw",
    excerpt: "Automated FIBA Africa alert confirms group placements for Ghana's domestic champions in the Basketball Africa League road to BAL.",
    source: "FIBA Africa RSS Ingestion",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
  },
  {
    category: "Hockey",
    title: "[AUTOMATED WIRE] African Hockey Club Championship: Trustees Awarded Accra Hosting Bid",
    excerpt: "Continental federation dispatch indicates National Hockey Stadium in Accra will stage the 2027 club tournament.",
    source: "African Hockey Federation NewsWire",
    image: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80",
  },
  {
    category: "Athletics",
    title: "[AUTOMATED WIRE] NCAA All-American Sprinters Commit to Ghana Olympic Trials Camp",
    excerpt: "Collegiate tracking bot identified three Ghanaian 200m finalists filing official availability declarations with GAA.",
    source: "Track & Field Global Scraper",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80",
  },
  {
    category: "Volleyball",
    title: "[AUTOMATED WIRE] West African Zone 3 Volleyball Tour: Accra Slated for Beach Finals",
    excerpt: "Regional volleyball bulletin details ten national teams competing at Laboma Beach sports court next month.",
    source: "CAVB Zone 3 Ingestion Bot",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
  },
];

export const SPORT_PRESET_IMAGES: Record<
  Exclude<SportCategory, "All Sports">,
  Array<{ label: string; url: string }>
> = {
  Football: [
    { label: "GPL Race (Local)", url: "/gpl-race-heating-up.png.png" },
    { label: "GPL Season (Local)", url: "/Ghana-Premier-League-Graphics/gpl-season.png" },
    { label: "Black Stars (Local)", url: "/Black-Stars-Graphics/world-cup-2026.png" },
    { label: "Black Queens (Local)", url: "/Black-Queens-Graphics/black-queens-hero1.png" },
    { label: "Striker Shot", url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80" },
    { label: "Black Stars Training", url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80" },
  ],
  Boxing: [
    { label: "Bukom Ring Duel", url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80" },
    { label: "Fighter Conditioning", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80" },
  ],
  Athletics: [
    { label: "Sprint Blocks", url: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80" },
    { label: "Stadium Finish Line", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" },
  ],
  Armwrestling: [
    { label: "Golden Arms Duel", url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80" },
    { label: "Strength Training", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80" },
  ],
  Basketball: [
    { label: "Through the Hoop", url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80" },
    { label: "Sprite Ball / ABL", url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80" },
  ],
  Hockey: [
    { label: "National Stadium Turf", url: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80" },
  ],
  Volleyball: [
    { label: "Beach Spike at Laboma", url: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80" },
  ],
  "Combat & Others": [
    { label: "Trust Emporium Table Tennis", url: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&q=80" },
    { label: "Dakar Open Judo", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80" },
  ],
};
