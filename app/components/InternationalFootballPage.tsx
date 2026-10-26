"use client";

interface InternationalFootballPageProps {
  section: string;
  onNavigate: (page: string) => void;
}

interface StoryBeat {
  year: string;
  title: string;
  detail: string;
}

interface DetailCard {
  title: string;
  detail: string;
}

interface GalleryImage {
  name: string;
  src: string;
  caption: string;
}

interface ImageGallery {
  title: string;
  intro: string;
  layout: "crests" | "moments";
  images: GalleryImage[];
  featuredClub?: GalleryImage;
  featuredClubNote?: string;
  featuredClubs?: GalleryImage[];
  featuredClubsNote?: string;
}

interface CompetitionProfile {
  mark: string;
  region: string;
  title: string;
  season: string;
  summary: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  historyTitle: string;
  history: StoryBeat[];
  landscapeTitle: string;
  landscapeIntro: string;
  landscape: DetailCard[];
  officialLinks: { label: string; href: string }[];
  related: { label: string; section: string }[];
}

const profiles: Record<string, CompetitionProfile> = {
  "premier-league": {
    mark: "PL",
    region: "ENGLAND · MEN'S TOP FLIGHT",
    title: "Premier League",
    season: "2026/27 season",
    summary: "Twenty clubs compete across a home-and-away season for the Premier League title, European places and survival in the division.",
    heroImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=85",
    stats: [
      { value: "20", label: "Clubs" },
      { value: "38", label: "Matches per club" },
      { value: "380", label: "League fixtures" },
      { value: "1992", label: "Premier League founded" },
    ],
    historyTitle: "A new era in English football",
    history: [
      { year: "1992", title: "The Premier League begins", detail: "The new competition launched with 22 clubs, before later reducing to its current 20-club format." },
      { year: "38 games", title: "Every opponent home and away", detail: "The double round-robin format gives each club 19 home and 19 away matches." },
      { year: "Today", title: "A global competition", detail: "The season combines domestic rivalry with qualification places for UEFA competitions and the fight to avoid relegation." },
    ],
    landscapeTitle: "Clubs, places and the table",
    landscapeIntro: "The official table tracks every club through the season. Final positions decide the champion, European qualification and relegation under the competition rules.",
    landscape: [
      { title: "Historic clubs", detail: "Arsenal, Liverpool, Manchester United and other long-standing clubs have helped shape the competition's modern identity." },
      { title: "European places", detail: "League position can qualify clubs for UEFA competitions. The number and route of places depend on the applicable season rules." },
      { title: "Promotion and relegation", detail: "The lowest-placed clubs leave the division at season's end, with promoted clubs joining from the EFL Championship." },
    ],
    officialLinks: [
      { label: "Fixtures, results, table and clubs", href: "https://www.premierleague.com/" },
      { label: "All 380 fixtures for 2026/27", href: "https://www.premierleague.com/en/news/4675097/all-380-fixtures-for-202627-premier-league-season" },
      { label: "Premier League history", href: "https://www.premierleague.com/en/news/62792" },
    ],
    related: [{ label: "UEFA Champions League", section: "champions-league" }, { label: "UEFA", section: "uefa" }],
  },
  "champions-league": {
    mark: "UCL",
    region: "EUROPE · UEFA CLUB COMPETITION",
    title: "UEFA Champions League",
    season: "2026/27 season",
    summary: "Europe's leading men's club competition brings together teams from national leagues, beginning with a 36-club league phase before the knockouts.",
    heroImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=85",
    stats: [
      { value: "36", label: "League-phase clubs" },
      { value: "8", label: "Matches per club" },
      { value: "24", label: "Reach the knockouts" },
      { value: "1955", label: "European Cup begins" },
    ],
    historyTitle: "From European Cup to Champions League",
    history: [
      { year: "1955", title: "The European Cup is launched", detail: "The first edition began as the European Champion Clubs' Cup, with Real Madrid winning the inaugural title." },
      { year: "1990s", title: "A new Champions League era", detail: "The competition adopted its Champions League identity and grew into a broader tournament for Europe's leading clubs." },
      { year: "2024/25", title: "The league phase arrives", detail: "A single 36-team standings table replaced the former group-stage format." },
    ],
    landscapeTitle: "The road to the final",
    landscapeIntro: "Clubs qualify through domestic leagues and the UEFA access list. The league-phase finish determines each team's route through the knockout rounds.",
    landscape: [
      { title: "Europe's club greats", detail: "Real Madrid, Bayern München, Liverpool and AC Milan are among the historic clubs associated with the competition's biggest nights." },
      { title: "Knockout qualification", detail: "The top eight advance directly to the round of 16. Places 9–24 play two-legged knockouts for the remaining places; the rest are eliminated." },
      { title: "The final", detail: "The final is a single match at a venue selected by UEFA. The 2026/27 final is scheduled for Madrid on 5 June 2027." },
    ],
    officialLinks: [
      { label: "Live competition centre", href: "https://www.uefa.com/uefachampionsleague/" },
      { label: "2026/27 format, teams and dates", href: "https://www.uefa.com/uefachampionsleague/news/02a6-20d57cfcd03e-407c22a7f465-1000--2026-27-champions-league-teams-dates-draws-format-final/" },
      { label: "UEFA competition history", href: "https://www.uefa.com/about/our-history/" },
    ],
    related: [{ label: "Premier League", section: "premier-league" }, { label: "La Liga", section: "la-liga" }, { label: "UEFA", section: "uefa" }],
  },
  "la-liga": {
    mark: "LALIGA",
    region: "SPAIN · MEN'S TOP FLIGHT",
    title: "LALIGA EA SPORTS",
    season: "2026/27 season",
    summary: "Spain's top division brings 20 clubs together in a season-long race shaped by historic rivalries, title contenders and the battle to stay up.",
    heroImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=85",
    stats: [
      { value: "20", label: "Clubs" },
      { value: "38", label: "Matchdays" },
      { value: "380", label: "League matches" },
      { value: "1929", label: "League competition begins" },
    ],
    historyTitle: "A century of Spanish league football",
    history: [
      { year: "1929", title: "The first league season", detail: "Spanish clubs began competing in the national league, establishing a new stage for rivalries such as ElClásico." },
      { year: "Home & away", title: "A 20-club campaign", detail: "Each club meets every other participant twice across 38 matchdays." },
      { year: "Today", title: "A competition across Spain", detail: "The division brings clubs from across the country together, with standings determining the champion, European places and relegation." },
    ],
    landscapeTitle: "Clubs and Spanish rivalries",
    landscapeIntro: "LALIGA's official club directory is the current reference for participating teams, club profiles and competition information.",
    landscape: [
      { title: "Real Madrid", detail: "One of Spain's best-known clubs and a regular contender in both LALIGA and European football." },
      { title: "FC Barcelona", detail: "A historic Catalan club with a long-running rivalry with Real Madrid, known as ElClásico." },
      { title: "Atlético de Madrid", detail: "A major Madrid club whose city rivalry and domestic title challenges are part of LALIGA's story." },
    ],
    officialLinks: [
      { label: "Current clubs and competition", href: "https://www.laliga.com/en-US/laliga-easports/clubs" },
      { label: "2026/27 season calendar", href: "https://www.laliga.com/noticias/ya-se-conoce-el-calendario-al-completo-de-laliga-ea-sports-2026-27" },
      { label: "ElClásico history", href: "https://www.laliga.com/en-ES/partidazos/el-clasico" },
    ],
    related: [{ label: "UEFA Champions League", section: "champions-league" }, { label: "UEFA", section: "uefa" }],
  },
  bundesliga: {
    mark: "BUNDESLIGA",
    region: "GERMANY · MEN'S TOP FLIGHT",
    title: "Bundesliga",
    season: "2026/27 season",
    summary: "Germany's top division features 18 clubs, packed matchdays and a direct connection to Bundesliga 2 through promotion and relegation.",
    heroImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=85",
    stats: [
      { value: "18", label: "Clubs" },
      { value: "34", label: "Matches per club" },
      { value: "1963", label: "Bundesliga begins" },
      { value: "22 May", label: "Final matchday" },
    ],
    historyTitle: "The Bundesliga takes shape",
    history: [
      { year: "1963", title: "A national league begins", detail: "The Bundesliga's first season brought clubs into a nationwide top division in West Germany." },
      { year: "1965/66", title: "The league expands", detail: "The competition moved to an 18-team format, which became its established structure." },
      { year: "Today", title: "Thirty-four matchdays", detail: "Each club plays the other 17 home and away, with the final table determining the champion and relegation outcomes." },
    ],
    landscapeTitle: "Clubs, supporters and the table",
    landscapeIntro: "The Bundesliga combines an 18-club league with promotion and relegation links to Bundesliga 2.",
    landscape: [
      { title: "Bayern München", detail: "One of Germany's most decorated clubs and a recurring contender in the Bundesliga and UEFA competitions." },
      { title: "Borussia Dortmund", detail: "A major German club known for its passionate support and long-standing domestic rivalry with Bayern." },
      { title: "Home and away", detail: "Every club plays 34 league matches: one at home and one away against each of 17 opponents." },
    ],
    officialLinks: [
      { label: "Bundesliga fixtures, table and clubs", href: "https://www.bundesliga.com/en/bundesliga" },
      { label: "2026/27 season calendar", href: "https://www.bundesliga.com/en/bundesliga/news/2026-27-season-fixture-schedules-37671" },
      { label: "Bundesliga history and format", href: "https://www.bundesliga.com/en/faq/10-things-on-the-bundesliga" },
    ],
    related: [{ label: "UEFA Champions League", section: "champions-league" }, { label: "UEFA", section: "uefa" }],
  },
  "serie-a": {
    mark: "SERIE A",
    region: "ITALY · MEN'S TOP FLIGHT",
    title: "Serie A Enilive",
    season: "2026/27 season",
    summary: "Italy's top division is a 20-club competition known for tactical battles, major city rivalries and a long national football tradition.",
    heroImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1600&q=85",
    stats: [
      { value: "20", label: "Clubs" },
      { value: "38", label: "Matchdays" },
      { value: "380", label: "League matches" },
      { value: "22 Aug", label: "Season begins" },
    ],
    historyTitle: "The Italian top-flight story",
    history: [
      { year: "1898", title: "National championship roots", detail: "Italian national championship football dates to the late nineteenth century; the league structure has evolved over time." },
      { year: "Home & away", title: "A full season of rivalries", detail: "Today's 20 clubs meet twice, producing 38 matchdays and 380 matches." },
      { year: "Today", title: "The Scudetto race", detail: "The title race sits alongside qualification for UEFA competitions and the fight to remain in the division." },
    ],
    landscapeTitle: "Clubs and the Scudetto race",
    landscapeIntro: "The competition spans Italy, with club identities and local rivalries at the heart of every matchday.",
    landscape: [
      { title: "Juventus", detail: "Turin's historic club has played a central role in the modern story of Italian league football." },
      { title: "Inter and AC Milan", detail: "The Milan clubs share the San Siro and meet in one of Italian football's defining city derbies." },
      { title: "The title", detail: "Clubs collect points through 38 matchdays, with the highest-ranked team crowned champion under league rules." },
    ],
    officialLinks: [
      { label: "Serie A competition centre", href: "https://en.legaseriea.it/serie-a" },
      { label: "Official 2026/27 season guide", href: "https://en.legaseriea.it/serie-a/news/looking-forward-to-the-2026-27-serie-a-fixture-list" },
      { label: "Calendar draw criteria", href: "https://en.legaseriea.it/serie-a/news/criteria-to-be-followed-for-the-draw-of-the-serie-a-2026-2027-calendar" },
    ],
    related: [{ label: "UEFA Champions League", section: "champions-league" }, { label: "UEFA", section: "uefa" }],
  },
  "ligue-1": {
    mark: "L1",
    region: "FRANCE · MEN'S TOP FLIGHT",
    title: "Ligue 1 McDonald's",
    season: "2026/27 season",
    summary: "France's top division brings 18 clubs into a 34-matchday campaign for the title, European places and the fight to avoid relegation.",
    heroImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=85",
    stats: [
      { value: "18", label: "Clubs" },
      { value: "34", label: "Matchdays" },
      { value: "29 May", label: "Final matchday" },
      { value: "1932", label: "Professional league begins" },
    ],
    historyTitle: "French football at the top level",
    history: [
      { year: "1932", title: "Professional league football begins", detail: "France's national professional league began in the 1932/33 season." },
      { year: "18 clubs", title: "A compact modern format", detail: "The current division runs across 34 matchdays, with clubs meeting home and away." },
      { year: "Today", title: "The season's final push", detail: "The table determines the champion, European places and the clubs facing relegation or a play-off." },
    ],
    landscapeTitle: "Clubs and the race for places",
    landscapeIntro: "Ligue 1 combines a home-and-away league schedule with movement between the top flight and Ligue 2.",
    landscape: [
      { title: "Paris Saint-Germain", detail: "The capital's club is a major force in the modern Ligue 1 title race and a regular European competitor." },
      { title: "Olympique de Marseille", detail: "A historic club with one of French football's most passionate supporter bases and a famous national rivalry." },
      { title: "Promotion and relegation", detail: "The 16th-placed club is scheduled to contest a two-legged play-off against the Ligue 2 play-off winner." },
    ],
    officialLinks: [
      { label: "Ligue 1 competition centre", href: "https://ligue1.com/en/" },
      { label: "2026/27 official calendar", href: "https://ligue1.com/en/articles/l1_article_5292-the-2026-27-ligue-1-mcdonald-s-calendar-is-released" },
      { label: "Season dates and play-off details", href: "https://ligue1.com/en/articles/l1_article_3812-" },
      { label: "Champions and league history", href: "https://ligue1.com/en/articles/l1_article_289-le-palmares-des-champions-de-ligue-1" },
    ],
    related: [{ label: "UEFA Champions League", section: "champions-league" }, { label: "UEFA", section: "uefa" }],
  },
  mls: {
    mark: "MLS",
    region: "UNITED STATES & CANADA · MEN'S TOP FLIGHT",
    title: "Major League Soccer",
    season: "2026 season",
    summary: "Major League Soccer spans the United States and Canada, with Eastern and Western Conference races leading into the MLS Cup Playoffs.",
    heroImage: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1600&q=85",
    stats: [
      { value: "30", label: "Clubs" },
      { value: "34", label: "Regular-season matches" },
      { value: "2", label: "Conferences" },
      { value: "1996", label: "Inaugural season" },
    ],
    historyTitle: "From inaugural season to 30 clubs",
    history: [
      { year: "1996", title: "MLS kicks off", detail: "The inaugural season began with ten clubs split between the Eastern and Western Conferences." },
      { year: "Expansion", title: "A growing league", detail: "The competition expanded over time to include clubs across the United States and Canada." },
      { year: "Today", title: "Conference races and playoffs", detail: "Regular-season standings determine qualification for the Audi MLS Cup Playoffs and the route to MLS Cup." },
    ],
    landscapeTitle: "East, West and the MLS Cup Playoffs",
    landscapeIntro: "The league is organized into two conferences, with a schedule balancing conference matchups and cross-conference games.",
    landscape: [
      { title: "Eastern Conference", detail: "Clubs including Inter Miami CF and Atlanta United compete for conference position and playoff qualification." },
      { title: "Western Conference", detail: "Clubs including LA Galaxy and Seattle Sounders FC contest the Western table and playoff bracket." },
      { title: "Playoff route", detail: "The top seven in each conference qualify directly for Round One; places eight and nine play a Wild Card match." },
    ],
    officialLinks: [
      { label: "MLS fixtures, standings and clubs", href: "https://www.mlssoccer.com/" },
      { label: "Official 2026 competition guidelines", href: "https://www.mlssoccer.com/league-reports/competition-guidelines/" },
      { label: "MLS history", href: "https://www.mlssoccer.com/news/mls-history-323176" },
    ],
    related: [{ label: "FIFA", section: "fifa" }, { label: "UEFA Champions League", section: "champions-league" }],
  },
  fifa: {
    mark: "FIFA",
    region: "GLOBAL · WORLD FOOTBALL GOVERNING BODY",
    title: "FIFA",
    season: "Global football calendar",
    summary: "FIFA is the global governing body for association football, working with national member associations and six continental confederations.",
    heroImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1600&q=85",
    stats: [
      { value: "211", label: "Member associations" },
      { value: "6", label: "Continental confederations" },
      { value: "1904", label: "FIFA founded" },
      { value: "Worldwide", label: "Football's global game" },
    ],
    historyTitle: "Football's global governing body",
    history: [
      { year: "1904–1906", title: "Robert Guérin", detail: "FIFA's first president helped bring together the founding associations in Paris and establish the organisation's first statutes." },
      { year: "1906–1918", title: "Daniel Burley Woolfall", detail: "The English administrator worked toward uniform international rules and helped organise football at the 1908 Olympic Games." },
      { year: "1921–1954", title: "Jules Rimet", detail: "Rimet championed the creation of the FIFA World Cup, first held in Uruguay in 1930." },
      { year: "1954–1955", title: "Rodolphe William Seeldrayers", detail: "The Belgian sports administrator succeeded Rimet and served until his death in 1955." },
      { year: "1955–1961", title: "Arthur Drewry", detail: "The English football administrator led FIFA through the 1958 World Cup in Sweden." },
      { year: "1961–1974", title: "Sir Stanley Rous", detail: "The former referee and English FA secretary led FIFA as the World Cup became a global television event." },
      { year: "1974–1998", title: "João Havelange", detail: "The Brazilian president expanded FIFA's competitions and increased participation from more regions." },
      { year: "1998–2015", title: "Joseph S. Blatter", detail: "Blatter was FIFA's eighth president and resigned his mandate in 2015." },
      { year: "2016–present", title: "Gianni Infantino", detail: "FIFA's ninth president was first elected in 2016 and re-elected in 2023 for the 2023–2027 term." },
    ],
    landscapeTitle: "Who forms and leads FIFA",
    landscapeIntro: "FIFA is formed by its member associations and governed through the Congress, Council and General Secretariat.",
    landscape: [
      { title: "FIFA Congress: the member associations", detail: "FIFA has 211 member associations across six continents. They govern and develop football in their territories, and together form FIFA's supreme legislative body, the Congress." },
      { title: "The seven founding members", detail: "FIFA was founded in Paris in 1904 by associations from Belgium, Denmark, France, the Netherlands, Spain, Sweden and Switzerland. Spain was represented by Real Madrid CF at the founding meeting. Robert Guérin helped organise the meeting and became FIFA's first president." },
      { title: "FIFA Council: strategic leadership", detail: "The 37-member Council guides FIFA between Congress meetings. It consists of the president, eight vice-presidents and 28 members elected by the associations. The current president is Gianni Infantino." },
      { title: "General Secretariat: daily management", detail: "The General Secretariat handles FIFA's executive, operational and administrative work. Mattias Grafström has served as FIFA Secretary General since his appointment by the Council in May 2024." },
      { title: "National-team managers", detail: "Head coaches manage their national teams and are appointed by their own member associations. FIFA sets competition rules and organises tournaments, but does not appoint every national-team manager." },
      { title: "Six continental confederations", detail: "AFC, CAF, Concacaf, CONMEBOL, OFC and UEFA organise football across Asia, Africa, North and Central America and the Caribbean, South America, Oceania and Europe." },
    ],
    officialLinks: [
      { label: "FIFA member associations", href: "https://legal.fifa.com/associations" },
      { label: "FIFA tournaments and events", href: "https://www.fifa.com/en/tournaments/" },
      { label: "FIFA past presidents", href: "https://inside.fifa.com/en/organisation/president/past-presidents" },
      { label: "FIFA Council and current leadership", href: "https://inside.fifa.com/organisation/fifa-council" },
      { label: "FIFA governance and organisation", href: "https://inside.fifa.com/organisation" },
    ],
    related: [{ label: "UEFA", section: "uefa" }, { label: "Major League Soccer", section: "mls" }],
  },
  uefa: {
    mark: "UEFA",
    region: "EUROPE · CONTINENTAL FOOTBALL GOVERNING BODY",
    title: "UEFA",
    season: "2026/27 competitions",
    summary: "UEFA governs football in Europe and organizes national-team and club competitions across its 55 member associations.",
    heroImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=85",
    stats: [
      { value: "55", label: "National associations" },
      { value: "3", label: "Men's club competitions" },
      { value: "1954", label: "UEFA founded" },
      { value: "Europe", label: "Regional remit" },
    ],
    historyTitle: "Building European football",
    history: [
      { year: "1954", title: "UEFA is founded", detail: "European national associations formed a continental body to coordinate football across Europe." },
      { year: "1955", title: "European club competition begins", detail: "The European Champion Clubs' Cup launched, later becoming the UEFA Champions League." },
      { year: "Today", title: "National teams and clubs", detail: "UEFA oversees regional competitions, development work and regulations for European football." },
    ],
    landscapeTitle: "Associations, national teams and clubs",
    landscapeIntro: "UEFA's member associations represent national football, while its competition portfolio serves both national teams and clubs.",
    landscape: [
      { title: "55 associations", detail: "UEFA's national associations page provides the official member directory." },
      { title: "National-team competitions", detail: "UEFA organizes events including the European Championship and Nations League, with separate qualification rules." },
      { title: "Club competitions", detail: "The men's club portfolio includes the Champions League, Europa League and Conference League, alongside women's competitions." },
    ],
    officialLinks: [
      { label: "UEFA national associations", href: "https://www.uefa.com/nationalassociations/" },
      { label: "UEFA competitions", href: "https://www.uefa.com/" },
      { label: "UEFA history", href: "https://www.uefa.com/about/our-history/" },
    ],
    related: [{ label: "UEFA Champions League", section: "champions-league" }, { label: "Premier League", section: "premier-league" }],
  },
};

const crest = (name: string, id: number): GalleryImage => ({
  name,
  src: `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`,
  caption: "Club crest",
});

const actionPhoto = (name: string, photoId: string, caption: string): GalleryImage => ({
  name,
  src: `https://images.unsplash.com/${photoId}?w=1000&q=85`,
  caption,
});

const imageGalleries: Record<string, ImageGallery> = {
  "premier-league": {
    title: "All 20 Premier League club crests",
    intro: "The official 2026/27 club line-up, shown in the same crest-grid style as the Ghana Premier League clubs section.",
    layout: "crests",
    images: [
      crest("Arsenal", 359), crest("Aston Villa", 362), crest("AFC Bournemouth", 349), crest("Brentford", 337),
      crest("Brighton & Hove Albion", 331), crest("Chelsea", 363), crest("Coventry City", 388), crest("Crystal Palace", 384),
      crest("Everton", 368), crest("Fulham", 370), crest("Hull City", 306), crest("Ipswich Town", 373),
      crest("Leeds United", 357), crest("Liverpool", 364), crest("Manchester City", 382), crest("Manchester United", 360),
      crest("Newcastle United", 361), crest("Nottingham Forest", 393), crest("Sunderland", 366), crest("Tottenham Hotspur", 367),
    ],
  },
  "champions-league": {
    title: "The Champions League night",
    intro: "A mix of matchday scenes—team walk-outs, line-ups, action and celebrations—following the photo-led feel of the Ghana Division One page.",
    layout: "moments",
    images: [
      { name: "Teams line up before kick-off", src: "https://editorial.uefa.com/resources/0298-1d7678a2eed4-a9e4274c1ae6-1000/borussia_dortmund_v_fc_barcelona_-_uefa_champions_league_2024_25_league_phase_md6.jpeg", caption: "Barcelona and Borussia Dortmund line up before a Champions League match" },
      { name: "Players prepare in the dressing room", src: "https://4.bp.blogspot.com/-TkTiprAfQJU/UDeWGgscCMI/AAAAAAABeGE/mQofJRZyTJ8/s1600/psg%2Blocker8.jpg", caption: "Paris Saint-Germain players get ready in the dressing room" },
      { name: "Another team line-up before kick-off", src: "https://www.bvb.de/adobe/dynamicmedia/deliver/dm-aid--b414b25c-d0b5-4e20-ae74-4b568c7bd775/barcelona.jpg?preferwebp=true&quality=85", caption: "Borussia Dortmund and Barcelona pose before kick-off" },
      { name: "A packed Champions League stadium", src: "https://img.fcbayern.com/image/upload/f_auto/q_auto/t_cms-4x3-seo/v1601338906/cms/public/images/fcbayern-com/homepage/saison-18-19/galerien/spiele/fcb-liverpool/01_fcb-lfc_190313_don.jpg", caption: "Supporters fill the Allianz Arena for Bayern Munich against Liverpool" },
      { name: "Two teams attack in a Champions League match", src: "https://img.fcbayern.com/image/upload/f_auto/q_auto/ar_16%3A9%2Cc_fill%2Cg_custom%2Cw_512/v1601338910/cms/public/images/fcbayern-com/homepage/saison-18-19/galerien/spiele/fcb-liverpool/03_fcb-lfc_190313_get.jpg", caption: "Bayern Munich and Liverpool battle for the ball" },
      { name: "Players celebrate a Champions League goal", src: "https://www.2playbook.com/uploads/s1/37/81/78/real-madrid-champions-league-2024.jpeg", caption: "Real Madrid players celebrate together after scoring" },
    ],
  },
  "la-liga": {
    title: "Clubs of LALIGA",
    intro: "A selection of familiar Spanish club crests. The official club directory has the complete current-season line-up.",
    layout: "crests",
    images: [crest("Real Madrid", 86), crest("FC Barcelona", 83), crest("Atlético de Madrid", 1068), crest("Real Betis", 90)],
  },
  bundesliga: {
    title: "Clubs of the Bundesliga",
    intro: "All 18 Bundesliga clubs, arranged by the 2026/27 league table as of 23 October 2026.",
    layout: "crests",
    images: [
      crest("Bayern München", 132),
      crest("Borussia Dortmund", 124),
      crest("SC Freiburg", 126),
      crest("Bayer Leverkusen", 131),
      crest("Mainz 05", 2950),
      crest("SV Elversberg", 10388),
      crest("RB Leipzig", 11420),
      crest("Werder Bremen", 137),
      crest("Hamburger SV", 127),
      crest("FC Augsburg", 3841),
      crest("Eintracht Frankfurt", 125),
      crest("1. FC Köln", 122),
      crest("VfB Stuttgart", 134),
      crest("TSG Hoffenheim", 7911),
      crest("FC Schalke 04", 133),
      crest("SC Paderborn 07", 3307),
      crest("1. FC Union Berlin", 598),
      crest("Borussia Mönchengladbach", 268),
    ],
  },
  "serie-a": {
    title: "Clubs of Serie A",
    intro: "A selection of Italian club crests. Lega Serie A provides the complete current club list and profiles.",
    layout: "crests",
    images: [crest("AC Milan", 103), crest("Inter", 110), crest("Juventus", 111), crest("AS Roma", 104)],
  },
  "ligue-1": {
    title: "Clubs of Ligue 1",
    intro: "A selection of French club crests. The official Ligue 1 site lists all current teams and club information.",
    layout: "crests",
    images: [crest("Paris Saint-Germain", 160), crest("Olympique de Marseille", 176), crest("Olympique Lyonnais", 167), crest("AS Monaco", 174)],
  },
  mls: {
    title: "Clubs and matchday in MLS",
    intro: "MLS matchday moments: team line-ups, dressing-room preparation, stadium atmosphere, attacking play and goal celebrations.",
    layout: "moments",
    featuredClub: crest("Nashville SC", 18986),
    featuredClubNote: "2026 regular-season points leader",
    images: [
      { name: "Teams line up before kick-off", src: "https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/mls-sje/a9g0jphjvo6hiu2vtovu.jpg", caption: "San Jose Earthquakes line up before an MLS match" },
      { name: "Players prepare in the dressing room", src: "https://images.mlssoccer.com/image/private/t_photogallery_3x/mls-nyc/h0boopbd9vjhds5bkrdy.jpg", caption: "New York City FC players get ready together before the match" },
      { name: "Another team line-up before kick-off", src: "https://images.mlssoccer.com/image/private/t_photogallery_3x/mls-clt-prd/lo58ixyruebxdlduj2un.jpg", caption: "Charlotte FC players pose before kick-off at LAFC" },
      { name: "A packed MLS stadium", src: "https://www.dignityhealthsportspark.com/assets/img/022524_LA_GALAXY_MO_0361-21638808bf.JPG", caption: "Fans fill Dignity Health Sports Park for a night match" },
      { name: "Two teams attack in an MLS match", src: "https://www.apple.com/newsroom/images/product/tv/lifestyle/Apple-MLS-Season-Pass-Apple-TV-Denis-Bouanga_Full-Bleed-Image.jpg.large.jpg", caption: "LAFC attack as a New England Revolution defender tracks back" },
      { name: "Players celebrate an MLS goal", src: "https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/mls/t2rkctnszranin0svyud", caption: "San Jose Earthquakes celebrate together after scoring" },
    ],
  },
  fifa: {
    title: "FIFA World Cup matchday",
    intro: "National teams prepare, compete and celebrate on football's biggest international stage.",
    layout: "moments",
    images: [
      { name: "National teams line up before kick-off", src: "https://s2.glbimg.com/yJuQ03u2zC8Vyc-2kCMQs08Ksjo%3D/1200x/smart/filters%3Acover%28%29%3Astrip_icc%28%29/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/Q/L/I1jWVSRA6UcuLreChemA/time-posado-argentina-x-croacia.jpg", caption: "Argentina pose before their 2022 World Cup semi-final against Croatia" },
      { name: "France prepare together in the dressing room", src: "https://i.f1g.fr/media/figaro/1200x630_crop/2019/01/03/XVMe53f567e-0f48-11e9-85cf-f4f6a503dd84.jpg", caption: "France gather for a final team talk before the 2018 World Cup final" },
      { name: "Spain line up before a World Cup match", src: "https://www.nikkansports.com/soccer/qatar2022/news/img/202212020000133-w1300_0.jpg", caption: "Spain stand for the pre-match ceremony at Qatar 2022" },
      { name: "A full World Cup stadium", src: "https://www.qatar-tribune.com/watanqatartribune/uploads/images/2022/11/27/48970.jpg", caption: "Supporters fill Lusail Stadium during the 2022 FIFA World Cup" },
      { name: "Argentina and France attack in the World Cup final", src: "https://mediaaws-live.almasryalyoum.com/AMAYLivePictures/portalimages/news/large/2022/12/18/1979927_0.jpg", caption: "Lionel Messi drives forward as France defend in the 2022 final" },
      { name: "Argentina celebrate a World Cup goal", src: "https://cdn2.mediotiempo.com/uploads/media/2022/12/03/argentinos-celebrando-marco-messi-reuters.jpg", caption: "Argentina teammates celebrate Lionel Messi's goal against Australia" },
    ],
  },
  uefa: {
    title: "UEFA matchday",
    intro: "European football on matchday: club line-ups, national-team preparation, stadium atmosphere, attacking play and goal celebrations.",
    layout: "moments",
    featuredClubsNote: "Selected in order of the 2025/26 UEFA men's club coefficient ranking.",
    featuredClubs: [
      crest("Bayern München", 132),
      crest("Real Madrid", 86),
      crest("Paris Saint-Germain", 160),
      crest("Liverpool", 364),
      crest("Inter", 110),
      crest("Manchester City", 382),
      crest("Arsenal", 359),
      crest("FC Barcelona", 83),
    ],
    images: [
      { name: "Teams line up before kick-off", src: "https://editorial.uefa.com/resources/0298-1d7678a2eed4-a9e4274c1ae6-1000/borussia_dortmund_v_fc_barcelona_-_uefa_champions_league_2024_25_league_phase_md6.jpeg", caption: "Barcelona and Borussia Dortmund line up before a UEFA match" },
      { name: "Players prepare together in the dressing room", src: "https://res.cloudinary.com/dfb-de/image/fetch/c_fill%2Cf_auto%2Ch_630%2Cq_auto%2Cw_1200/https%3A/assets.dfb.de/uploads/000/312/599/original_EM-Doku.jpg%3F1731704980", caption: "Germany's squad gathers in the dressing room during EURO 2024" },
      { name: "Another European club line-up", src: "https://media.eintracht.de/image/upload/ar_16%3A9%2Cc_fill%2Cdpr_3.0%2Cf_auto%2Cg_xy_center%2Cq_60%2Cw_400%2Cx_w_mul_0.56%2Cy_h_mul_0.44/v1765313773/uefa-champions-league-fc-barcelona-eintracht-frankfurt-mannschaft-team-startelf-ecba", caption: "Eintracht Frankfurt line up before kick-off against Barcelona" },
      { name: "A packed European stadium under the lights", src: "https://s7g10.scene7.com/is/image/BORUSSIADORTMUNDGMBHANDCOKGAA/CL-Stadion", caption: "Supporters fill Borussia Dortmund's stadium for a Champions League night" },
      { name: "Two European teams battle in attack", src: "https://img.vavel.com/fazfgozx0agghck-format-jpg-name-large-1661224658007.jpg", caption: "Benfica attack as Dynamo Kyiv defend in the Champions League" },
      { name: "Players celebrate a European goal", src: "https://editorial.uefa.com/resources/025a-0ea7faaf5d41-525abc165e0a-1000/2083188.jpeg", caption: "Real Madrid players celebrate against Borussia Dortmund" },
    ],
  },
};

export const INTERNATIONAL_FOOTBALL_SECTIONS = Object.keys(profiles);

export default function InternationalFootballPage({
  section,
  onNavigate,
}: InternationalFootballPageProps) {
  const profile = profiles[section];
  if (!profile) return null;
  const gallery = imageGalleries[section];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative isolate overflow-hidden border-b-4 border-red-600 bg-black">
        <img src={profile.heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/90 to-black/55" />
        <div className="mx-auto grid min-h-[440px] max-w-7xl gap-10 px-4 py-16 sm:px-6 md:min-h-[520px] md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · International Football</p>
            <p className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-300"><span className="h-px w-10 bg-red-500" />{profile.region}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">{profile.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">{profile.summary}</p>
            <span className="mt-6 inline-flex rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-200">{profile.season}</span>
          </div>
          <div className="flex min-h-48 items-end justify-between overflow-hidden rounded-3xl border border-white/15 bg-black/40 p-7 backdrop-blur-sm sm:min-h-56 sm:p-10">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">Competition profile</p><p className="mt-3 max-w-xs text-sm leading-6 text-gray-200">History, teams and current-season context from official competition sources.</p></div>
            <span aria-hidden="true" className="ml-4 select-none text-5xl font-black italic text-red-500 sm:text-7xl">{profile.mark}</span>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
          {profile.stats.map((stat) => <article key={stat.label} className="bg-[#080808] px-5 py-7 sm:px-8"><p className="text-3xl font-black text-white sm:text-4xl">{stat.value}</p><p className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</p></article>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div><p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The story so far</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">{profile.historyTitle}</h2><p className="mt-5 text-sm leading-7 text-gray-400">A quick guide to the competition's origins, format and place in the football calendar.</p></div>
          <div className="space-y-0 border-l border-red-500/50 pl-6 sm:pl-8">
            {profile.history.map((item) => <article key={`${item.year}-${item.title}`} className="relative border-b border-white/10 py-6 first:pt-0 last:border-0"><span className="absolute -left-[31px] top-7 h-3 w-3 rounded-full border-2 border-red-500 bg-black sm:-left-[39px]" /><p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{item.year}</p><h3 className="mt-2 text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-7 text-gray-400">{item.detail}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Teams & competition</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">{profile.landscapeTitle}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">{profile.landscapeIntro}</p>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {profile.landscape.map((item, index) => <article key={item.title} className="rounded-2xl border border-white/10 bg-black p-6"><p className="text-sm font-black text-red-500">{String(index + 1).padStart(2, "0")}</p><h3 className="mt-4 text-xl font-black">{item.title}</h3><p className="mt-3 text-sm leading-7 text-gray-400">{item.detail}</p></article>)}
          </div>
        </div>
      </section>

      {gallery && (
        <section className="bg-black px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">{gallery.layout === "crests" ? "The clubs" : "Matchday gallery"}</p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">{gallery.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">{gallery.intro}</p>
            <div className={`mt-9 grid gap-3 ${gallery.layout === "crests" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {gallery.images.map((item, index) => (
                <article key={item.name} className="group min-w-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-red-500/70">
                  <div className={gallery.layout === "crests" ? "relative flex aspect-square items-center justify-center bg-gradient-to-br from-zinc-900 to-black p-5" : "relative aspect-[16/10] overflow-hidden"}>
                    <img src={item.src} alt={gallery.layout === "crests" ? `${item.name} crest` : item.name} loading="lazy" className={gallery.layout === "crests" ? "h-full w-full object-contain transition duration-300 group-hover:scale-105" : "h-full w-full object-cover transition duration-500 group-hover:scale-105"} />
                  </div>
                  <div className={gallery.layout === "crests" ? "border-t border-white/10 p-3" : "p-5"}>
                    {gallery.layout === "crests" && <p className="mb-1 text-xs font-bold text-red-500">CLUB {String(index + 1).padStart(2, "0")}</p>}
                    <h3 className="break-words text-sm font-bold leading-5 text-white sm:text-base">{item.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">{item.caption}</p>
                  </div>
                </article>
              ))}
            </div>
            {gallery.featuredClubs && (
              <div className="mt-12">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Leading European clubs</p>
                <h3 className="mt-2 text-2xl font-black text-white">Top UEFA club crests</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{gallery.featuredClubsNote}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                  {gallery.featuredClubs.map((club, index) => (
                    <article key={club.name} className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-3 text-center transition hover:border-red-500/70">
                      <div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-zinc-900 to-black p-4">
                        <img src={club.src} alt={`${club.name} crest`} loading="lazy" className="h-full w-full object-contain" />
                      </div>
                      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-red-500">Rank {index + 1}</p>
                      <h4 className="mt-1 break-words text-xs font-bold leading-5 text-white">{club.name}</h4>
                    </article>
                  ))}
                </div>
              </div>
            )}
            {gallery.featuredClub && (
              <article className="mt-8 flex max-w-xl items-center gap-5 rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-black p-3">
                  <img src={gallery.featuredClub.src} alt={`${gallery.featuredClub.name} crest`} loading="lazy" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Top of the MLS table</p>
                  <h3 className="mt-2 text-xl font-black text-white">{gallery.featuredClub.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">{gallery.featuredClubNote}</p>
                </div>
              </article>
            )}
          </div>
        </section>
      )}

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The International Sports News desk</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Latest {profile.title} stories</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">News and match updates are published in the dedicated international news desk.</p>
          </div>
          <button type="button" onClick={() => onNavigate("international-sports-news")} className="shrink-0 rounded-xl bg-red-600 px-5 py-3 text-sm font-black transition hover:bg-red-700">Go to International News<span aria-hidden="true" className="ml-2">→</span></button>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Official sources</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Explore {profile.title}</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {profile.officialLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black p-5 transition hover:border-red-500/60"><span className="text-sm font-bold leading-6 text-gray-200 group-hover:text-white">{link.label}</span><span aria-hidden="true" className="shrink-0 text-lg text-red-500 transition group-hover:translate-x-1">↗</span></a>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">More international football</p>
          <h2 className="mt-3 text-2xl font-black">Explore related competitions</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.related.map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={() => onNavigate(item.section)}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-gray-300 transition hover:border-red-500 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h3 className="font-bold text-white">The Sports Digest · International Football Desk</h3>
            <p className="mt-1 text-xs text-gray-500">Responsible football journalism across the world’s leagues and competitions.</p>
          </div>
        </div>
      </section>
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
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </main>
  );
}
