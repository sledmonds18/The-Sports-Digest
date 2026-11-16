"use client";

import SportsDeskFooter from "./SportsDeskFooter";
import CricketNews from "./CricketNews";
import CricketICC from "./CricketICC";
import InternationalSportsNews from "./InternationalSportsNews";
import VolleyballNews from "./VolleyballNews";
import BaseballMLB from "./BaseballMLB";

type SportSection = { page: string; label: string };
type OfficialSource = { label: string; href: string };
type GuideCard = { title: string; detail: string };
type PhotoAttribution = { credit: string; source: string; license: string; licenseHref: string };
type PhotoCredit = Pick<PhotoAttribution, "credit" | "source">;
type FocusCard = GuideCard & { image?: string; imageAlt?: string; imageCredit?: PhotoCredit };
type PhotoGalleryItem = PhotoAttribution & { title: string; detail: string; image: string };
type AthleticsPhoto = PhotoGalleryItem;
type AthleticsAthlete = PhotoAttribution & {
  name: string;
  discipline: string;
  detail: string;
  href: string;
  image: string;
};
type F1Driver = { name: string; team: string; nationality: string; href: string; image: string };
type F1Team = { name: string; drivers: string[]; href: string; image: string };
type SportProfile = {
  name: string;
  mark: string;
  intro: string;
  history: string;
  heroImage?: string;
  heroPhotoCredit?: PhotoCredit;
  heroAttribution?: PhotoAttribution;
  heroImages?: { ghana: string; international?: string };
  internationalHeroPhotoCredit?: PhotoCredit;
  heroAttributions?: { ghana: PhotoAttribution; international: PhotoAttribution };
  regionalSources?: { ghana: OfficialSource[]; international: OfficialSource[] };
  guide: GuideCard[];
  focus: FocusCard[];
  regionalFocus?: { ghana?: FocusCard[]; international?: FocusCard[] };
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
    regionalFocus: {
      ghana: [
        {
          title: "Tip-off",
          detail: "Ghana's 2012 Sprite Ball champions pictured together reflect the team spirit behind every opening tip and first possession.",
          image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Girl%27s_Basketball_Team%2C_Ghana%2C_2012.jpg",
          imageAlt: "Ghana's 2012 Sprite Ball champion girls' basketball team",
          imageCredit: { credit: "Scrollend2003 · CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Girl%27s_Basketball_Team,_Ghana,_2012.jpg" },
        },
        {
          title: "Transition play",
          detail: "Ghana players defend against Madagascar at the 2023 African Games in Accra, where a quick stop can turn into a fast break.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/AG_23_3x3_Basketball_100.jpg/1280px-AG_23_3x3_Basketball_100.jpg",
          imageAlt: "Ghana players set their defense against Madagascar during 3x3 basketball at the 2023 African Games",
          imageCredit: { credit: "Owula kpakpo · CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:AG_23_3x3_Basketball_100.jpg" },
        },
        {
          title: "Closing minutes",
          detail: "A Ghana player takes a free throw during 3x3 action at the 2023 African Games in Accra; composed finishes at the line can decide a close game.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/AG_23_3x3_Basketball_92.jpg/1280px-AG_23_3x3_Basketball_92.jpg",
          imageAlt: "A Ghana player shoots a free throw during 3x3 basketball at the 2023 African Games",
          imageCredit: { credit: "Owula kpakpo · CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:AG_23_3x3_Basketball_92.jpg" },
        },
      ],
      international: [
        {
          title: "Tip-off",
          detail: "The opening jump ball between Bulgaria and Turkey at EuroBasket 2009 shows how a contest begins with both teams fighting for possession.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Bulgaria-Turkey_Eurobasket_2009_Jump_ball_Kapoutsis.jpg/1280px-Bulgaria-Turkey_Eurobasket_2009_Jump_ball_Kapoutsis.jpg",
          imageAlt: "Bulgaria and Turkey players contest the opening jump ball at EuroBasket 2009",
          imageCredit: { credit: "Klearchos Kapoutsis · CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Bulgaria-Turkey_Eurobasket_2009_Jump_ball_Kapoutsis.jpg" },
        },
        {
          title: "Transition play",
          detail: "A fast break in wheelchair basketball shows how quickly a team can turn a recovery into an attack.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/U.S._Marine_Corps_Cpl._Anthony_McDaniel_chases_down_the_ball_on_a_fast_break%2C_followed_by_Joseph_Negron%2C_during_the_championship_wheelchair_basketball_game_for_the_2012_Marine_Corps_Trials_at_Marine_Corps_Base_120221-M-II268-111.jpg/1280px-thumbnail.jpg",
          imageAlt: "Anthony McDaniel and Joseph Negron chase the ball during a wheelchair basketball fast break",
          imageCredit: { credit: "LCpl Chelsea Flowers · Public domain", source: "https://commons.wikimedia.org/wiki/File:U.S._Marine_Corps_Cpl._Anthony_McDaniel_chases_down_the_ball_on_a_fast_break,_followed_by_Joseph_Negron,_during_the_championship_wheelchair_basketball_game_for_the_2012_Marine_Corps_Trials_at_Marine_Corps_Base_120221-M-II268-111.jpg" },
        },
        {
          title: "Closing minutes",
          detail: "Derek Fisher's game-winning shot against the Clippers in 2010 is a reminder that one decisive play can settle a close finish.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Derek_Fisher_buzzer_beater_vs._Clippers_in_2010.jpg/1280px-Derek_Fisher_buzzer_beater_vs._Clippers_in_2010.jpg",
          imageAlt: "Derek Fisher attempts the game-winning shot against the Clippers as the clock expires",
          imageCredit: { credit: "Michael Saechang · CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Derek_Fisher_buzzer_beater_vs._Clippers_in_2010.jpg" },
        },
      ],
    },
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
    regionalFocus: {
      ghana: [
        {
          title: "Court surfaces",
          detail: "Players train at the National Tennis Centre in Accra, where court surface affects footing, ball bounce and shot selection.",
          image: "https://files.stablerack.com/WebFiles/88872/WhatsAppImage2021-09-13at1.30.34PM.jpeg",
          imageAlt: "Players, coaches and spectators gather beside the outdoor courts at Ghana's National Tennis Centre",
          imageCredit: { credit: "Tennis Foundation Ghana", source: "https://www.ghanatennis.org/TFG?articleid=245580&blogid=News&view=post" },
        },
        {
          title: "Serve and return",
          detail: "The serve starts the point, and a well-timed return gives Ghanaian players a chance to take control of the rally.",
          image: "https://gtftennis.com/wp-content/uploads/2020/07/young-tennis.jpg",
          imageAlt: "A Ghanaian tennis player reaches for a shot during a match",
          imageCredit: { credit: "Ghana Tennis Federation", source: "https://gtftennis.com/" },
        },
        {
          title: "Team competition",
          detail: "Doubles puts teamwork at the centre of competition. Success Ogunjobi and Sydney Wright won the J100 Accra Girls' Doubles title.",
          image: "https://www.ghanatennis.org/lib/common/tools/thumbnailer/?filename=BlogArticleImage305087.jpg&clientid=88872&width=1000",
          imageAlt: "J100 Accra Girls' Doubles champions Success Ogunjobi and Sydney Wright pose with their trophies",
          imageCredit: {
            credit: "Tennis Foundation Ghana",
            source: "https://www.ghanatennis.org/Blog/TFG/News-/Success-Ogunjobi-and-Sydney-Wright-Crowned-J100-Accra-Girls-Doubles-Champions/?link=1&fldKeywords=&fldAuthor=&fldTopic=0",
          },
        },
      ],
      international: [
        {
          title: "Court surfaces",
          detail: "Grand Slam courts range from the grass of Wimbledon to the clay of Roland-Garros and hard courts elsewhere.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Centre_court_crowd.JPG/1280px-Centre_court_crowd.JPG",
          imageAlt: "Wimbledon Centre Court, a grass-court venue",
          imageCredit: { credit: "Clavecin · Public domain", source: "https://commons.wikimedia.org/wiki/File:Centre_court_crowd.JPG" },
        },
        {
          title: "Serve and return",
          detail: "The server's placement and the returner's reaction shape the opening exchange of every point.",
          image: "https://upload.wikimedia.org/wikipedia/commons/4/42/StateLibQld_1_108516_Jack_Grinstead_serving_at_a_tennis_match.jpg",
          imageAlt: "Jack Grinstead serving at a tennis match in 1938",
          imageCredit: { credit: "Sunday Truth · Public domain", source: "https://commons.wikimedia.org/wiki/File:StateLibQld_1_108516_Jack_Grinstead_serving_at_a_tennis_match.jpg" },
        },
        {
          title: "Team competition",
          detail: "In the Davis Cup, players represent their countries in a team-based international competition.",
          image: "https://upload.wikimedia.org/wikipedia/commons/9/97/1908_Davis_Cup.jpg",
          imageAlt: "A historic Davis Cup team photograph from 1908",
          imageCredit: { credit: "Wikimedia Commons · Public domain", source: "https://commons.wikimedia.org/wiki/File:1908_Davis_Cup.jpg" },
        },
      ],
    },
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
    regionalFocus: {
      ghana: [
        {
          title: "The ring walk",
          detail: "Fight-night introductions bring the boxers and their corner teams into the spotlight before the opening bell.",
          image: "https://cdn.modernghana.com/images/content/1162023100657-1h830o4aau-selvy-vs-soldier2.jpg",
          imageAlt: "Boxers face off during a professional fight night at Bukom Boxing Arena in Accra",
          imageCredit: {
            credit: "Modern Ghana",
            source: "https://www.modernghana.com/sports/1271069/discipline-and-sanity-return-to-bukom-boxing-arena.html",
          },
        },
        {
          title: "Scoring and tactics",
          detail: "Ghanaian boxers read their opponents, balance attack with defence and work to make each scoring exchange count.",
          image: "https://pulitzercenter.org/sites/default/files/styles/orig_optimized/public/inline-images/Women%20Who%20Fight%20For%20Ghanaian%201.jpg.webp?itok=mJZafP3O",
          imageAlt: "Ghanaian women boxers competing at Bukom Boxing Arena",
          imageCredit: {
            credit: "Pulitzer Center",
            source: "https://pulitzercenter.org/stories/women-who-fight-ghanaian-female-boxers-path-acceptance-paved-side-hustles-and-social-stigma",
          },
        },
        {
          title: "The final bell",
          detail: "After the final bell at the 2026 Accra Box Cup youth final, the referee raises the winner's hand.",
          image: "https://www.graphic.com.gh/images/2026/May/02/BOXING.jpg",
          imageAlt: "A young boxer celebrates as the referee raises his hand after the Accra Box Cup youth final",
          imageCredit: {
            credit: "Graphic Online",
            source: "https://www.graphic.com.gh/sports/sports-news/accra-box-cup-2026-uncovers-next-generation-of-ghana-boxing-talent.html",
          },
        },
      ],
      international: [
        {
          title: "The ring walk",
          detail: "Daniel Dubois walks out at Wembley before his heavyweight fight with Oleksandr Usyk.",
          image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Daniel_Dubois_walkout_%28cropped2%29.jpg",
          imageAlt: "Daniel Dubois walking out at Wembley to fight Oleksandr Usyk",
          imageCredit: {
            credit: "Editor083 · CC BY 4.0",
            source: "https://commons.wikimedia.org/wiki/File:Daniel_Dubois_walkout_(cropped2).jpg",
          },
        },
        {
          title: "Scoring and tactics",
          detail: "At the 2011 World Boxing Championships, clean punches, defence and ring control shaped each final bout.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Final_bouts_of_the_16th_world_boxing_championship.jpg/1280px-Final_bouts_of_the_16th_world_boxing_championship.jpg",
          imageAlt: "Competitors in the final bouts of the 2011 World Boxing Championships",
          imageCredit: {
            credit: "President.az · CC BY 4.0",
            source: "https://commons.wikimedia.org/wiki/File:Final_bouts_of_the_16th_world_boxing_championship.jpg",
          },
        },
        {
          title: "The final bell",
          detail: "The referee raises Hugo Corro's arm after his victory over Ronnie Harris in 1978.",
          image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Hugo_Corro_defeats_Ronnie_Harris_-_1978.png",
          imageAlt: "Hugo Corro celebrates as a referee raises his arm after defeating Ronnie Harris in 1978",
          imageCredit: {
            credit: "El Gráfico · Public domain",
            source: "https://commons.wikimedia.org/wiki/File:Hugo_Corro_defeats_Ronnie_Harris_-_1978.png",
          },
        },
      ],
    },
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
    heroImages: {
      ghana: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_African_Games_athletics_38.jpg?width=1600",
      international: "https://commons.wikimedia.org/wiki/Special:FilePath/DOH50265_200m_men_final_(48911163797).jpg?width=1600",
    },
    heroAttributions: {
      ghana: {
        credit: "Amuzujoe",
        source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_athletics_38.jpg",
        license: "CC BY-SA 4.0",
        licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
      },
      international: {
        credit: "filip bossuyt",
        source: "https://commons.wikimedia.org/wiki/File:DOH50265_200m_men_final_(48911163797).jpg",
        license: "CC BY 2.0",
        licenseHref: "https://creativecommons.org/licenses/by/2.0/",
      },
    },
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
    regionalFocus: {
      ghana: [
        {
          title: "The start",
          detail: "Ghanaian hurdlers build speed from the line, where a sharp start sets up the approach to the first barrier.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_African_Games_race_01.jpg?width=1200",
          imageAlt: "Emebet Teketel competing in the women's 100 metres hurdles at the 2023 African Games in Accra",
          imageCredit: {
            credit: "Amuzujoe · CC BY-SA 4.0",
            source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_race_01.jpg",
          },
        },
        {
          title: "Relay exchanges",
          detail: "Ghana's 4 × 100m relay teams rely on clean baton exchanges to preserve speed through each changeover.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_African_Games_athletics_38.jpg?width=1200",
          imageAlt: "Men's 4 × 100 metres relay at the 2023 African Games in Accra",
          imageCredit: {
            credit: "Amuzujoe · CC BY-SA 4.0",
            source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_athletics_38.jpg",
          },
        },
        {
          title: "Field attempts",
          detail: "Ghanaian jumpers and throwers use each attempt to post a legal mark, as Rose Yeboah does in the high jump.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rose_Amoanimaa_Yeboah_AG23.jpg?width=1200",
          imageAlt: "Rose Amoanimaa Yeboah competing in the women's high jump at the 2023 African Games",
          imageCredit: {
            credit: "Amuzujoe · CC BY 4.0",
            source: "https://commons.wikimedia.org/wiki/File:Rose_Amoanimaa_Yeboah_AG23.jpg",
          },
        },
      ],
      international: [
        {
          title: "The start",
          detail: "Sprinters drive out of the blocks and accelerate into the race, with reaction and early strides shaping the contest.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/261000_-_Athletics_track_Lisa_Llorens_starting_blocks_-_3b_-_2000_Sydney_race_photo.jpg/1280px-261000_-_Athletics_track_Lisa_Llorens_starting_blocks_-_3b_-_2000_Sydney_race_photo.jpg",
          imageAlt: "Australian track athlete Lisa Llorens on the starting blocks at the 2000 Sydney Paralympic Games",
          imageCredit: {
            credit: "Australian Paralympic Committee · CC BY-SA 3.0",
            source: "https://commons.wikimedia.org/wiki/File:261000_-_Athletics_track_Lisa_Llorens_starting_blocks_-_3b_-_2000_Sydney_race_photo.jpg",
          },
        },
        {
          title: "Relay exchanges",
          detail: "At world-championship level, the baton must reach the next runner inside the exchange zone without losing momentum.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/2013_World_Championships_in_Athletics_%E2%80%93_Men%27s_4_%C3%97_100_metres_relay_04.jpg/1280px-2013_World_Championships_in_Athletics_%E2%80%93_Men%27s_4_%C3%97_100_metres_relay_04.jpg",
          imageAlt: "Men's 4 × 100 metres relay at the 2013 World Championships in Athletics",
          imageCredit: {
            credit: "Vladimir Yarotsky / Mos.ru · CC BY 4.0",
            source: "https://commons.wikimedia.org/wiki/File:2013_World_Championships_in_Athletics_%E2%80%93_Men%27s_4_%C3%97_100_metres_relay_04.jpg",
          },
        },
        {
          title: "Field attempts",
          detail: "Every vault, jump or throw is an attempt to record a legal mark; one clearance can decide an international title.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Armand_Duplantis(cropped)_Budapest_2023.jpg?width=1200",
          imageAlt: "Armand Duplantis competing in the men's pole vault at the 2023 World Athletics Championships",
          imageCredit: {
            credit: "Erik van Leeuwen · GFDL",
            source: "https://commons.wikimedia.org/wiki/File:Armand_Duplantis(cropped)_Budapest_2023.jpg",
          },
        },
      ],
    },
    sections: [
      { page: "ghana-athletics", label: "Ghana Athletics" }, { page: "international-athletics", label: "International Athletics" },
    ],
    sources: [],
    regionalSources: {
      ghana: [
        { label: "Ghana Athletics Association — National Sports Authority directory", href: "https://sportsauthority.gov.gh/association/" },
        { label: "Ghana Olympic Committee", href: "https://ghanaolympic.org/" },
        { label: "Ghanaian athletes — World Athletics profiles", href: "https://worldathletics.org/athletes?country=GHA" },
      ],
      international: [
        { label: "World Athletics — governing body and global news", href: "https://worldathletics.org/" },
        { label: "World Athletics — competition calendar and results", href: "https://worldathletics.org/competition/calendar-results" },
        { label: "World Athletics Championships", href: "https://worldathletics.org/competitions/world-athletics-championships" },
      ],
    },
  },
  f1: {
    name: "Formula 1",
    mark: "FORMULA 1",
    intro: "Explore Formula 1, the FIA's premier international single-seater championship, from its Grand Prix history to the drivers, teams and technology behind each race.",
    history: "The FIA Formula One World Championship began in 1950. From its first season of Grand Prix racing, the series has grown into a global championship contested by drivers and constructors across purpose-built circuits and city streets. Each race weekend combines practice, qualifying and the Grand Prix, while technical innovation and team strategy shape the competition.",
    heroImage: "https://commons.wikimedia.org/wiki/Special:FilePath/Formula_One_Grand_Prix_Singapore_2013_-_Ferrari_1.jpg?width=1800",
    heroAttribution: {
      credit: "Benjamin Goetzinger",
      source: "https://commons.wikimedia.org/wiki/File:Formula_One_Grand_Prix_Singapore_2013_-_Ferrari_1.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    guide: [
      { title: "The race weekend", detail: "Teams prepare through practice before qualifying determines the starting order. Grand Prix races test pace, tire management and consistency over many laps." },
      { title: "Drivers and constructors", detail: "Drivers compete for the Drivers' Championship, while teams earn points toward the Constructors' Championship." },
      { title: "Engineering and strategy", detail: "Car design, pit-stop timing, tire choices and changing track conditions all influence a team's race plan." },
    ],
    focus: [
      {
        title: "Qualifying",
        detail: "Drivers compete for grid positions, with the session format set by the event regulations.",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Williams_FW07.jpg",
        imageAlt: "Williams Formula 1 car on track during a wet qualifying session at Silverstone",
        imageCredit: {
          credit: "Daniel Herrick · CC BY-SA 2.0",
          source: "https://commons.wikimedia.org/wiki/File:Williams_FW07.jpg",
        },
      },
      {
        title: "Pit strategy",
        detail: "Teams make tire and pit-stop decisions in response to pace, conditions and safety-car periods.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Fangio_pit_stop_Nurburgring_1957.jpg/1280px-Fangio_pit_stop_Nurburgring_1957.jpg",
        imageAlt: "Juan Manuel Fangio stops for fuel and fresh tires during the 1957 German Grand Prix",
        imageCredit: {
          credit: "Willy Pragher / Landesarchiv Baden-Württemberg · CC BY 3.0",
          source: "https://commons.wikimedia.org/wiki/File:Fangio_pit_stop_Nurburgring_1957.jpg",
        },
      },
      {
        title: "The Grand Prix",
        detail: "Drivers race wheel-to-wheel for the finish, with results earning points under the championship rules.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/2015_Malaysian_GP_opening_lap.jpg/1280px-2015_Malaysian_GP_opening_lap.jpg",
        imageAlt: "Formula 1 cars contest the opening lap of the 2015 Malaysian Grand Prix",
        imageCredit: {
          credit: "Morio · CC BY-SA 4.0",
          source: "https://commons.wikimedia.org/wiki/File:2015_Malaysian_GP_opening_lap.jpg",
        },
      },
    ],
    sections: [
      { page: "f1-general", label: "General" }, { page: "f1-drivers", label: "Drivers" },
      { page: "f1-teams", label: "Teams" }, { page: "f1-news", label: "F1 News" },
    ],
    sources: [
      { label: "Formula 1 official site", href: "https://www.formula1.com/en" },
      { label: "Official 2026 Formula 1 drivers", href: "https://www.formula1.com/en/drivers" },
      { label: "Official 2026 Formula 1 teams", href: "https://www.formula1.com/en/teams" },
      { label: "FIA — Formula One", href: "https://www.fia.com/fia-f1-world-championship" },
      { label: "FIA regulations and governance", href: "https://www.fia.com/regulation/category/110" },
    ],
  },
  volleyball: {
    name: "Volleyball",
    mark: "VOLLEYBALL",
    intro: "Explore indoor and beach volleyball in Ghana and internationally, from team tactics and competitions to the rules behind each rally.",
    history: "William G. Morgan created volleyball in 1895 in Massachusetts. The indoor game and beach variant have since grown into international disciplines with distinct team sizes and competition formats.",
    heroImages: {
      ghana: "https://gna.org.gh/web/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-12-at-7.13.42-PM.jpeg",
      international: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Brasil_vence_a_Fran%C3%A7a_no_v%C3%B4lei_masculino_1037981-15.08.2016_ffz-5374.jpg/960px-Brasil_vence_a_Fran%C3%A7a_no_v%C3%B4lei_masculino_1037981-15.08.2016_ffz-5374.jpg",
    },
    internationalHeroPhotoCredit: {
      credit: "Fernando Frazão / Agência Brasil · CC BY 3.0 BR",
      source: "https://commons.wikimedia.org/wiki/File:Brasil_vence_a_Fran%C3%A7a_no_v%C3%B4lei_masculino_1037981-15.08.2016_ffz-5374.jpg",
    },
    heroPhotoCredit: {
      credit: "Ghana News Agency",
      source: "https://gna.org.gh/2026/03/police-sports-unit-congratulates-volleyball-club-for-victory/",
    },
    guide: [
      { title: "Indoor volleyball", detail: "Six players per side rotate positions. Teams build attacks with up to three contacts before sending the ball over the net." },
      { title: "Beach volleyball", detail: "Beach teams have two players, so each athlete covers more of the court and contributes across every phase." },
      { title: "Scoring", detail: "Matches are generally best of five sets. Sets use rally scoring and must be won by two points, subject to competition rules." },
    ],
    focus: [
      {
        title: "Serve and receive",
        detail: "A strong serve can disrupt the opposing team's first contact and limit its attacking options.",
        image: "/Volleyball-Graphics/joana-mensah.jpg",
        imageAlt: "Joana Mensah preparing to serve a volleyball",
      },
      {
        title: "The net battle",
        detail: "Setters, attackers and blockers read the play to create or close attacking lanes.",
        image: "/Volleyball-Graphics/net-battle-gabon.jpg",
        imageAlt: "A volleyball attacker spikes as two defenders block at the net in Gabon",
        imageCredit: {
          credit: "U.S. Navy · Public domain",
          source: "https://commons.wikimedia.org/wiki/File:US_Navy_080112-N-8933S-127_Seaman_Wilfredo_Jirauruiz_blocks_a_spike_during_a_volleyball_game_against_the_Vieille_Gloire_(Old_Glory)_team_a_local_Gabonese_volleyball_team.jpg",
        },
      },
      {
        title: "Defensive coverage",
        detail: "Digging and court coverage keep rallies alive and give teams another chance to attack.",
        image: "/Volleyball-Graphics/grace-dagadu.jpg",
        imageAlt: "Grace Dagadu dropping low to dig a volleyball",
      },
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
    heroImages: {
      ghana: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/2023_African_Games_01_cricket_166.jpg/960px-2023_African_Games_01_cricket_166.jpg",
      international: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/2020_ICC_Women%27s_T20_World_Cup_Final.jpg/960px-2020_ICC_Women%27s_T20_World_Cup_Final.jpg",
    },
    heroPhotoCredit: {
      credit: "Amuzujoe · CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_01_cricket_166.jpg",
    },
    internationalHeroPhotoCredit: {
      credit: "Storm machine · CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:2020_ICC_Women%27s_T20_World_Cup_Final.jpg",
    },
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
    regionalFocus: {
      ghana: [
        {
          title: "The toss",
          detail: "The toss winner chooses whether to bat or field first, a decision shaped by conditions and match format.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/2023_African_Games_01_cricket_142.jpg/960px-2023_African_Games_01_cricket_142.jpg",
          imageAlt: "Cricket wickets and an official at the 2023 African Games in Accra before play",
          imageCredit: {
            credit: "Amuzujoe · CC BY-SA 4.0",
            source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_01_cricket_142.jpg",
          },
        },
        {
          title: "Overs and innings",
          detail: "Overs, innings and follow-on rules differ by format and competition.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/2023_African_Games_01_cricket_181.jpg/960px-2023_African_Games_01_cricket_181.jpg",
          imageAlt: "A batter plays a shot as the wicketkeeper waits during the Zimbabwe-Kenya match at the 2023 African Games",
          imageCredit: {
            credit: "Amuzujoe · CC BY-SA 4.0",
            source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_01_cricket_181.jpg",
          },
        },
        {
          title: "The result",
          detail: "Matches can be decided by runs, wickets or innings; some formats can end in a tie or no result.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/2023_African_Games_01_cricket_123.jpg/960px-2023_African_Games_01_cricket_123.jpg",
          imageAlt: "Kenya's cricket team gathers beside the scoreboard at the 2023 African Games in Accra",
          imageCredit: {
            credit: "Amuzujoe · CC BY-SA 4.0",
            source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_01_cricket_123.jpg",
          },
        },
      ],
      international: [
        {
          title: "The toss",
          detail: "The toss winner chooses whether to bat or field first, a decision shaped by conditions and match format.",
          image: "https://upload.wikimedia.org/wikipedia/commons/9/97/Mary_Duggan_and_Rona_McKenzie%2C_tossing_a_coin%2C_1957.jpg",
          imageAlt: "England captain Mary Duggan and New Zealand captain Rona McKenzie pose as a coin is tossed before their 1957 women's cricket series",
          imageCredit: {
            credit: "Evening Post of Wellington · Public domain",
            source: "https://commons.wikimedia.org/wiki/File:Mary_Duggan_and_Rona_McKenzie,_tossing_a_coin,_1957.jpg",
          },
        },
        {
          title: "Overs and innings",
          detail: "From T20 to Test cricket, each format sets its own pace and limits for an innings.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Cricket_6.jpg/960px-Cricket_6.jpg",
          imageAlt: "Wicket-side view from the first innings of the 2023 Cricket World Cup final between India and Australia",
          imageCredit: {
            credit: "Pantman2 · CC BY-SA 4.0",
            source: "https://commons.wikimedia.org/wiki/File:Cricket_6.jpg",
          },
        },
        {
          title: "The result",
          detail: "A World Cup final can come down to the last runs, wickets or overs before the champions lift the trophy.",
          image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/CWC_2015_celebrations.jpg/960px-CWC_2015_celebrations.jpg",
          imageAlt: "Australia's team celebrates with the trophy after winning the 2015 ICC Cricket World Cup",
          imageCredit: {
            credit: "Storm machine · CC BY-SA 4.0",
            source: "https://commons.wikimedia.org/wiki/File:CWC_2015_celebrations.jpg",
          },
        },
      ],
    },
    sections: [
      { page: "ghana-cricket", label: "Ghana Cricket" }, { page: "international-cricket", label: "International Cricket" },
      { page: "cricket-news", label: "Cricket News" }, { page: "icc", label: "ICC" },
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

const F1_DRIVERS: F1Driver[] = [
  { name: "George Russell", team: "Mercedes", nationality: "United Kingdom", href: "https://www.formula1.com/en/drivers/george-russell", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/mercedes/georus01/2026mercedesgeorus01right.webp" },
  { name: "Kimi Antonelli", team: "Mercedes", nationality: "Italy", href: "https://www.formula1.com/en/drivers/kimi-antonelli", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/mercedes/andant01/2026mercedesandant01right.webp" },
  { name: "Charles Leclerc", team: "Ferrari", nationality: "Monaco", href: "https://www.formula1.com/en/drivers/charles-leclerc", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/ferrari/chalec01/2026ferrarichalec01right.webp" },
  { name: "Lewis Hamilton", team: "Ferrari", nationality: "United Kingdom", href: "https://www.formula1.com/en/drivers/lewis-hamilton", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/ferrari/lewham01/2026ferrarilewham01right.webp" },
  { name: "Max Verstappen", team: "Red Bull Racing", nationality: "Netherlands", href: "https://www.formula1.com/en/drivers/max-verstappen", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/redbullracing/maxver01/2026redbullracingmaxver01right.webp" },
  { name: "Isack Hadjar", team: "Red Bull Racing", nationality: "France", href: "https://www.formula1.com/en/drivers/isack-hadjar", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/redbullracing/isahad01/2026redbullracingisahad01right.webp" },
  { name: "Lando Norris", team: "McLaren", nationality: "United Kingdom", href: "https://www.formula1.com/en/drivers/lando-norris", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/mclaren/lannor01/2026mclarenlannor01right.webp" },
  { name: "Oscar Piastri", team: "McLaren", nationality: "Australia", href: "https://www.formula1.com/en/drivers/oscar-piastri", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/mclaren/oscpia01/2026mclarenoscpia01right.webp" },
  { name: "Liam Lawson", team: "Racing Bulls", nationality: "New Zealand", href: "https://www.formula1.com/en/drivers/liam-lawson", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/racingbulls/lialaw01/2026racingbullslialaw01right.webp" },
  { name: "Arvid Lindblad", team: "Racing Bulls", nationality: "United Kingdom", href: "https://www.formula1.com/en/drivers/arvid-lindblad", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/racingbulls/arvlin01/2026racingbullsarvlin01right.webp" },
  { name: "Pierre Gasly", team: "Alpine", nationality: "France", href: "https://www.formula1.com/en/drivers/pierre-gasly", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/alpine/piegas01/2026alpinepiegas01right.webp" },
  { name: "Franco Colapinto", team: "Alpine", nationality: "Argentina", href: "https://www.formula1.com/en/drivers/franco-colapinto", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/alpine/fracol01/2026alpinefracol01right.webp" },
  { name: "Oliver Bearman", team: "Haas F1 Team", nationality: "United Kingdom", href: "https://www.formula1.com/en/drivers/oliver-bearman", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/haas/olibea01/2026haasolibea01right.webp" },
  { name: "Esteban Ocon", team: "Haas F1 Team", nationality: "France", href: "https://www.formula1.com/en/drivers/esteban-ocon", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/haas/estoco01/2026haasestoco01right.webp" },
  { name: "Nico Hulkenberg", team: "Audi", nationality: "Germany", href: "https://www.formula1.com/en/drivers/nico-hulkenberg", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/audi/nichul01/2026audinichul01right.webp" },
  { name: "Gabriel Bortoleto", team: "Audi", nationality: "Brazil", href: "https://www.formula1.com/en/drivers/gabriel-bortoleto", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/audi/gabbor01/2026audigabbor01right.webp" },
  { name: "Carlos Sainz", team: "Williams", nationality: "Spain", href: "https://www.formula1.com/en/drivers/carlos-sainz", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/williams/carsai01/2026williamscarsai01right.webp" },
  { name: "Alexander Albon", team: "Williams", nationality: "Thailand", href: "https://www.formula1.com/en/drivers/alexander-albon", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/williams/alealb01/2026williamsalealb01right.webp" },
  { name: "Fernando Alonso", team: "Aston Martin", nationality: "Spain", href: "https://www.formula1.com/en/drivers/fernando-alonso", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/astonmartin/feralo01/2026astonmartinferalo01right.webp" },
  { name: "Lance Stroll", team: "Aston Martin", nationality: "Canada", href: "https://www.formula1.com/en/drivers/lance-stroll", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/astonmartin/lanstr01/2026astonmartinlanstr01right.webp" },
  { name: "Sergio Perez", team: "Cadillac", nationality: "Mexico", href: "https://www.formula1.com/en/drivers/sergio-perez", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/cadillac/serper01/2026cadillacserper01right.webp" },
  { name: "Valtteri Bottas", team: "Cadillac", nationality: "Finland", href: "https://www.formula1.com/en/drivers/valtteri-bottas", image: "https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/cadillac/valbot01/2026cadillacvalbot01right.webp" },
];

const F1_TEAMS: F1Team[] = [
  { name: "Mercedes", drivers: ["George Russell", "Kimi Antonelli"], href: "https://www.formula1.com/en/teams/mercedes", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedescarright.webp" },
  { name: "Ferrari", drivers: ["Charles Leclerc", "Lewis Hamilton"], href: "https://www.formula1.com/en/teams/ferrari", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/ferrari/2026ferraricarright.webp" },
  { name: "Red Bull Racing", drivers: ["Max Verstappen", "Isack Hadjar"], href: "https://www.formula1.com/en/teams/red-bull-racing", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/redbullracing/2026redbullracingcarright.webp" },
  { name: "McLaren", drivers: ["Lando Norris", "Oscar Piastri"], href: "https://www.formula1.com/en/teams/mclaren", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarencarright.webp" },
  { name: "Racing Bulls", drivers: ["Liam Lawson", "Arvid Lindblad"], href: "https://www.formula1.com/en/teams/racing-bulls", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullscarright.webp" },
  { name: "Alpine", drivers: ["Pierre Gasly", "Franco Colapinto"], href: "https://www.formula1.com/en/teams/alpine", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/alpine/2026alpinecarright.webp" },
  { name: "Haas F1 Team", drivers: ["Oliver Bearman", "Esteban Ocon"], href: "https://www.formula1.com/en/teams/haas", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/haas/2026haascarright.webp" },
  { name: "Audi", drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"], href: "https://www.formula1.com/en/teams/audi", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/audi/2026audicarright.webp" },
  { name: "Williams", drivers: ["Carlos Sainz", "Alexander Albon"], href: "https://www.formula1.com/en/teams/williams", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/williams/2026williamscarright.webp" },
  { name: "Aston Martin", drivers: ["Fernando Alonso", "Lance Stroll"], href: "https://www.formula1.com/en/teams/aston-martin", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartincarright.webp" },
  { name: "Cadillac", drivers: ["Sergio Perez", "Valtteri Bottas"], href: "https://www.formula1.com/en/teams/cadillac", image: "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/common/f1/2026/cadillac/2026cadillaccarright.webp" },
];

const F1_HERO_IMAGES: Record<string, string> = {
  "f1-drivers": "https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Practice/2268571554.webp",
  "f1-teams": "https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan/2268884816.webp",
  "f1-news": "https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265209242.webp",
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
  const isBasketball = profile.name === "Basketball";
  const isTennis = profile.name === "Tennis";
  const isBoxing = profile.name === "Boxing";
  const isAthletics = profile.name === "Athletics";
  const isF1 = profile.name === "Formula 1";
  const isVolleyball = profile.name === "Volleyball";
  const isCricket = profile.name === "Cricket";
  const isBaseball = profile.name === "Baseball";
  const isVolleyballNewsPage = isVolleyball && section === "volleyball-news";
  const isCricketNewsPage = isCricket && section === "cricket-news";
  const isCricketICCPage = isCricket && section === "icc";
  const isBaseballNewsPage = isBaseball && section === "baseball-news";
  const newsPage = isF1 ? "f1-news" : domestic ? "ghana-sports" : "international-sports-news";
  const newsDesk = isF1 ? "F1 News" : domestic ? "Ghana Sports News" : "International Sports News";
  const isNba = section === "nba";
  const hasParentSections = isBasketball || isTennis;
  const relatedSections = hasParentSections
    ? profile.sections.filter((item) => item.page === (domestic
      ? (isBasketball ? "international-basketball" : "international-tennis")
      : (isBasketball ? "ghana-basketball" : "ghana-tennis")))
    : profile.sections.filter((item) => item.page !== section);
  const heroImage = isF1
    ? section === "f1-general" ? profile.heroImage : F1_HERO_IMAGES[section]
    : isBasketball && domestic
    ? "https://www.happyghana.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-19-at-8.07.44-PM.jpeg"
    : profile.heroImages
      ? (domestic ? profile.heroImages.ghana : profile.heroImages.international)
      : profile.heroImage;
  const heroAttribution = isAthletics
    ? profile.heroAttributions?.[domestic ? "ghana" : "international"]
    : isF1 && section === "f1-general" ? profile.heroAttribution : undefined;
  const heroPhotoCredit = domestic ? profile.heroPhotoCredit : profile.internationalHeroPhotoCredit;
  const officialSources = profile.regionalSources
    ? profile.regionalSources[domestic ? "ghana" : "international"]
    : profile.sources;
  if (isCricketNewsPage) {
    return (
      <>
        <CricketNews />
        <SportsDeskFooter desk="Cricket Desk" description="Cricket coverage from Ghana and around the world." onNavigate={onNavigate} />
      </>
    );
  }
  if (isCricketICCPage) {
    return (
      <>
        <CricketICC />
        <SportsDeskFooter desk="Cricket Desk" description="Cricket coverage from Ghana and around the world." onNavigate={onNavigate} />
      </>
    );
  }
  if (isBaseball && section === "mlb") {
    return (
      <>
        <BaseballMLB onNavigate={onNavigate} />
        <SportsDeskFooter desk="Baseball Desk" description="Major League Baseball, international baseball and the stories shaping the game." onNavigate={onNavigate} />
      </>
    );
  }
  if (isBaseballNewsPage) {
    return (
      <>
        <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
          <section className="border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-7xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Baseball</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Baseball News</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">Baseball stories discovered by our international news desk and reviewed by an editor before publication.</p>
            </div>
          </section>
          <InternationalSportsNews category="Baseball" />
        </main>
        <SportsDeskFooter desk="Baseball Desk" description="Baseball coverage reviewed by our editorial team before publication." onNavigate={onNavigate} />
      </>
    );
  }
  const ghanaBasketballGallery = [
    { title: "Spintex Knights in Accra league action", detail: "A Ghanaian club attacks the basket during a local league game.", image: "https://www.graphic.com.gh/images/2023/mar/27/knights23.jpg" },
    { title: "Spintex Knights prepare together", detail: "A team huddle before the next possession in the Accra Basketball League.", image: "https://wmctyawziazzjvlwrimq.supabase.co/storage/v1/object/public/scribe-images/2d13e0cf-cee5-40f8-ba82-e7b44c067e14.png" },
    { title: "Braves women at the national championship", detail: "Ghanaian players compete at the national level.", image: "https://citisportsonline.com/wp-content/uploads/2022/12/Gyampoh-819x1024.jpg" },
    { title: "Ghana basketball champions", detail: "Accra Region celebrates a national championship win.", image: "https://citisportsonline.com/wp-content/uploads/2022/12/bb-2.jpg" },
  ];
  const ghanaCricketGallery: PhotoGalleryItem[] = [
    {
      title: "Zimbabwe and Kenya meet on the field",
      detail: "Players from both sides greet one another during the men's cricket tournament in Accra.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/2023_African_Games_01_cricket_177.jpg/960px-2023_African_Games_01_cricket_177.jpg",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_01_cricket_177.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Namibia's squad at the African Games",
      detail: "Namibia's team poses during the men's cricket tournament hosted in Accra.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/2023_African_Games_01_cricket_178.jpg/960px-2023_African_Games_01_cricket_178.jpg",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_01_cricket_178.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Bat and gloves ready for play",
      detail: "Cricket equipment set out at the African Games venue in Accra.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/2023_African_Games_01_cricket_165.jpg/960px-2023_African_Games_01_cricket_165.jpg",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_01_cricket_165.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Fielding practice before the match",
      detail: "Zimbabwe players work through a fielding drill during the Accra tournament.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/2023_African_Games_01_cricket_182.jpg/960px-2023_African_Games_01_cricket_182.jpg",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_01_cricket_182.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  ];
  const internationalCricketGallery: PhotoGalleryItem[] = [
    {
      title: "England and New Zealand in Test action",
      detail: "Gus Atkinson bowls to Devon Conway on day one of the third Test in 2026.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/England_v_New_Zealand_3rd_Test_2026.jpg/960px-England_v_New_Zealand_3rd_Test_2026.jpg",
      credit: "Edwin of Northumbria",
      source: "https://commons.wikimedia.org/wiki/File:England_v_New_Zealand_3rd_Test_2026.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Bermuda face Panama in a T20 World Cup qualifier",
      detail: "International men's cricket at the 2023 ICC Men's T20 World Cup Americas Qualifier.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/BER_vs_PAN_at_the_2023_ICC_Men%27s_T20_World_Cup_Americas_Qualifier_by_BugWarp_80.jpg/960px-BER_vs_PAN_at_the_2023_ICC_Men%27s_T20_World_Cup_Americas_Qualifier_by_BugWarp_80.jpg",
      credit: "BugWarp",
      source: "https://commons.wikimedia.org/wiki/File:BER_vs_PAN_at_the_2023_ICC_Men%27s_T20_World_Cup_Americas_Qualifier_by_BugWarp_80.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Argentina prepare for a Women's T20 World Cup qualifier",
      detail: "Argentina's women's team warms up before facing the United States in the 2025 Americas Qualifier.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Flamingos_Warmup_2025_Women%27s_T20_World_Cup_Americas_Qualifier_-_BugWarp_02.jpg/960px-Flamingos_Warmup_2025_Women%27s_T20_World_Cup_Americas_Qualifier_-_BugWarp_02.jpg",
      credit: "BugWarp",
      source: "https://commons.wikimedia.org/wiki/File:Flamingos_Warmup_2025_Women%27s_T20_World_Cup_Americas_Qualifier_-_BugWarp_02.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Australia celebrate the 2020 Women's T20 World Cup",
      detail: "Australia's women's team celebrates after receiving the trophy at the Melbourne Cricket Ground.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/2020_ICC_Women%27s_T20_World_Cup_champions.jpg/960px-2020_ICC_Women%27s_T20_World_Cup_champions.jpg",
      credit: "Storm machine",
      source: "https://commons.wikimedia.org/wiki/File:2020_ICC_Women%27s_T20_World_Cup_champions.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Grand Prairie Stadium hosts international cricket",
      detail: "The Dallas-area venue was converted for cricket and hosted matches during the 2024 ICC Men's T20 World Cup.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Grand_Prairie_Stadium_seating%2C_April_2024.jpg/960px-Grand_Prairie_Stadium_seating%2C_April_2024.jpg",
      credit: "SounderBruce",
      source: "https://commons.wikimedia.org/wiki/File:Grand_Prairie_Stadium_seating,_April_2024.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
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
  const ghanaAthleticsGallery: AthleticsPhoto[] = [
    {
      title: "Ghana men's 4 × 100m relay",
      detail: "Benjamin Azamati is among the athletes identified in this relay event at the 2023 African Games in Accra.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_African_Games_athletics_38.jpg?width=1000",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_athletics_38.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Women's 4 × 100m relay",
      detail: "Women compete in the 4 × 100m relay at the 2023 African Games in Accra.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_African_Games_athletics_09.jpg?width=1000",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_athletics_09.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Rose Yeboah in the women's high jump",
      detail: "Rose Amoanimaa Yeboah competes in the women's high jump at the 2023 African Games in Accra.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rose_Amoanimaa_Yeboah_AG23.jpg?width=1000",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:Rose_Amoanimaa_Yeboah_AG23.jpg",
      license: "CC BY 4.0",
      licenseHref: "https://creativecommons.org/licenses/by/4.0/",
    },
    {
      title: "Women's 100m hurdles at the 2023 African Games",
      detail: "Emebet Teketel and the field race over the hurdles during the African Games in Accra.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_African_Games_race_01.jpg?width=1000",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_race_01.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      title: "Men's 10,000m at the 2023 African Games",
      detail: "Runners compete in the men's 10,000m at the African Games in Accra.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_African_Games_Race_03.jpg?width=1000",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_African_Games_Race_03.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  ];
  const internationalAthleticsGallery: AthleticsPhoto[] = [
    {
      title: "Usain Bolt wins the Manchester 150m street race",
      detail: "Bolt completes a lap of honour after winning the 150m street race at the 2009 Manchester City Games.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/2009_Manchester_City_Games_-_Bolt.JPG?width=1000",
      credit: "Sillyfolkboy",
      source: "https://commons.wikimedia.org/wiki/File:2009_Manchester_City_Games_-_Bolt.JPG",
      license: "CC BY-SA 3.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
    {
      title: "Men's 100m final at the 2009 World Championships",
      detail: "Usain Bolt races Tyson Gay and Asafa Powell in the 100m final in Berlin.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/100_m_final_Berlin_2009.JPG?width=1000",
      credit: "Erik van Leeuwen",
      source: "https://commons.wikimedia.org/wiki/File:100_m_final_Berlin_2009.JPG",
      license: "GFDL",
      licenseHref: "https://www.gnu.org/copyleft/fdl.html",
    },
    {
      title: "Men's 100m final at the 2017 World Championships",
      detail: "Usain Bolt and the finalists race in the men's 100m final in London.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/100_m_men_final_London_2017.jpg?width=1000",
      credit: "Erik van Leeuwen",
      source: "https://commons.wikimedia.org/wiki/File:100_m_men_final_London_2017.jpg",
      license: "GFDL",
      licenseHref: "https://www.gnu.org/copyleft/fdl.html",
    },
    {
      title: "Men's 200m final at the 2019 World Championships",
      detail: "Noah Lyles and the finalists compete in the men's 200m final in Doha.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/DOH50265_200m_men_final_(48911163797).jpg?width=1000",
      credit: "filip bossuyt",
      source: "https://commons.wikimedia.org/wiki/File:DOH50265_200m_men_final_(48911163797).jpg",
      license: "CC BY 2.0",
      licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    },
    {
      title: "Armand Duplantis in the pole vault",
      detail: "Duplantis competes in the men's pole vault at the 2023 World Athletics Championships in Budapest.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Armand_Duplantis(cropped)_Budapest_2023.jpg?width=1000",
      credit: "Erik van Leeuwen",
      source: "https://commons.wikimedia.org/wiki/File:Armand_Duplantis(cropped)_Budapest_2023.jpg",
      license: "GFDL",
      licenseHref: "https://www.gnu.org/copyleft/fdl.html",
    },
    {
      title: "Women's 1500m at the 2023 World Championships",
      detail: "Faith Kipyegon competes in the women's 1500m at the World Athletics Championships in Budapest.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Faith_Kipyegon_(cropped)_Budapest_2023.jpg?width=1000",
      credit: "Erik van Leeuwen",
      source: "https://commons.wikimedia.org/wiki/File:Faith_Kipyegon_(cropped)_Budapest_2023.jpg",
      license: "GFDL",
      licenseHref: "https://www.gnu.org/copyleft/fdl.html",
    },
  ];
  const formulaOneGallery: PhotoGalleryItem[] = [
    {
      title: "Monaco Grand Prix race start",
      detail: "Nico Rosberg leads the field at the start of the 2013 Monaco Grand Prix.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/2013_Monaco_Grand_Prix_-_Sunday_(15272209777).jpg?width=1000",
      credit: "United Autosports",
      source: "https://commons.wikimedia.org/wiki/File:2013_Monaco_Grand_Prix_-_Sunday_(15272209777).jpg",
      license: "CC BY-SA 2.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/2.0/",
    },
    {
      title: "A Formula 1 pit stop at Monza",
      detail: "The McLaren MP4-19 pits during the 2004 Italian Grand Prix at Monza.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Fale_F1_Monza_2004_77.jpg?width=1000",
      credit: "Fabio Alessandro Locati",
      source: "https://commons.wikimedia.org/wiki/File:Fale_F1_Monza_2004_77.jpg",
      license: "CC BY-SA 3.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
    {
      title: "Ferrari at the Singapore Grand Prix",
      detail: "A Ferrari Formula 1 car runs during the 2013 Singapore Grand Prix.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Formula_One_Grand_Prix_Singapore_2013_-_Ferrari_2.jpg?width=1000",
      credit: "Benjamin Goetzinger",
      source: "https://commons.wikimedia.org/wiki/File:Formula_One_Grand_Prix_Singapore_2013_-_Ferrari_2.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  ];
  const ghanaAthleticsPlayers: AthleticsAthlete[] = [
    {
      name: "Benjamin Azamati",
      discipline: "Men's sprints · Ghana",
      detail: "Ghanaian sprinter and member of the men's 4 × 100m relay at the 2023 African Games.",
      href: "https://worldathletics.org/athletes/ghana/benjamin-azamati-14779040",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Benjamin_Azamati_AG2023.jpg?width=800",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:Benjamin_Azamati_AG2023.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      name: "Rose Amoanimaa Yeboah",
      discipline: "Women's high jump · Ghana",
      detail: "Ghanaian high jumper who competed at the 2023 African Games in Accra.",
      href: "https://worldathletics.org/athletes?athleteName=Rose%20Yeboah",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_Afriican_Games_6910_16.jpg?width=800",
      credit: "Amuzujoe",
      source: "https://commons.wikimedia.org/wiki/File:2023_Afriican_Games_6910_16.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  ];
  const internationalAthleticsPlayers: AthleticsAthlete[] = [
    {
      name: "Usain Bolt",
      discipline: "Men's sprints · Jamaica",
      detail: "The eight-time Olympic champion and world-record holder in the 100m and 200m. View his official profile and career results.",
      href: "https://worldathletics.org/athletes/jamaica/usain-bolt-14201847",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Usain_Bolt_(9391712915).jpg?width=800",
      credit: "Neil",
      source: "https://commons.wikimedia.org/wiki/File:Usain_Bolt_(9391712915).jpg",
      license: "CC BY 2.0",
      licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    },
    {
      name: "Noah Lyles",
      discipline: "Men's sprints · United States",
      detail: "World champion sprinter. View his official profile, results and personal bests.",
      href: "https://worldathletics.org/athletes/united-states/noah-lyles-14641898",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Noah_Lyles_(USA).jpg?width=800",
      credit: "jenaragon94",
      source: "https://commons.wikimedia.org/wiki/File:Noah_Lyles_(USA).jpg",
      license: "CC BY 2.0",
      licenseHref: "https://creativecommons.org/licenses/by/2.0/",
    },
    {
      name: "Faith Kipyegon",
      discipline: "Women's 1500m · Kenya",
      detail: "World champion middle-distance runner. View her official profile, results and personal bests.",
      href: "https://worldathletics.org/athletes/kenya/faith-kipyegon-14379873",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Faith_Kipyegon_Oregon_2022.jpg?width=800",
      credit: "Erik van Leeuwen",
      source: "https://commons.wikimedia.org/wiki/File:Faith_Kipyegon_Oregon_2022.jpg",
      license: "GFDL",
      licenseHref: "https://www.gnu.org/copyleft/fdl.html",
    },
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
  const ghanaVolleyballGallery = [
    {
      title: "Kalibi Sports Club's continental breakthrough",
      detail: "The Ghana Police Sports Unit congratulated Kalibi Sports Club after its women's-category victory at the CAVB Zone III African Club Championship.",
      image: "https://gna.org.gh/web/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-12-at-7.13.42-PM.jpeg",
      credit: "Ghana News Agency",
      source: "https://gna.org.gh/2026/03/police-sports-unit-congratulates-volleyball-club-for-victory/",
    },
    {
      title: "Ghana's U-19 men win silver",
      detail: "Ghana's U-19 men's team claimed silver at the 2024 Volleyball Championship in Abidjan.",
      image: "https://gna.org.gh/web/wp-content/uploads/2024/07/Sport-Volleyball-Championship-1.jpeg",
      credit: "Ghana News Agency",
      source: "https://gna.org.gh/2024/07/ghana-wins-silver-at-cote-divoire-2024-volleyball-championship/",
    },
    {
      title: "A new volleyball court at Paga SHS",
      detail: "A court commissioned at Paga Senior High School hosted volleyball competitions involving students from neighbouring schools.",
      image: "https://gna.org.gh/web/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-08-at-6.18.39-PM.jpeg",
      credit: "Ghana News Agency",
      source: "https://gna.org.gh/2026/06/kacstone-records-commissions-volleyball-court-donates-sports-equipment-to-paga-shs/",
    },
  ];
  const ghanaVolleyballPlayers = [
    { name: "Rashaka Katadat", team: "Ghana Army", category: "Women's beach volleyball", image: "/Volleyball-Graphics/rashaka-katadat.webp" },
    { name: "Benedicta Akorli", team: "Ghana Air Force", category: "Women's beach volleyball", image: "/Volleyball-Graphics/benedicta-akorli.webp" },
    { name: "Grace Dagadu", team: "Ghana Air Force", category: "Women's beach volleyball", image: "/Volleyball-Graphics/grace-dagadu.jpg" },
    { name: "Joana Mensah", team: "Elwak Wings", category: "Women's beach volleyball", image: "/Volleyball-Graphics/joana-mensah.jpg" },
    { name: "Paul Akan", team: "Ghana Police", category: "Men's beach volleyball", image: "/Volleyball-Graphics/paul-akan.jpg" },
    { name: "Abdul Hameed Ibrahim", team: "Ghana Police", category: "Men's beach volleyball", image: "/Volleyball-Graphics/abdul-hameed-ibrahim.jpg" },
    { name: "Nicholas Tetteh", team: "Ghana Air Force", category: "Men's beach volleyball", image: "/Volleyball-Graphics/nicholas-tetteh.jpg" },
    { name: "Emmanuel Adamitey", team: "Ghana Police", category: "Men's beach volleyball", image: "/Volleyball-Graphics/emmanuel-adamitey.jpg" },
    { name: "Emmanuel Abbey", team: "Ghana Fire Service", category: "Under-21 beach volleyball", image: "/Volleyball-Graphics/emmanuel-abbey.jpg" },
    { name: "Eben Anyetei", team: "Labadi VC", category: "Under-21 beach volleyball", image: "/Volleyball-Graphics/eben-anyetei.jpg" },
  ];
  const ghanaVolleyballTeams = [
    {
      name: "Kalibi Sports Club",
      detail: "Reported for a women's-category victory at the 2026 CAVB Zone III African Club Championship.",
      source: "https://gna.org.gh/2026/03/police-sports-unit-congratulates-volleyball-club-for-victory/",
      image: "/Volleyball-Graphics/kalibi-sports-club.jpg",
    },
    {
      name: "Ghana Army",
      detail: "Affiliation of a player named in Ghana's 2025 senior beach-volleyball squad.",
      source: "https://gna.org.gh/2025/06/team-ghana-in-morocco-for-the-2025-africa-seniors-beach-volleyball-championships/",
      image: "/Volleyball-Graphics/ghana-army-volleyball.webp",
    },
    {
      name: "Ghana Air Force",
      detail: "Affiliation of players named in Ghana's 2025 senior beach-volleyball squad.",
      source: "https://gna.org.gh/2025/06/team-ghana-in-morocco-for-the-2025-africa-seniors-beach-volleyball-championships/",
      image: "/Volleyball-Graphics/ghana-air-force-volleyball.webp",
    },
    {
      name: "Ghana Police",
      detail: "Affiliation of players named in Ghana's 2025 senior beach-volleyball squad.",
      source: "https://gna.org.gh/2025/06/team-ghana-in-morocco-for-the-2025-africa-seniors-beach-volleyball-championships/",
      image: "/Volleyball-Graphics/ghana-police-volleyball.webp",
    },
    {
      name: "Elwak Wings",
      detail: "Affiliation of a player named in Ghana's 2025 senior beach-volleyball squad.",
      source: "https://gna.org.gh/2025/06/team-ghana-in-morocco-for-the-2025-africa-seniors-beach-volleyball-championships/",
      image: "/Volleyball-Graphics/elwak-wings.jpg",
    },
    {
      name: "Ghana Fire Service",
      detail: "Affiliation of an under-21 player named in Ghana's 2025 beach-volleyball squad.",
      source: "https://gna.org.gh/2025/06/team-ghana-in-morocco-for-the-2025-africa-seniors-beach-volleyball-championships/",
      image: "/Volleyball-Graphics/ghana-fire-service-volleyball.webp",
    },
    {
      name: "Labadi VC",
      detail: "Affiliation of an under-21 player named in Ghana's 2025 beach-volleyball squad.",
      source: "https://gna.org.gh/2025/06/team-ghana-in-morocco-for-the-2025-africa-seniors-beach-volleyball-championships/",
    },
  ];
  const internationalVolleyballGallery = [
    {
      title: "Rio 2016 beach volleyball",
      detail: "Polish beach-volleyball player Kinga Kołosińska competes at the Rio 2016 Olympic Games.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Kinga_Ko%C5%82osi%C5%84ska_%28POL%29_Rio_2016.jpg/960px-Kinga_Ko%C5%82osi%C5%84ska_%28POL%29_Rio_2016.jpg",
      credit: "Cristiana Giustino · CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Kinga_Ko%C5%82osi%C5%84ska_(POL)_Rio_2016.jpg",
    },
    {
      title: "Germany meet Brazil",
      detail: "Germany and Brazil play a women's international friendly in 2022.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/2022-09-17_Deutschland_gegen_Brasilien_%28Volleyball-Freundschaftsspiel_der_Frauen%29_by_Sandro_Halank%E2%80%93080.jpg/960px-2022-09-17_Deutschland_gegen_Brasilien_%28Volleyball-Freundschaftsspiel_der_Frauen%29_by_Sandro_Halank%E2%80%93080.jpg",
      credit: "Sandro Halank · CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:2022-09-17_Deutschland_gegen_Brasilien_(Volleyball-Freundschaftsspiel_der_Frauen)_by_Sandro_Halank%E2%80%93080.jpg",
    },
    {
      title: "Olympic match: Iran vs Italy",
      detail: "Iran and Italy face off in men's volleyball at the Rio 2016 Olympic Games.",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Volleyball_match_between_national_teams_of_Iran_and_Italy_at_the_Olympic_Games_in_2016_-_25.jpg",
      credit: "Mohammad Hassansadeh / Tasnim News · CC BY 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Volleyball_match_between_national_teams_of_Iran_and_Italy_at_the_Olympic_Games_in_2016_-_25.jpg",
    },
  ];
  const internationalVolleyballPlayers = [
    {
      name: "Paola Egonu",
      team: "Italy national team",
      category: "Opposite hitter",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Paola_Egonu.jpg/960px-Paola_Egonu.jpg",
      credit: "Osvaldo Telese · CC0",
      source: "https://commons.wikimedia.org/wiki/File:Paola_Egonu.jpg",
    },
    {
      name: "Gabriela Guimarães (Gabi)",
      team: "Brazil national team",
      category: "Outside hitter",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Gabi%2C_Grand_Prix_%C5%81%C3%B3d%C5%BA%2C_Poland.jpg/960px-Gabi%2C_Grand_Prix_%C5%81%C3%B3d%C5%BA%2C_Poland.jpg",
      credit: "Zorro2212 · CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Gabi,_Grand_Prix_%C5%81%C3%B3d%C5%BA,_Poland.jpg",
    },
    {
      name: "Tijana Bošković",
      team: "Serbia national team",
      category: "Opposite hitter",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/2016-12-14_Tijana_Boskovic_by_Sandro_Halank_%28medium_shot%29.jpg/960px-2016-12-14_Tijana_Boskovic_by_Sandro_Halank_%28medium_shot%29.jpg",
      credit: "Sandro Halank · CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:2016-12-14_Tijana_Boskovic_by_Sandro_Halank_(medium_shot).jpg",
    },
    {
      name: "Wilfredo León",
      team: "Poland national team",
      category: "Outside hitter",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/20240701_Wilfredo_Leon.jpg/960px-20240701_Wilfredo_Leon.jpg",
      credit: "Mlaud · CC BY 4.0",
      source: "https://commons.wikimedia.org/wiki/File:20240701_Wilfredo_Leon.jpg",
    },
    {
      name: "Earvin Ngapeth",
      team: "France national team",
      category: "Outside hitter",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Earvin_NGAPETH.JPG/960px-Earvin_NGAPETH.JPG",
      credit: "Nula Anna Kłeczek · CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Earvin_NGAPETH.JPG",
    },
    {
      name: "Yūji Nishida",
      team: "Japan national team",
      category: "Opposite hitter",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Y%C5%ABji_Nishida_%28Legavolley_2021%29.png/960px-Y%C5%ABji_Nishida_%28Legavolley_2021%29.png",
      credit: "Lega Pallavolo Serie A · CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Y%C5%ABji_Nishida_(Legavolley_2021).png",
    },
  ];
  const internationalVolleyballClubs = [
    {
      name: "VakıfBank Spor Kulübü",
      detail: "Istanbul club competing in Türkiye's top women's league and European competitions.",
      href: "https://www.vakifbanksporkulubu.com/en/",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Logo_Vak%C4%B1fBank_Spor_Kul%C3%BCb%C3%BC.jpg",
      imageCredit: "Superplástico · CC BY-SA 4.0",
      imageSource: "https://commons.wikimedia.org/wiki/File:Logo_Vak%C4%B1fBank_Spor_Kul%C3%BCb%C3%BC.jpg",
    },
    {
      name: "Sir Safety Perugia",
      detail: "Italian men's club and regular competitor in the CEV Champions League.",
      href: "https://www.sirsafetyperugia.it/",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Sir_Safety_Umbria_Volley_Perugia_-_wordmark.png",
      imageCredit: "Sir Safety Umbria Volley Perugia · Public domain",
      imageSource: "https://commons.wikimedia.org/wiki/File:Sir_Safety_Umbria_Volley_Perugia_-_wordmark.png",
    },
    {
      name: "ZAKSA Kędzierzyn-Koźle",
      detail: "Polish men's club with multiple CEV Champions League titles.",
      href: "https://zaksa.pl/",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Logo_ZAKSA_K%C4%99dzierzyn-Ko%C5%BAle.jpg/960px-Logo_ZAKSA_K%C4%99dzierzyn-Ko%C5%BAle.jpg",
      imageCredit: "Krzysio.szubzda.1 · CC BY-SA 4.0",
      imageSource: "https://commons.wikimedia.org/wiki/File:Logo_ZAKSA_K%C4%99dzierzyn-Ko%C5%BAle.jpg",
    },
  ];
  const internationalVolleyballNationalTeams = [
    { name: "Italy", code: "it" },
    { name: "Brazil", code: "br" },
    { name: "Serbia", code: "rs" },
    { name: "Poland", code: "pl" },
    { name: "France", code: "fr" },
    { name: "Japan", code: "jp" },
  ];
  const internationalVolleyballFocus = [
    {
      title: "Serve and receive",
      detail: "A strong serve can disrupt the opposing team's first contact and limit its attacking options.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Bardia_Saadat_vs_Bulgaria%2C_2021_FIVB_Volleyball_Men%27s_Nations_League.jpg/960px-Bardia_Saadat_vs_Bulgaria%2C_2021_FIVB_Volleyball_Men%27s_Nations_League.jpg",
      imageAlt: "Bardia Saadat and Bulgaria contest a rally at the 2021 FIVB Volleyball Nations League",
      imageCredit: {
        credit: "Fars News Agency · CC BY 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Bardia_Saadat_vs_Bulgaria,_2021_FIVB_Volleyball_Men%27s_Nations_League.jpg",
      },
    },
    {
      title: "The net battle",
      detail: "Setters, attackers and blockers read the play to create or close attacking lanes.",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Rogers_Spike%2C_2008_Summer_Olympics_beach_volleyball.jpg",
      imageAlt: "A player spikes the ball during the 2008 Olympic beach volleyball competition",
      imageCredit: {
        credit: "Craig Maccubbin · CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Rogers_Spike,_2008_Summer_Olympics_beach_volleyball.jpg",
      },
    },
    {
      title: "Defensive coverage",
      detail: "Digging and court coverage keep rallies alive and give teams another chance to attack.",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Player_of_Osasco_Voleibol_Clube_-_WCWC_2014.jpg",
      imageAlt: "Osasco player in action at the 2014 Women's Club World Championship",
      imageCredit: {
        credit: "Dominique Schreckling · CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Player_of_Osasco_Voleibol_Clube_-_WCWC_2014.jpg",
      },
    },
  ];
  const competitionFocus = profile.regionalFocus
    ? (domestic ? profile.regionalFocus.ghana : profile.regionalFocus.international) ?? profile.focus
    : isVolleyball && section === "international-volleyball"
      ? internationalVolleyballFocus
      : profile.focus;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      {!isVolleyballNewsPage && <section className="relative isolate overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950">
        {heroImage && <img src={heroImage} alt={isCricket ? domestic ? "Ground staff preparing the crease during the 2023 African Games cricket tournament in Accra" : "The Melbourne Cricket Ground during the 2020 ICC Women's T20 World Cup Final between Australia and India" : isVolleyball ? `${domestic ? "Ghanaian" : "International"} volleyball team in competition` : isTennis ? `${domestic ? "Ghanaian" : "International"} tennis players on court` : isBoxing ? `${domestic ? "Ghanaian" : "International"} boxers competing in the ring` : isAthletics ? `${domestic ? "Ghanaian" : "International"} athletics competition on the track` : isF1 ? section === "f1-drivers" ? "Formula 1 driver on track" : section === "f1-teams" ? "Formula 1 cars during a Grand Prix" : section === "f1-news" ? "Formula 1 qualifying action" : "A Formula 1 car racing at the Singapore Grand Prix" : domestic ? "Ghana's Spintex Knights basketball team celebrating qualification" : "Basketball players competing at the rim"} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />}
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
        {heroAttribution && <p className="mx-auto max-w-7xl px-4 pb-5 text-xs text-gray-300 sm:px-6 lg:px-8">
          Hero photo: <a href={heroAttribution.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{heroAttribution.credit}</a>
          {" · "}<a href={heroAttribution.licenseHref} target="_blank" rel="noreferrer" className="underline hover:text-white">{heroAttribution.license}</a>
        </p>}
        {!heroAttribution && heroPhotoCredit && <p className="mx-auto max-w-7xl px-4 pb-5 text-xs text-gray-300 sm:px-6 lg:px-8">
          Hero photo: <a href={heroPhotoCredit.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{heroPhotoCredit.credit}</a>
        </p>}
      </section>}

      {!isVolleyballNewsPage && (isBasketball ? (
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
      ) : isF1 && section !== "f1-general" ? null : (
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
      ))}

      {isF1 && section === "f1-drivers" && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">2026 Formula 1 grid</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Formula 1 drivers</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">The current 2026 championship grid. Driver profiles link to Formula 1 for official biographies, statistics and season updates.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {F1_DRIVERS.map((driver) => (
              <a key={driver.href} href={driver.href} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-white/10 bg-black transition hover:border-red-500/60">
                <img src={driver.image} alt={driver.name} loading="lazy" className="h-64 w-full bg-gradient-to-br from-zinc-800 to-black object-cover object-top" />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">{driver.team}</p>
                  <h3 className="mt-2 text-xl font-black text-white">{driver.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{driver.nationality}</p>
                  <span className="mt-4 inline-flex text-xs font-bold text-gray-300 underline decoration-white/30 underline-offset-4 group-hover:text-white">Official F1 driver profile ↗</span>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs text-gray-500">Line-up verified against the <a href="https://www.formula1.com/en/drivers" target="_blank" rel="noreferrer" className="underline hover:text-white">official Formula 1 driver list</a>.</p>
        </div>
      </section>}

      {isF1 && section === "f1-teams" && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">2026 Formula 1 constructors</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Teams on the F1 grid</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">The eleven teams competing in the 2026 FIA Formula One World Championship. Follow each official F1 team profile for current information.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {F1_TEAMS.map((team) => (
              <a key={team.href} href={team.href} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-white/10 bg-black transition hover:border-red-500/60">
                <img src={team.image} alt={`${team.name} 2026 Formula 1 car`} loading="lazy" className="h-48 w-full bg-gradient-to-br from-zinc-800 to-black object-contain" />
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">2026 constructor</p>
                  <h3 className="mt-2 text-2xl font-black text-white">{team.name}</h3>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wider text-gray-500">Drivers</p>
                  <p className="mt-2 text-sm leading-6 text-gray-300">{team.drivers.join(" · ")}</p>
                  <span className="mt-5 inline-flex text-xs font-bold text-gray-300 underline decoration-white/30 underline-offset-4 group-hover:text-white">Official F1 team profile ↗</span>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs text-gray-500">Team list and line-ups verified against the <a href="https://www.formula1.com/en/teams" target="_blank" rel="noreferrer" className="underline hover:text-white">official Formula 1 teams page</a>.</p>
        </div>
      </section>}

      {isF1 && section === "f1-news" && <InternationalSportsNews category="Formula 1" />}
      {isVolleyball && section === "volleyball-news" && <VolleyballNews />}

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

      {isAthletics && (section === "ghana-athletics" || section === "international-athletics") && <>
        <section className="border-y border-white/10 bg-[#080808]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{domestic ? "Athletics in Ghana" : "Athletics around the world"}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
              A visual guide to the moments, disciplines and team work that shape a meet.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(domestic ? ghanaAthleticsGallery : internationalAthleticsGallery).map((moment) => (
                <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                  <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="p-5">
                    <h3 className="font-black">{moment.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                    <p className="mt-3 text-xs leading-5 text-gray-500">
                      Photo: <a href={moment.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.credit}</a>
                      {" · "}<a href={moment.licenseHref} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.license}</a>
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">Captions identify the athletes, discipline and competition shown. Photo links open the source and license information.</p>
          </div>
        </section>

        <section className="border-b border-white/10 bg-black">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Athletes to follow</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">{domestic ? "Ghanaian athletes" : "International athletes"}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">Official World Athletics athlete pages and search results provide discipline, competition results and personal-best information.</p>
              <div className="mt-6 grid gap-3">
                {(domestic ? ghanaAthleticsPlayers : internationalAthleticsPlayers).map((player) => (
                  <article key={player.name} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition hover:border-red-500/60">
                    <img src={player.image} alt={`${player.name} competing in ${player.discipline}`} loading="lazy" className="h-52 w-full object-cover" />
                    <div className="p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">{player.discipline}</p>
                      <h3 className="mt-2 text-lg font-black text-white">{player.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-400">{player.detail}</p>
                      <a href={player.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-gray-300 underline decoration-white/30 underline-offset-4 hover:text-white">View World Athletics profile ↗</a>
                      <p className="mt-3 text-xs leading-5 text-gray-500">
                        Photo: <a href={player.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{player.credit}</a>
                        {" · "}<a href={player.licenseHref} target="_blank" rel="noreferrer" className="underline hover:text-white">{player.license}</a>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Governing bodies</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">{domestic ? "Organizations in Ghana" : "The global organization"}</h2>
              <div className="mt-6 grid gap-3">
                {(domestic
                  ? [
                    { name: "Ghana Athletics Association", detail: "Listed among Ghana's recognized sporting associations by the National Sports Authority.", href: "https://sportsauthority.gov.gh/association/", source: "National Sports Authority" },
                    { name: "World Athletics", detail: "The international governing body for athletics and the source for official athlete profiles and competition information.", href: "https://worldathletics.org/organisation/our-organisation", source: "World Athletics" },
                  ]
                  : [
                    { name: "World Athletics", detail: "The international governing body sets the rules, recognizes world records and organizes global championships and series events.", href: "https://worldathletics.org/organisation/our-organisation", source: "Official organization" },
                    { name: "World Athletics competition calendar", detail: "Browse the official calendar of international athletics competitions.", href: "https://worldathletics.org/competitions", source: "Official calendar" },
                  ]
                ).map((organization) => (
                  <a key={organization.name} href={organization.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-red-500/60">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">{organization.source}</p>
                    <h3 className="mt-2 text-lg font-black text-white">{organization.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{organization.detail}</p>
                    <span className="mt-4 inline-flex text-xs font-bold text-gray-300 underline decoration-white/30 underline-offset-4 group-hover:text-white">Visit official source ↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </>}

      {isF1 && section === "f1-general" && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Formula 1 in action</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">Race starts, pit-lane strategy and cars on circuit capture the pace and teamwork of a Grand Prix weekend.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formulaOneGallery.map((moment) => (
              <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <h3 className="font-black">{moment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                  <p className="mt-3 text-xs leading-5 text-gray-500">
                    Photo: <a href={moment.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.credit}</a>
                    {" · "}<a href={moment.licenseHref} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.license}</a>
                  </p>
                </div>
              </article>
            ))}
          </div>
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

      {isVolleyball && section === "ghana-volleyball" && <>
        <section className="border-y border-white/10 bg-[#080808]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Volleyball moments from Ghana</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">From a continental club result to school and youth competition, these GNA reports capture milestones across the local game.</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ghanaVolleyballGallery.map((moment) => <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <h3 className="font-black">{moment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                  <a href={moment.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-gray-500 underline hover:text-white">Photo and report: {moment.credit}</a>
                </div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-black">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Players and clubs</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Ghana volleyball names to know</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">GNA's June 2025 report named these athletes for Ghana's senior and under-21 beach-volleyball teams. Team affiliations reflect that report and are not a current roster.</p>

            <h3 className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Players named in Team Ghana</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ghanaVolleyballPlayers.map((player) => <article key={player.name} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                {"image" in player && <img src={player.image} alt={`${player.name} playing volleyball`} loading="lazy" className="h-64 w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-105" />}
                <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">{player.category}</p>
                <h4 className="mt-2 text-lg font-black">{player.name}</h4>
                <p className="mt-1 text-sm text-gray-400">{player.team}</p>
                </div>
              </article>)}
            </div>

            <h3 className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Clubs and team affiliations</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">This selection combines clubs named in GNA coverage with service teams listed as player affiliations.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ghanaVolleyballTeams.map((team) => <a key={team.name} href={team.source} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-red-500/60">
                {"image" in team && <img src={team.image} alt={`${team.name} crest`} loading="lazy" className="mb-4 h-20 w-20 rounded-full bg-white object-contain p-1" />}
                {team.name === "Labadi VC" && <div aria-label="Labadi VC placeholder badge, not an official crest" className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-black tracking-wider text-gray-300">LV</div>}
                <h4 className="font-black">{team.name}</h4>
                <p className="mt-2 text-sm leading-6 text-gray-400">{team.detail}</p>
                <span className="mt-4 inline-flex text-xs font-bold text-red-400 underline">Read GNA report <span aria-hidden="true" className="ml-1">↗</span></span>
              </a>)}
            </div>
          </div>
        </section>
      </>}

      {isVolleyball && section === "international-volleyball" && <>
        <section className="border-y border-white/10 bg-[#080808]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Volleyball around the world</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">International club competition, national-team matchups and women's volleyball from across the global game.</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {internationalVolleyballGallery.map((moment) => <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <h3 className="font-black">{moment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                  <a href={moment.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-gray-500 underline hover:text-white">Photo: {moment.credit}</a>
                </div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-black">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Players and clubs</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">International names and teams to know</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">A selection of notable players representing their national sides, with club and national-team affiliations shown separately.</p>

            <h3 className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-gray-400">International players</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {internationalVolleyballPlayers.map((player) => <article key={player.name} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <img src={player.image} alt={`${player.name}, international volleyball player`} loading="lazy" className="h-64 w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">{player.category}</p>
                  <h4 className="mt-2 text-lg font-black">{player.name}</h4>
                  <p className="mt-1 text-sm text-gray-400">{player.team}</p>
                  <a href={player.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-gray-500 underline hover:text-white">Photo: {player.credit}</a>
                </div>
              </article>)}
            </div>

            <h3 className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-gray-400">International clubs</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {internationalVolleyballClubs.map((team) => <article key={team.name} className="group rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-red-500/60">
                <a href={team.href} target="_blank" rel="noreferrer" className="block">
                  <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl bg-white p-3">
                    <img src={team.image} alt={`${team.name} club logo`} loading="lazy" className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105" />
                  </div>
                  <h4 className="mt-4 font-black">{team.name}</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{team.detail}</p>
                </a>
                <a href={team.imageSource} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-gray-500 underline hover:text-white">Logo: {team.imageCredit}</a>
              </article>)}
            </div>

            <h3 className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-gray-400">National-team affiliations</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">The featured athletes' national sides, represented by their country flags.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {internationalVolleyballNationalTeams.map((team) => <article key={team.code} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-4 text-center">
                <div className="flex h-20 items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img src={`https://flagcdn.com/w160/${team.code}.png`} alt={`${team.name} flag`} loading="lazy" className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-gray-200">{team.name}</h4>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-red-400">National team</p>
              </article>)}
            </div>
          </div>
        </section>
      </>}

      {isCricket && domestic && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Cricket in Accra</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">Scenes from the men's cricket tournament at the 2023 African Games, hosted in Accra. The gallery includes visiting teams as well as moments from the local venue.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ghanaCricketGallery.map((moment) => <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-5">
                <h3 className="font-black">{moment.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                <p className="mt-3 text-xs text-gray-500">
                  Photo: <a href={moment.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.credit}</a>
                  {" · "}<a href={moment.licenseHref} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.license}</a>
                </p>
              </div>
            </article>)}
          </div>
        </div>
      </section>}

      {isCricket && !domestic && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Matchday gallery</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Cricket around the world</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">From Test matches to international T20 qualifiers, explore teams and venues from across the global game.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {internationalCricketGallery.map((moment) => <article key={moment.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <img src={moment.image} alt={moment.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-5">
                <h3 className="font-black">{moment.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{moment.detail}</p>
                <p className="mt-3 text-xs text-gray-500">
                  Photo: <a href={moment.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.credit}</a>
                  {" · "}<a href={moment.licenseHref} target="_blank" rel="noreferrer" className="underline hover:text-white">{moment.license}</a>
                </p>
              </div>
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

      {!isVolleyballNewsPage && (!isF1 || section === "f1-general") && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Inside the competition</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Moments that shape {profile.name}</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {competitionFocus.map((item, index) => (
              <article key={item.title} className={`group relative flex ${item.image ? "min-h-80" : "min-h-56"} flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6`}>
                {item.image && <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                {item.image && <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/10" />}
                <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-6 select-none text-8xl font-black italic text-white/[0.04]">0{index + 1}</span>
                <div className="relative">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{profile.name}</p>
                  <h3 className="mt-3 text-xl font-black">{item.title}</h3>
                  <p className={`mt-2 text-sm leading-6 ${item.image ? "text-gray-200" : "text-gray-400"}`}>{item.detail}</p>
                  {item.imageCredit && <a href={item.imageCredit.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-fit text-xs text-gray-300 underline decoration-white/40 underline-offset-2 hover:text-white">Photo: {item.imageCredit.credit}</a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {section !== "f1-news" && !isVolleyballNewsPage && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">The {newsDesk} desk</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Latest {pageTitle} stories</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">{isF1 ? "Formula 1 stories are reviewed by the newsroom before they are published." : `News and match updates are published in the dedicated ${domestic ? "Ghana" : "international"} news desk.`}</p>
          </div>
          <button type="button" onClick={() => onNavigate(newsPage)} className="shrink-0 rounded-xl bg-red-600 px-5 py-3 text-sm font-black transition hover:bg-red-700">Go to {newsDesk}<span aria-hidden="true" className="ml-2">→</span></button>
        </div>
      </section>}

      {isVolleyballNewsPage && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Official sources</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Explore {pageTitle}</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {officialSources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black p-5 transition hover:border-red-500/60">
                <span className="text-sm font-bold leading-6 text-gray-200 group-hover:text-white">{source.label}</span>
                <span aria-hidden="true" className="shrink-0 text-lg text-red-500 transition group-hover:translate-x-1">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>}

      {!isVolleyballNewsPage && <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">More {profile.name}</p>
          <h2 className="mt-3 text-2xl font-black">Explore related sections</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {relatedSections.map((item) => (
              <button key={item.page} type="button" onClick={() => onNavigate(item.page)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-gray-300 transition hover:border-red-500 hover:text-white">{item.label}</button>
            ))}
          </div>
        </div>
      </section>}

      <SportsDeskFooter desk={`${profile.name} Desk`} description={`Coverage of ${profile.name.toLowerCase()} in Ghana and around the world.`} onNavigate={onNavigate} />
    </main>
  );
}
