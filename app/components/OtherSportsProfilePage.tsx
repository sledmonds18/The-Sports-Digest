"use client";

import SportsDeskFooter from "./SportsDeskFooter";

type SportSection = { page: string; label: string };
type OfficialSource = { label: string; href: string };
type GuideCard = { title: string; detail: string };
type SportProfile = {
  name: string;
  mark: string;
  intro: string;
  history: string;
  heroImage?: string;
  heroImages?: { ghana: string; international: string };
  guide: GuideCard[];
  focus: GuideCard[];
  sections: SportSection[];
  sources: OfficialSource[];
};

const sportProfiles: Record<string, SportProfile> = {
  basketball: {
    name: "Basketball",
    mark: "BASKETBALL",
    intro: "Follow the game from Ghana's courts to the world's leading leagues, national teams and international competitions.",
    history: "Basketball was created in 1891 by James Naismith in Springfield, Massachusetts. It grew from an indoor winter activity into a global game played by clubs, schools and national teams.",
    heroImage: "https://images.unsplash.com/photo-1759694468344-b5fffb9e6341?auto=format&fit=crop&w=2000&q=85",
    guide: [
      { title: "The court", detail: "Two teams of five try to score by shooting through the opposing basket. A field goal is worth two or three points; a free throw is worth one." },
      { title: "Club basketball", detail: "Follow domestic leagues and international club competitions, including the NBA, WNBA and EuroLeague." },
      { title: "National teams", detail: "FIBA organizes international national-team competitions, while Ghana's federation leads the local development pathway." },
    ],
    focus: [
      { title: "Tip-off", detail: "The opening jump ball begins the contest and sets the pace for the game." },
      { title: "Transition play", detail: "Fast breaks, defensive recoveries and quick decisions can change momentum in seconds." },
      { title: "Closing minutes", detail: "Late-game execution, timeouts and free throws often decide close matchups." },
    ],
    sections: [
      { page: "ghana-basketball", label: "Ghana Basketball" }, { page: "international-basketball", label: "International Basketball" },
      { page: "nba", label: "NBA" }, { page: "wnba", label: "WNBA" }, { page: "ncaa", label: "NCAA" },
      { page: "euroleague", label: "EuroLeague" }, { page: "fiba", label: "FIBA" },
    ],
    sources: [
      { label: "Ghana Basketball Federation — FIBA directory", href: "https://about.fiba.basketball/en/national-federations/65-ghana" },
      { label: "FIBA competitions and basketball", href: "https://www.fiba.basketball/en" },
      { label: "NBA", href: "https://www.nba.com/" },
      { label: "WNBA", href: "https://www.wnba.com/" },
      { label: "EuroLeague Basketball", href: "https://www.euroleaguebasketball.net/euroleague/" },
    ],
  },
  tennis: {
    name: "Tennis",
    mark: "TENNIS",
    intro: "Explore tennis in Ghana and around the world, from grassroots courts and junior events to the professional tours and Grand Slams.",
    history: "Tennis in Ghana is organized through the Ghana Tennis Federation, with local clubs and junior pathways introducing players to the sport. Internationally, tennis is played across national-team competitions, professional tours and four Grand Slam tournaments.",
    heroImages: {
      ghana: "https://gtftennis.com/wp-content/uploads/2020/07/gtf2-1.jpg",
      international: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=2000&q=85",
    },
    guide: [
      { title: "Singles and doubles", detail: "Players compete one-on-one in singles or as pairs in doubles. Matches are decided through games and sets." },
      { title: "The tours", detail: "The ATP and WTA run the leading men's and women's professional tours. The ITF supports the wider pathway, including juniors and development events." },
      { title: "The four majors", detail: "The Australian Open, Roland-Garros, Wimbledon and US Open are the sport's four Grand Slam tournaments." },
    ],
    focus: [
      { title: "Court surfaces", detail: "Hard, clay and grass courts affect ball speed, bounce and movement." },
      { title: "Serve and return", detail: "The serve starts each point; the returner's position and timing can shape the rally that follows." },
      { title: "Team competition", detail: "Davis Cup and Billie Jean King Cup bring players together to represent their countries." },
    ],
    sections: [
      { page: "ghana-tennis", label: "Ghana Tennis" }, { page: "international-tennis", label: "International Tennis" },
      { page: "atp", label: "ATP Tour" }, { page: "wta", label: "WTA Tour" }, { page: "grand-slams", label: "Grand Slams" },
    ],
    sources: [
      { label: "Ghana Tennis Federation", href: "https://gtftennis.com/" },
      { label: "International Tennis Federation", href: "https://www.itftennis.com/" },
      { label: "ATP Tour", href: "https://www.atptour.com/" },
      { label: "WTA Tour", href: "https://www.wtatennis.com/" },
      { label: "Wimbledon", href: "https://www.wimbledon.com/" },
    ],
  },
  boxing: {
    name: "Boxing",
    mark: "BOXING",
    intro: "Follow Ghana's proud boxing tradition, amateur pathways and professional bouts around the world, with results and rules kept in their proper context.",
    history: "Boxing has ancient roots and developed into a modern regulated sport through written rules, weight classes, timed rounds and officials responsible for athlete safety.",
    heroImages: {
      ghana: "https://cdn.modernghana.com/images/content/1162023100657-1h830o4aau-selvy-vs-soldier2.jpg",
      international: "https://upload.wikimedia.org/wikipedia/commons/7/75/Final_bouts_of_the_16th_world_boxing_championship.jpg",
    },
    guide: [
      { title: "Amateur boxing", detail: "Boxers compete under national and international federation rules, with pathways through national championships and multi-sport events." },
      { title: "Professional boxing", detail: "Professional bouts are sanctioned by relevant authorities and may be contested for regional or world titles." },
      { title: "Weight classes", detail: "Boxers compete within defined weight divisions. Rules, bout length and scoring depend on the competition and governing body." },
    ],
    focus: [
      { title: "The ring walk", detail: "The build-up, introductions and corner teams set the scene before the opening bell." },
      { title: "Scoring and tactics", detail: "Judges score rounds using the rules of the sanctioning body; defence, clean punches and ring control all matter." },
      { title: "The final bell", detail: "A bout may end by decision, knockout, technical knockout or disqualification, according to the rules." },
    ],
    sections: [
      { page: "ghana-boxing", label: "Ghana Boxing" }, { page: "international-boxing", label: "International Boxing" },
      { page: "boxing-news", label: "Boxing News" }, { page: "upcoming-fights", label: "Upcoming Fights" }, { page: "fight-results", label: "Fight Results" },
    ],
    sources: [
      { label: "Ghana Boxing Federation", href: "https://ghanaboxingfederation.com/" },
      { label: "World Boxing", href: "https://worldboxing.org/" },
      { label: "International Boxing Association", href: "https://www.iba.sport/" },
      { label: "Ghana Boxing Authority — APBC directory", href: "https://apbcboxing.com/?page_id=165" },
    ],
  },
  athletics: {
    name: "Athletics",
    mark: "ATHLETICS",
    intro: "Track Ghanaian athletes and global competition across running, jumping, throwing, road racing and combined events.",
    history: "Athletics brings together some of sport's oldest recorded contests. Today, national federations and World Athletics oversee events ranging from sprints and distance races to field disciplines.",
    guide: [
      { title: "Track events", detail: "Track competition includes sprints, hurdles, middle- and long-distance races, relays and race walking." },
      { title: "Field events", detail: "Athletes compete in jumps and throws, with distances or heights determining the result." },
      { title: "Road and cross-country", detail: "Road races and cross-country take competition beyond the stadium, testing pacing and endurance over varied terrain." },
    ],
    focus: [
      { title: "The start", detail: "Reaction time and a clean start are crucial in sprint events; distance races reward controlled positioning." },
      { title: "Relay exchanges", detail: "Teams must pass the baton inside the exchange zone while maintaining speed." },
      { title: "Field attempts", detail: "Jumpers and throwers manage a limited number of attempts to produce a legal personal-best mark." },
    ],
    sections: [
      { page: "ghana-athletics", label: "Ghana Athletics" }, { page: "international-athletics", label: "International Athletics" },
      { page: "track-field", label: "Track and Field" }, { page: "world-athletics", label: "World Athletics" }, { page: "athletics-results", label: "Athletics Results" },
    ],
    sources: [
      { label: "Ghana Athletics Association", href: "https://ghanaathletics.org/" },
      { label: "World Athletics", href: "https://worldathletics.org/" },
      { label: "National Sports Authority — recognized associations", href: "https://sportsauthority.gov.gh/association/" },
    ],
  },
  f1: {
    name: "Formula 1",
    mark: "FORMULA 1",
    intro: "Follow Formula 1 through its drivers, teams, circuits and race weekends, with the sporting rules and championship picture explained clearly.",
    history: "The FIA Formula One World Championship began in 1950. It combines driver and constructor championships across Grand Prix events held on purpose-built circuits and selected street tracks.",
    guide: [
      { title: "Race weekend", detail: "A Grand Prix weekend can include practice, qualifying and a race; selected events also use the Sprint format." },
      { title: "Two championships", detail: "Drivers score toward the Drivers' Championship while teams earn points in the Constructors' Championship." },
      { title: "Rules and safety", detail: "The FIA governs the sporting and technical regulations, while Formula 1 promotes and operates the championship." },
    ],
    focus: [
      { title: "Qualifying", detail: "Drivers compete for grid positions, with the session format set by the event regulations." },
      { title: "Pit strategy", detail: "Teams make tyre and pit-stop decisions in response to pace, conditions and safety-car periods." },
      { title: "The Grand Prix", detail: "Race results award points under the championship rules, contributing to both season standings." },
    ],
    sections: [
      { page: "f1-calendar", label: "Race Calendar" }, { page: "f1-results", label: "Race Results" }, { page: "f1-drivers", label: "Drivers" },
      { page: "f1-teams", label: "Teams" }, { page: "f1-standings", label: "Standings" }, { page: "f1-news", label: "F1 News" },
    ],
    sources: [
      { label: "Formula 1 official site", href: "https://www.formula1.com/en" },
      { label: "FIA — Formula One", href: "https://www.fia.com/fia-f1-world-championship" },
      { label: "FIA regulations and governance", href: "https://www.fia.com/regulation/category/110" },
    ],
  },
  volleyball: {
    name: "Volleyball",
    mark: "VOLLEYBALL",
    intro: "Explore indoor and beach volleyball in Ghana and internationally, from team tactics and competitions to the rules behind each rally.",
    history: "William G. Morgan created volleyball in 1895 in Massachusetts. The indoor game and beach variant have since grown into international disciplines with distinct team sizes and competition formats.",
    guide: [
      { title: "Indoor volleyball", detail: "Six players per side rotate positions. Teams build attacks with up to three contacts before sending the ball over the net." },
      { title: "Beach volleyball", detail: "Beach teams have two players, so each athlete covers more of the court and contributes across every phase." },
      { title: "Scoring", detail: "Matches are generally best of five sets. Sets use rally scoring and must be won by two points, subject to competition rules." },
    ],
    focus: [
      { title: "Serve and receive", detail: "A strong serve can disrupt the opposing team's first contact and limit its attacking options." },
      { title: "The net battle", detail: "Setters, attackers and blockers read the play to create or close attacking lanes." },
      { title: "Defensive coverage", detail: "Digging and court coverage keep rallies alive and give teams another chance to attack." },
    ],
    sections: [
      { page: "ghana-volleyball", label: "Ghana Volleyball" }, { page: "international-volleyball", label: "International Volleyball" },
      { page: "volleyball-news", label: "Volleyball News" }, { page: "volleyball-results", label: "Volleyball Results" },
    ],
    sources: [
      { label: "FIVB — international governing body", href: "https://www.fivb.com/" },
      { label: "Volleyball World competitions and coverage", href: "https://en.volleyballworld.com/" },
      { label: "Ghana Volleyball Association listing", href: "https://sportsauthority.gov.gh/association/" },
    ],
  },
  cricket: {
    name: "Cricket",
    mark: "CRICKET",
    intro: "Follow cricket in Ghana and around the world, from national development and regional competition to the sport's international formats.",
    history: "Cricket developed over several centuries into a global sport with international teams, professional leagues and formats that range from multi-day Tests to fast-paced T20 matches.",
    guide: [
      { title: "Three international formats", detail: "Test cricket is played over up to five days; One Day Internationals use a set number of overs per side; T20 matches are shorter still." },
      { title: "Batting and bowling", detail: "One team bats to score runs while the other bowls and fields to take wickets and limit scoring." },
      { title: "Ghana cricket", detail: "The Ghana Cricket Association leads the national game and works within the ICC's Africa region." },
    ],
    focus: [
      { title: "The toss", detail: "The toss winner chooses whether to bat or field first, a decision shaped by conditions and match format." },
      { title: "Overs and innings", detail: "Overs, innings and follow-on rules differ by format and competition." },
      { title: "The result", detail: "Matches can be decided by runs, wickets or innings; some formats can end in a tie or no result." },
    ],
    sections: [
      { page: "ghana-cricket", label: "Ghana Cricket" }, { page: "international-cricket", label: "International Cricket" },
      { page: "cricket-news", label: "Cricket News" }, { page: "icc", label: "ICC" }, { page: "cricket-results", label: "Cricket Results" },
    ],
    sources: [
      { label: "Ghana Cricket Association — ICC profile", href: "https://www.icc-cricket.com/about/members/associate/ghana-cricket-association" },
      { label: "International Cricket Council", href: "https://www.icc-cricket.com/" },
      { label: "ICC members in Africa", href: "https://www.icc-cricket.com/about/members/africa" },
    ],
  },
  "american-football": {
    name: "American Football",
    mark: "AMERICAN FOOTBALL",
    intro: "Understand American football from the NFL and college game to the plays, positions and rules that shape each drive.",
    history: "American football developed in the United States from nineteenth-century college games influenced by rugby and association football. Its rules evolved into a distinct sport built around downs, field position and set plays.",
    guide: [
      { title: "The drive", detail: "The offense has four downs to advance at least ten yards. Success earns a new set of downs; failure gives the ball to the opponent." },
      { title: "Scoring", detail: "Teams can score through touchdowns, field goals, extra-point attempts and safeties under the official rules." },
      { title: "Levels of play", detail: "The NFL is the leading professional league; college football is a major part of the sport's development and competition structure." },
    ],
    focus: [
      { title: "Offense", detail: "Quarterbacks, runners and receivers work through designed plays to move the ball and score." },
      { title: "Defense", detail: "Defenders try to stop the run, pressure the passer, force turnovers or prevent a score." },
      { title: "Special teams", detail: "Kickoffs, punts and field-goal attempts can change field position and decide close games." },
    ],
    sections: [
      { page: "nfl", label: "NFL" }, { page: "super-bowl", label: "Super Bowl" }, { page: "nfl-fixtures", label: "Fixtures" },
      { page: "nfl-results", label: "Results" }, { page: "nfl-standings", label: "Standings" },
    ],
    sources: [
      { label: "National Football League", href: "https://www.nfl.com/" },
      { label: "NFL rules and official policies", href: "https://operations.nfl.com/the-rules/" },
      { label: "NCAA football", href: "https://www.ncaa.com/sports/football/fbs" },
    ],
  },
  baseball: {
    name: "Baseball",
    mark: "BASEBALL",
    intro: "Follow baseball from the Major Leagues to international tournaments, with clear guides to the game, its positions and its season-long competition.",
    history: "Baseball took shape in North America during the nineteenth century and developed into a professional and international sport with leagues, national teams and a major global tournament calendar.",
    guide: [
      { title: "The inning", detail: "A regulation game is generally nine innings. Each half-inning ends after the defense records three outs." },
      { title: "Batting and fielding", detail: "The batting side tries to reach base and score runs; the fielding side records outs and prevents runners advancing." },
      { title: "Leagues and nations", detail: "Major League Baseball is the leading North American professional league; the WBSC governs international baseball and softball." },
    ],
    focus: [
      { title: "The at-bat", detail: "Pitchers and batters compete through balls, strikes and contact, with each pitch changing the count and situation." },
      { title: "The bases", detail: "Runners advance around first, second and third base to score by reaching home plate." },
      { title: "Late innings", detail: "Bullpen choices, defensive substitutions and close scoring situations make the final innings especially tactical." },
    ],
    sections: [
      { page: "mlb", label: "MLB" }, { page: "baseball-fixtures", label: "Fixtures" }, { page: "baseball-results", label: "Results" },
      { page: "baseball-standings", label: "Standings" }, { page: "baseball-news", label: "Baseball News" },
    ],
    sources: [
      { label: "Major League Baseball", href: "https://www.mlb.com/" },
      { label: "World Baseball Softball Confederation", href: "https://www.wbsc.org/" },
      { label: "National Sports Authority — recognized associations", href: "https://sportsauthority.gov.gh/association/" },
    ],
  },
};

function getSectionTitle(section: string, profile: SportProfile) {
  return profile.sections.find((item) => item.page === section)?.label ?? profile.name;
}

function isGhanaSection(section: string) {
  return section.startsWith("ghana-");
}

export function isOtherSportSection(section: string) {
  return Object.values(sportProfiles).some((profile) => profile.sections.some((item) => item.page === section));
}

export default function OtherSportsProfilePage({ section, onNavigate }: { section: string; onNavigate: (page: string) => void }) {
  const profile = Object.values(sportProfiles).find((item) => item.sections.some((route) => route.page === section));
  if (!profile) return null;

  const pageTitle = getSectionTitle(section, profile);
  const domestic = isGhanaSection(section);
  const newsPage = domestic ? "ghana-sports" : "international-sports-news";
  const newsDesk = domestic ? "Ghana Sports News" : "International Sports News";
  const isBasketball = profile.name === "Basketball";
  const isTennis = profile.name === "Tennis";
  const isBoxing = profile.name === "Boxing";
  const isNba = section === "nba";
  const hasParentSections = isBasketball || isTennis;
  const relatedSections = hasParentSections
    ? profile.sections.filter((item) => item.page === (domestic
      ? (isBasketball ? "international-basketball" : "international-tennis")
      : (isBasketball ? "ghana-basketball" : "ghana-tennis")))
    : profile.sections.filter((item) => item.page !== section);
  const heroImage = isBasketball && domestic
    ? "https://www.happyghana.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-19-at-8.07.44-PM.jpeg"
    : profile.heroImages
      ? (domestic ? profile.heroImages.ghana : profile.heroImages.international)
      : profile.heroImage;
  const ghanaBasketballGallery = [
    { title: "Spintex Knights in Accra league action", detail: "A Ghanaian club attacks the basket during a local league game.", image: "https://www.graphic.com.gh/images/2023/mar/27/knights23.jpg" },
    { title: "Spintex Knights prepare together", detail: "A team huddle before the next possession in the Accra Basketball League.", image: "https://wmctyawziazzjvlwrimq.supabase.co/storage/v1/object/public/scribe-images/2d13e0cf-cee5-40f8-ba82-e7b44c067e14.png" },
    { title: "Braves women at the national championship", detail: "Ghanaian players compete at the national level.", image: "https://citisportsonline.com/wp-content/uploads/2022/12/Gyampoh-819x1024.jpg" },
    { title: "Ghana basketball champions", detail: "Accra Region celebrates a national championship win.", image: "https://citisportsonline.com/wp-content/uploads/2022/12/bb-2.jpg" },
  ];
  const internationalBasketballGallery = [
    { title: "The jump for the rim", detail: "A high-flying finish in front of the crowd.", image: "https://images.unsplash.com/photo-1759694468344-b5fffb9e6341?auto=format&fit=crop&w=900&q=80" },
    { title: "A packed basketball arena", detail: "The court and supporters set the stage for tip-off.", image: "https://images.unsplash.com/photo-1674327175233-51f4d1430eac?auto=format&fit=crop&w=900&q=80" },
    { title: "Teamwork before tip-off", detail: "Players gather and prepare for the contest.", image: "https://images.unsplash.com/photo-1660496756210-ef3d6130d8dd?auto=format&fit=crop&w=900&q=80" },
    { title: "The drive to the basket", detail: "Attackers and defenders contest every possession.", image: "https://images.unsplash.com/photo-1721750476593-437e0c7c337b?auto=format&fit=crop&w=900&q=80" },
  ];
  const nbaGallery = [
    { title: "Pacers and Nuggets at Gainbridge Fieldhouse", detail: "NBA regular-season action in Indianapolis.", image: "https://images.unsplash.com/photo-1578354985657-65776ee4ae90?auto=format&fit=crop&w=900&q=80", credit: "Seth Reese / Unsplash", source: "https://unsplash.com/photos/people-watching-live-nba-game-4onANxn7K8U" },
    { title: "Wizards and Celtics in a close finish", detail: "The crowd watches the closing seconds of an NBA matchup.", image: "https://images.unsplash.com/photo-1638525136601-bd46721f5287?auto=format&fit=crop&w=900&q=80", credit: "Unsplash", source: "https://unsplash.com/photos/una-cancha-de-baloncesto-llena-de-mucha-gente-D6U7CDtwVxo" },
    { title: "Timberwolves and Suns warm up", detail: "Pre-game preparations at Minneapolis' Target Center.", image: "https://upload.wikimedia.org/wikipedia/commons/f/fe/012308-TC-Twolves001.jpg", credit: "Bobak Ha'Eri / CC BY 3.0", source: "https://commons.wikimedia.org/wiki/File:012308-TC-Twolves001.jpg" },
    { title: "Knicks and Pistons in game action", detail: "A possession during the matchup at Little Caesars Arena.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/New_York_Knicks_vs._Detroit_Pistons_December_2021_20_%28in-game_action%29.jpg/1280px-New_York_Knicks_vs._Detroit_Pistons_December_2021_20_%28in-game_action%29.jpg", credit: "Michael Barera / CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:New_York_Knicks_vs._Detroit_Pistons_December_2021_20_(in-game_action).jpg" },
  ];
  const ghanaBasketballClubs = [
    { name: "Spintex Knights", league: "Accra Basketball League", crest: "https://images.squarespace-cdn.com/content/v1/6526d7c794abd35cf9029444/af387987-3589-481e-8f94-fde63478960f/HSS%2BWeb%2BLogo.png", href: "https://www.spintexknights.com/" },
    { name: "Braves Women", league: "Accra Basketball League", href: "https://www.accrableague.com/teams" },
    { name: "TUSK Foundation", league: "Accra Basketball League", crest: "https://www.tuskbasketball.com/uploads/teams/1763742455_logo.png", href: "https://www.tuskbasketball.com/" },
    { name: "Nungua Coldstore", league: "Accra Basketball League", crest: "https://images.squarespace-cdn.com/content/v1/6526d7c794abd35cf9029444/7a8809ed-a29f-4e24-89f9-e027599ab4b3/Nungua%2BColdstore%2BLogo.png", href: "https://www.accrableague.com/teams" },
  ];
  const ghanaBasketballPlayers = [
    { name: "James Amotoe", team: "Spintex Knights", note: "Ghanaian guard and a leading scorer for Spintex in FIBA's Road to BAL coverage." },
    { name: "Abdul Aziz Yakubu", team: "Spintex Knights", note: "Ghanaian player featured among Spintex's leading contributors in FIBA's Road to BAL coverage." },
    { name: "Nana Kwame Adjei", team: "Reformers Basketball Club", note: "Ghana based league player whose experience was profiled by the Ghana News Agency." },
  ];
  const internationalBasketballCompetitions = [
    { page: "nba", name: "NBA", detail: "The North American professional league, its franchises, rivalries and championship history." },
    { page: "wnba", name: "WNBA", detail: "Women's professional basketball, teams, players and the league season." },
    { page: "ncaa", name: "NCAA", detail: "College basketball in the United States, including the men's and women's tournaments." },
    { page: "euroleague", name: "EuroLeague", detail: "Top-level European club basketball and its continental competition format." },
    { page: "fiba", name: "FIBA", detail: "International basketball governance, national teams and global competitions." },
  ];
  const internationalTennisCompetitions = [
    { page: "atp", name: "ATP Tour", detail: "Men's professional tennis, its tournaments, rankings and player stories." },
    { page: "wta", name: "WTA Tour", detail: "Women's professional tennis, its tournaments, rankings and leading athletes." },
    { page: "grand-slams", name: "Grand Slams", detail: "The Australian Open, Roland-Garros, Wimbledon and US Open." },
  ];
  const ghanaTennisGallery = [
    { title: "Accra Open match court", detail: "A player competes at the Accra Open on a Ghanaian court marked for the tournament.", image: "https://www.ghanatennis.org/images/IMG_9456.jpg", credit: "Tennis Foundation Ghana", source: "https://www.ghanatennis.org/" },
    { title: "Players training at the National Tennis Centre", detail: "Young players work through court drills with coaches at a Ghana tennis clinic.", image: "https://files.stablerack.com/WebFiles/88872/WhatsAppImage2021-09-13at10.47.16AM%284%29.jpeg", credit: "Tennis Foundation Ghana", source: "https://www.ghanatennis.org/TFG?articleid=245580&blogid=News&view=post" },
    { title: "Serve and return", detail: "A point begins with the serve and the returner's response.", image: "https://gtftennis.com/wp-content/uploads/2020/07/gtf3-1.jpg" },
    { title: "The match court", detail: "Players compete across the net in singles and doubles.", image: "https://gtftennis.com/wp-content/uploads/2020/07/Tennis-1.jpg" },
  ];
  const internationalTennisGallery = [
    { title: "Tour-level rally", detail: "Jo-Wilfried Tsonga and Andy Murray exchange shots in a Rogers Cup semifinal.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Rally.jpg/1280px-Rally.jpg", credit: "Sorin Nechita / CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Rally.jpg" },
    { title: "A packed centre court", detail: "The Wimbledon crowd watches play from Centre Court.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Centre_court_crowd.JPG/1280px-Centre_court_crowd.JPG", credit: "Clavecin / Public domain", source: "https://commons.wikimedia.org/wiki/File:Centre_court_crowd.JPG" },
    { title: "Preparing for the match", detail: "Carlos Alcaraz and Felix Auger-Aliassime warm up before their US Open match.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/2021_US_Open_Armstrong_Alcaraz_v._Auger-Aliassime_semi_warm-up.jpg/1280px-2021_US_Open_Armstrong_Alcaraz_v._Auger-Aliassime_semi_warm-up.jpg", credit: "Beyond My Ken / CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:2021_US_Open_Armstrong_Alcaraz_v._Auger-Aliassime_semi-warm-up.jpg" },
    { title: "A point on the line", detail: "Rafael Nadal tracks the ball during a Wimbledon match.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/236_-_Centre_Court_-_R_Nadal.JPG/1280px-236_-_Centre_Court_-_R_Nadal.JPG", credit: "Barry Mangham / CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:236_-_Centre_Court_-_R_Nadal.JPG" },
  ];
  const ghanaTennisPlayers = [
    { name: "Lameck Bagerbaseh", label: "Men's singles", detail: "Won his first TPG National Ranking Tour men's singles title at Tour 5 in 2025.", href: "https://www.ghanatennis.org/Blog/TFG/News-/Lameck-Bagerbaseh-and-Yvonne-BruceTagoe-Crowned-Champions-at-the-2025-TPG-National-Ranking-Tour-5/?fldAuthor=&fldKeywords=&fldTopic=0&link=1" },
    { name: "Yvonne Bruce-Tagoe", label: "Women's singles", detail: "Won the women's singles title at the 2025 TPG National Ranking Tour 5.", href: "https://www.ghanatennis.org/Blog/TFG/News-/Lameck-Bagerbaseh-and-Yvonne-BruceTagoe-Crowned-Champions-at-the-2025-TPG-National-Ranking-Tour-5/?fldAuthor=&fldKeywords=&fldTopic=0&link=1" },
    { name: "Bernard Yawson", label: "Wheelchair tennis", detail: "Defended his wheelchair title at the 2025 TPG National Ranking Tour 5.", href: "https://www.ghanatennis.org/Blog/TFG/News-/Lameck-Bagerbaseh-and-Yvonne-BruceTagoe-Crowned-Champions-at-the-2025-TPG-National-Ranking-Tour-5/?fldAuthor=&fldKeywords=&fldTopic=0&link=1" },
  ];
  const internationalTennisPlayers = [
    { name: "Novak Djokovic", label: "Men's singles", detail: "A record-setting champion and one of the defining players of the modern era.", href: "https://www.atptour.com/en/players/novak-djokovic/d643/overview" },
    { name: "Roger Federer", label: "Men's singles · retired", detail: "A 20-time Grand Slam singles champion celebrated for his all-court game.", href: "https://www.atptour.com/en/players/roger-federer/f324/overview" },
    { name: "Serena Williams", label: "Women's singles · retired", detail: "Won 23 Grand Slam singles titles in the Open Era.", href: "https://www.wtatennis.com/players/230234/serena-williams" },
    { name: "Iga Swiatek", label: "Women's singles", detail: "A multiple Grand Slam champion and leading player of the current generation.", href: "https://www.wtatennis.com/players/326408/iga-swiatek" },
    { name: "Carlos Alcaraz", label: "Men's singles", detail: "A multiple Grand Slam champion who has quickly become a leading figure on the ATP Tour.", href: "https://www.atptour.com/en/players/carlos-alcaraz/a0e2/overview" },
  ];
  const tennisOrganizations = domestic
    ? [{ name: "Ghana Tennis Federation", image: "https://gtftennis.com/wp-content/uploads/2020/07/gtf_logo-1.jpg", href: "https://gtftennis.com/" }]
    : [
      { name: "ATP Tour", image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/ATP_Tour_logo.svg", href: "https://www.atptour.com/" },
      { name: "WTA Tour", image: "https://photoresources.wtatennis.com/wta/photo/2026/01/12/6e880cf1-29f5-48aa-8371-92cb2f75ef9f/WTA_Logo_Core_Purple_RGB-2-.png", href: "https://www.wtatennis.com/" },
    ];
  const ghanaBoxingGallery = [
    { title: "Accra Box Cup youth final", detail: "A young boxer celebrates as the referee raises his hand at the 2026 Accra Box Cup.", image: "https://www.graphic.com.gh/images/2026/May/02/BOXING.jpg", credit: "Graphic Online", source: "https://www.graphic.com.gh/sports/sports-news/accra-box-cup-2026-uncovers-next-generation-of-ghana-boxing-talent.html" },
    { title: "Ghana Professional Boxing League", detail: "Boxers square up during a fight night at Bukom Boxing Arena.", image: "https://cdn.modernghana.com/images/content/1162023100657-1h830o4aau-selvy-vs-soldier2.jpg", credit: "Modern Ghana", source: "https://www.modernghana.com/sports/1271069/discipline-and-sanity-return-to-bukom-boxing-arena.html" },
    { title: "Women in Ghanaian boxing", detail: "Two Ghanaian boxers compete at Bukom Boxing Arena in Accra.", image: "https://pulitzercenter.org/sites/default/files/styles/orig_optimized/public/inline-images/Women%20Who%20Fight%20For%20Ghanaian%201.jpg.webp?itok=mJZafP3O", credit: "Pulitzer Center", source: "https://pulitzercenter.org/stories/women-who-fight-ghanaian-female-boxers-path-acceptance-paved-side-hustles-and-social-stigma" },
    { title: "Isaac Dogboe in the ring", detail: "Ghanaian boxer Isaac Dogboe throws a punch during a professional bout.", image: "https://cdn.ghanaguardian.com/2021/06/dogboe22332233.jpg", credit: "Ghana Guardian", source: "https://ghanaguardian.com/dr-manly-spain-congratulates-isaac-dogboe" },
  ];
  const internationalBoxingGallery = [
    { title: "World championship action", detail: "Two competitors meet in the final bouts of the 2011 World Boxing Championships.", image: "https://upload.wikimedia.org/wikipedia/commons/7/75/Final_bouts_of_the_16th_world_boxing_championship.jpg", credit: "President.az / CC BY 4.0", source: "https://commons.wikimedia.org/wiki/File:Final_bouts_of_the_16th_world_boxing_championship.jpg" },
    { title: "Boxing under the lights", detail: "Fighters trade punches in a professional ring as the crowd watches from ringside.", image: "https://a1.espncdn.com/combiner/i?img=%2Fphoto%2F2015%2F0107%2Fbox_g_boxingring_jv_1296x729.jpg", credit: "ESPN", source: "https://www.espn.co.uk/boxing/story/_/id/15098095/conor-benn-make-pro-boxing-debut-april-9" },
    { title: "Between rounds", detail: "A boxer rests on his stool while his corner team works during the break.", image: "https://i0.wp.com/spettacolomusicasport.com/wp-content/uploads/2024/11/Foto-Francis-Rizzo-allangolo-di-Francesco-Paparo-.jpg?fit=1200%2C800&ssl=1", credit: "Francis Rizzo / SMS News Quotidiano", source: "https://spettacolomusicasport.com/2024/11/13/boxe-sabato-16-novembre-a-milano-francesco-paparo-affrontera-mohamed-diallo-per-il-vacante-titolo-italiano-dei-pesi-superpiuma/" },
    { title: "Live boxing match", detail: "Boxers compete in a live bout before an audience.", image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Boxing_Match.jpg", credit: "BECMarketing / CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Boxing_Match.jpg" },
  ];
  const ghanaBoxingPlayers = [
    { name: "Azumah Nelson", label: "Ghanaian legend", detail: "Three-time world champion and International Boxing Hall of Fame inductee.", href: "https://www.gsf.gov.gh/governance/board/mr-samuel-azumah-nelson" },
    { name: "Ike Quartey", label: "World champion", detail: "Ghanaian former WBA welterweight champion known as 'Bazooka'.", href: "https://www.ghanaolympic.org/?item=15466" },
    { name: "Richard Commey", label: "World champion", detail: "Ghanaian boxer who won the IBF lightweight world title in 2019.", href: "https://www.ghanaolympic.org/?item=15466" },
    { name: "Isaac Dogboe", label: "World champion", detail: "Ghanaian former WBO super bantamweight world champion.", href: "https://www.ghanaolympic.org/?item=15466" },
    { name: "Abigail Quartey", label: "Women's world champion", detail: "Made history as Ghana's first female world boxing champion in 2024.", href: "https://www.gbcghanaonline.com/sports/abigail-quartey-boxing/2024/5/" },
  ];
  const internationalBoxingPlayers = [
    { name: "Muhammad Ali", label: "Heavyweight great", detail: "Three-time world heavyweight champion and one of boxing's most recognized figures.", href: "https://www.wwe.com/superstars/muhammad-ali" },
    { name: "Oleksandr Usyk", label: "Heavyweight champion", detail: "A leading heavyweight champion and former undisputed cruiserweight champion.", href: "https://wbcboxing.com/en/ratings-en/" },
    { name: "Naoya Inoue", label: "Bantamweight to super bantamweight", detail: "An elite Japanese champion and current WBO super bantamweight titleholder.", href: "https://wboboxing.com/male-champions/" },
    { name: "Claressa Shields", label: "Women's boxing champion", detail: "A multi-division champion featured among the WBC's women's world champions.", href: "https://wbcboxing.com/en/ratings-en/" },
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative isolate overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950">
        {heroImage && <img src={heroImage} alt={isTennis ? `${domestic ? "Ghanaian" : "International"} tennis players on court` : isBoxing ? `${domestic ? "Ghanaian" : "International"} boxers competing in the ring` : domestic ? "Ghana's Spintex Knights basketball team celebrating qualification" : "Basketball players competing at the rim"} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_25%,rgba(220,38,38,0.25),transparent_38%)]" />
        <div className="mx-auto grid min-h-[420px] max-w-7xl gap-10 px-4 py-16 sm:px-6 md:min-h-[500px] md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · {domestic ? "Ghana" : "International"} {profile.name}</p>
            <p className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-300"><span className="h-px w-10 bg-red-500" />{domestic ? "Inside Ghana" : "Around the world"}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">{pageTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">{profile.intro}</p>
          </div>
          <div className="flex min-h-48 items-end justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm sm:min-h-56 sm:p-10">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">Sport profile</p><p className="mt-3 max-w-xs text-sm leading-6 text-gray-200">History, competition formats and reliable governing-body sources.</p></div>
            <span aria-hidden="true" className="ml-4 select-none text-right text-4xl font-black italic leading-none text-red-500 sm:text-6xl">{profile.mark}</span>
          </div>
        </div>
      </section>

      {isBasketball ? (
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          {domestic ? <>
            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/50 to-zinc-950 p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Inside Ghana</p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">A Ghanaian voice in African basketball</h2>
              <p className="mt-4 text-sm leading-7 text-gray-300">Basketball grew across Africa as national federations organized the game and built continental competition. FIBA's history records Ghanaian Tomy Thompson among the founding contributors to the African basketball organization established in 1961. Today, the Ghana Basketball Federation is listed in FIBA's directory.</p>
              <a href="https://about.fiba.basketball/en/regions/africa/history" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Read FIBA Africa's history <span aria-hidden="true" className="ml-2">↗</span></a>
            </article>
            <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">International game</p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">From a winter game to a global sport</h2>
              <p className="mt-4 text-sm leading-7 text-gray-300">James Naismith created basketball in 1891 in Springfield, Massachusetts. FIBA now governs the international game, with national teams competing alongside professional leagues such as the NBA, WNBA and EuroLeague.</p>
              <a href="https://www.fiba.basketball/en" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Explore FIBA <span aria-hidden="true" className="ml-2">↗</span></a>
            </article>
          </> : isNba ? <>
            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/50 to-zinc-950 p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">NBA history</p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">From the BAA to the modern NBA</h2>
              <p className="mt-4 text-sm leading-7 text-gray-300">The league began in New York in 1946 as the Basketball Association of America, with 11 teams. In 1949, it merged with the National Basketball League and took the name National Basketball Association. Rule changes, including the 24-second shot clock introduced in 1954, helped shape the fast-paced league that followed.</p>
              <a href="https://www.nba.com/news/about" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Read the NBA's history <span aria-hidden="true" className="ml-2">↗</span></a>
            </article>
            <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The league today</p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">Teams, rivalries and a global audience</h2>
              <p className="mt-4 text-sm leading-7 text-gray-300">The NBA has grown from its original 11 teams into a 30-team league, with conferences, regular-season play, playoffs and the NBA Finals. Generations of players and historic rivalries have made the league a central part of professional basketball worldwide.</p>
              <a href="https://www.nba.com/" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Visit NBA.com <span aria-hidden="true" className="ml-2">↗</span></a>
            </article>
          </> : <>
            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/50 to-zinc-950 p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">International history</p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">From a Springfield gym to the world stage</h2>
              <p className="mt-4 text-sm leading-7 text-gray-300">James Naismith introduced basketball in 1891. As the game spread between countries, eight national federations founded FIBA in Geneva in 1932. Basketball made its Olympic debut at Berlin 1936, and the first FIBA Basketball World Cup followed in 1950.</p>
              <a href="https://about.fiba.basketball/en/organization/what-we-do" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">Explore FIBA's history <span aria-hidden="true" className="ml-2">↗</span></a>
            </article>
            <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Global competitions</p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">National teams, clubs and new formats</h2>
              <p className="mt-4 text-sm leading-7 text-gray-300">International basketball now spans men's and women's World Cups, Olympic tournaments and club competitions across multiple continents. FIBA's 3x3 format joined the Olympic programme at Tokyo 2020, adding a faster half-court version to the global stage.</p>
              <a href="https://about.fiba.basketball/en/our-sport/basketball" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">About international basketball <span aria-hidden="true" className="ml-2">↗</span></a>
            </article>
          </>}
        </section>
      ) : isTennis ? (
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/50 to-zinc-950 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">{domestic ? "Inside Ghana" : "International history"}</p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">{domestic ? "Growing tennis in Ghana" : "A global game across four surfaces and four majors"}</h2>
            <p className="mt-4 text-sm leading-7 text-gray-300">{domestic ? "The Ghana Tennis Federation coordinates the national game. Local clubs, schools and junior competitions provide places for players to learn, train and compete, while Ghanaian players can progress through ITF events and international team competition." : "Modern lawn tennis developed in Britain in the nineteenth century and spread worldwide. Today the sport brings together national-team events, the ATP and WTA professional tours, and four Grand Slam tournaments: the Australian Open, Roland-Garros, Wimbledon and the US Open."}</p>
            <a href={domestic ? "https://gtftennis.com/" : "https://www.itftennis.com/en/about-us/organisation/history/"} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">{domestic ? "Visit Ghana Tennis Federation" : "Explore tennis history"} <span aria-hidden="true" className="ml-2">↗</span></a>
          </article>
          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">{domestic ? "The pathway" : "Competition structure"}</p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">{domestic ? "From first serve to international play" : "Tours, team events and Grand Slams"}</h2>
            <p className="mt-4 text-sm leading-7 text-gray-300">{domestic ? "Players develop through coaching, club competition and national events. The international pathway includes ITF junior and professional tournaments, giving athletes opportunities to gain experience and ranking points." : "The ATP and WTA organize leading professional tours. The ITF oversees national-team competitions such as Davis Cup and Billie Jean King Cup, as well as the Grand Slam tournaments in partnership with their organizers."}</p>
            <a href={domestic ? "https://www.itftennis.com/en/" : "https://www.atptour.com/"} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-red-400 hover:text-red-300">{domestic ? "Explore ITF tennis" : "Visit the ATP Tour"} <span aria-hidden="true" className="ml-2">↗</span></a>
          </article>
        </section>
      ) : (
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The story of {profile.name}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Built on skill, competition and community</h2>
          <p className="mt-5 text-sm leading-7 text-gray-300">{profile.history}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.guide.map((item, index) => (
            <article key={item.title} className={`rounded-2xl border border-white/10 p-6 ${index === 0 ? "bg-gradient-to-br from-red-950/70 to-zinc-950" : "bg-zinc-950"}`}>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-lg font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
      )}

      {isBasketball && section === "international-basketball" && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">International basketball</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Explore the major competitions</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">Choose a league or governing body to explore its history, teams and defining moments.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {internationalBasketballCompetitions.map((competition, index) => <button key={competition.page} type="button" onClick={() => onNavigate(competition.page)} className="group rounded-2xl border border-white/10 bg-black p-6 text-left transition hover:border-red-500/60">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{String(index + 1).padStart(2, "0")}</span>
              <span className="mt-4 block text-xl font-black text-white">{competition.name}</span>
              <span className="mt-2 block text-sm leading-6 text-gray-400">{competition.detail}</span>
              <span className="mt-5 inline-flex text-sm font-bold text-red-400 transition group-hover:translate-x-1">Explore {competition.name} <span aria-hidden="true" className="ml-2">→</span></span>
            </button>)}
          </div>
        </div>
      </section>}

      {isTennis && section === "international-tennis" && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">International tennis</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Explore the tours and majors</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">Choose a competition area to explore its history, calendar and defining stories.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {internationalTennisCompetitions.map((competition, index) => <button key={competition.page} type="button" onClick={() => onNavigate(competition.page)} className="group rounded-2xl border border-white/10 bg-black p-6 text-left transition hover:border-red-500/60">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{String(index + 1).padStart(2, "0")}</span>
              <span className="mt-4 block text-xl font-black text-white">{competition.name}</span>
              <span className="mt-2 block text-sm leading-6 text-gray-400">{competition.detail}</span>
              <span className="mt-5 inline-flex text-sm font-bold text-red-400 transition group-hover:translate-x-1">Explore {competition.name} <span aria-hidden="true" className="ml-2">→</span></span>
            </button>)}
          </div>
        </div>
      </section>}

      {isTennis && (section === "ghana-tennis" || section === "international-tennis") && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Tennis in action</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(domestic ? ghanaTennisGallery : internationalTennisGallery).map((moment) => <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-5"><h3 className="font-black">{moment.title}</h3><p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>{"source" in moment && <a href={moment.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-gray-500 underline hover:text-white">Photo: {moment.credit}</a>}</div>
            </article>)}
          </div>
          <p className="mt-4 text-xs text-gray-500">{domestic ? <>Ghana gallery images: <a href="https://gtftennis.com/gallery/" target="_blank" rel="noreferrer" className="underline hover:text-white">Ghana Tennis Federation</a>.</> : "Gallery imagery illustrates tennis courts and match play; competition details are linked to official tennis organizations."}</p>
        </div>
      </section>}

      {isTennis && (section === "ghana-tennis" || section === "international-tennis") && <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Players and organizations</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{domestic ? "Ghanaian players to know" : "Champions and tours to follow"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">{domestic ? "Recent national ranking tour champions and a leading wheelchair tennis player, with results linked to Tennis Foundation Ghana." : "A selection of celebrated champions across men's and women's tennis. Player records and current tour coverage are linked to the official tours."}</p>

          <h3 className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-gray-400">{domestic ? "Federation crest" : "Tour marks"}</h3>
          <div className="mt-4 grid max-w-2xl grid-cols-2 gap-3">
            {tennisOrganizations.map((organization) => <a key={organization.name} href={organization.href} target="_blank" rel="noreferrer" className="flex min-h-32 items-center justify-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-red-500/60">
              <img src={organization.image} alt={`${organization.name} logo`} loading="lazy" className="h-16 max-w-36 object-contain" />
              <span className="text-sm font-bold text-gray-200">{organization.name}</span>
            </a>)}
          </div>

          <h3 className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Featured players</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(domestic ? ghanaTennisPlayers : internationalTennisPlayers).map((player) => <article key={player.name} className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">{player.label}</p>
              <h4 className="mt-2 text-lg font-black">{player.name}</h4>
              <p className="mt-2 text-sm leading-6 text-gray-400">{player.detail}</p>
              <a href={player.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-red-400 underline hover:text-red-300">Player profile or result <span aria-hidden="true" className="ml-1">↗</span></a>
            </article>)}
          </div>
        </div>
      </section>}

      {isBoxing && (section === "ghana-boxing" || section === "international-boxing") && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{domestic ? "Boxing in Ghana" : "Fight night around the world"}</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(domestic ? ghanaBoxingGallery : internationalBoxingGallery).map((moment) => <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-5"><h3 className="font-black">{moment.title}</h3><p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p><a href={moment.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-gray-500 underline hover:text-white">Photo: {moment.credit}</a></div>
            </article>)}
          </div>
        </div>
      </section>}

      {isBoxing && (section === "ghana-boxing" || section === "international-boxing") && <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Featured boxers</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{domestic ? "Ghanaian champions and legends" : "Champions of the world game"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">{domestic ? "A selection of Ghanaian world champions across generations, with profiles and championship history linked to trusted sources." : "A selection of celebrated champions across men's and women's boxing. Current title information can change; links lead to the relevant boxing organizations."}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(domestic ? ghanaBoxingPlayers : internationalBoxingPlayers).map((player) => <article key={player.name} className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">{player.label}</p>
              <h3 className="mt-2 text-lg font-black">{player.name}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{player.detail}</p>
              <a href={player.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-red-400 underline hover:text-red-300">Read profile <span aria-hidden="true" className="ml-1">↗</span></a>
            </article>)}
          </div>
        </div>
      </section>}

      {isBasketball && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Inside the game</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(domestic ? ghanaBasketballGallery : isNba ? nbaGallery : internationalBasketballGallery).map((moment) => <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-5"><h3 className="font-black">{moment.title}</h3><p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>{"source" in moment && typeof moment.source === "string" && "credit" in moment && typeof moment.credit === "string" && <a href={moment.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-gray-500 underline hover:text-white">Photo: {moment.credit}</a>}</div>
            </article>)}
          </div>
          <p className="mt-4 text-xs text-gray-500">{domestic ? "Ghana gallery sources: Accra Basketball League, FIBA, Citi Sports and Graphic Online." : isNba ? "NBA game images are credited to their photographers and linked to the source and license." : "Photography: Unsplash contributors. Images are illustrative basketball moments."}</p>
        </div>
      </section>}

      {isBasketball && <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Clubs and players</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{domestic ? "Ghana clubs and players" : "Teams to follow"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">{domestic ? "Meet clubs from the Accra Basketball League and Ghanaian players featured in local and continental coverage." : "A selection of established NBA clubs. Team badges link to official team pages; rosters change from season to season."}</p>
          {domestic ? <>
            <h3 className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Ghana club crests</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ghanaBasketballClubs.map((team) => <a key={team.name} href={team.href} target="_blank" rel="noreferrer" className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-950 p-4 text-center transition hover:border-red-500/60">
                {team.crest ? <img src={team.crest} alt={`${team.name} club crest`} loading="lazy" className="h-20 w-20 rounded-full bg-white p-2 object-contain" /> : <span aria-label={`${team.name} crest unavailable`} className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-white/20 bg-zinc-900 px-2 text-center text-[10px] font-bold uppercase text-gray-500">No crest</span>}
                <span className="mt-3 text-sm font-bold text-gray-200">{team.name}</span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-red-400">{team.league}</span>
              </a>)}
            </div>
            <h3 className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Ghanaian players to know</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {ghanaBasketballPlayers.map((player) => <article key={player.name} className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">{player.team}</p>
                <h4 className="mt-2 text-lg font-black">{player.name}</h4>
                <p className="mt-2 text-sm leading-6 text-gray-400">{player.note}</p>
              </article>)}
            </div>
            <p className="mt-4 text-xs text-gray-500">Club names and player references: <a className="underline hover:text-white" href="https://www.accrableague.com/teams" target="_blank" rel="noreferrer">Accra Basketball League</a>, <a className="underline hover:text-white" href="https://www.fiba.basketball/en/events/fiba-africa-champions-clubs-road-to-bal-2026/news/team-profile-ghanas-spintex-will-look-to-improve-from-last-years-road-to-bal" target="_blank" rel="noreferrer">FIBA</a> and <a className="underline hover:text-white" href="https://gna.org.gh/2026/05/accra-basketball-league-records-growth-amid-structural-challenges/" target="_blank" rel="noreferrer">Ghana News Agency</a>.</p>
          </> : <>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Boston Celtics", id: "1610612738", href: "https://www.nba.com/celtics" },
              { name: "Golden State Warriors", id: "1610612744", href: "https://www.nba.com/warriors" },
              { name: "Los Angeles Lakers", id: "1610612747", href: "https://www.nba.com/lakers" },
              { name: "Chicago Bulls", id: "1610612741", href: "https://www.nba.com/bulls" },
              { name: "New York Knicks", id: "1610612752", href: "https://www.nba.com/knicks" },
              { name: "Milwaukee Bucks", id: "1610612749", href: "https://www.nba.com/bucks" },
            ].map((team) => <a key={team.id} href={team.href} target="_blank" rel="noreferrer" className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-950 p-4 text-center transition hover:border-red-500/60">
              <img src={`https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg`} alt={`${team.name} crest`} loading="lazy" className="h-20 w-20 object-contain" />
              <span className="mt-3 text-sm font-bold text-gray-200">{team.name}</span>
            </a>)}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { name: "Stephen Curry", description: "A defining perimeter shooter and playmaker.", image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png" },
              { name: "LeBron James", description: "A long-running star known for all-around play.", image: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png" },
              { name: "A’ja Wilson", description: "A leading figure in the WNBA and women’s game.", image: "https://cdn.wnba.com/headshots/wnba/latest/1040x760/1642286.png" },
            ].map((player) => <article key={player.name} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4">
              <img src={player.image} alt={player.name} loading="lazy" className="h-24 w-24 rounded-xl bg-white/5 object-cover object-top" />
              <div><h3 className="font-black">{player.name}</h3><p className="mt-1 text-sm leading-5 text-gray-400">{player.description}</p></div>
            </article>)}
          </div>
          <p className="mt-4 text-xs text-gray-500">Player headshots and team marks are served by the leagues. Player-team affiliations can change; check the official roster pages for current details.</p>
          </>}
        </div>
      </section>}

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Inside the competition</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Moments that shape {profile.name}</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {profile.focus.map((item, index) => (
              <article key={item.title} className="relative min-h-56 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6">
                <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-6 select-none text-8xl font-black italic text-white/[0.04]">0{index + 1}</span>
                <div className="relative flex h-full flex-col justify-end">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{profile.name}</p>
                  <h3 className="mt-3 text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The {newsDesk} desk</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Latest {pageTitle} stories</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">News and match updates are published in the dedicated {domestic ? "Ghana" : "international"} news desk.</p>
          </div>
          <button type="button" onClick={() => onNavigate(newsPage)} className="shrink-0 rounded-xl bg-red-600 px-5 py-3 text-sm font-black transition hover:bg-red-700">Go to {newsDesk}<span aria-hidden="true" className="ml-2">→</span></button>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Official sources</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Explore {pageTitle}</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {profile.sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black p-5 transition hover:border-red-500/60">
                <span className="text-sm font-bold leading-6 text-gray-200 group-hover:text-white">{source.label}</span>
                <span aria-hidden="true" className="shrink-0 text-lg text-red-500 transition group-hover:translate-x-1">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">More {profile.name}</p>
          <h2 className="mt-3 text-2xl font-black">Explore related sections</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {relatedSections.map((item) => (
              <button key={item.page} type="button" onClick={() => onNavigate(item.page)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-gray-300 transition hover:border-red-500 hover:text-white">{item.label}</button>
            ))}
          </div>
        </div>
      </section>

      <SportsDeskFooter desk={`${profile.name} Desk`} description={`Coverage of ${profile.name.toLowerCase()} in Ghana and around the world.`} onNavigate={onNavigate} />
    </main>
  );
}
