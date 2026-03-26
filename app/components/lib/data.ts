    /* ─── DATA ──────────────────────────────────────────────────── */

    export const ARTICLES = [
    { id:1, cat:"Football",   tag:"Analysis",      title:"The Tactical Revolution Reshaping Modern Pressing Systems",   excerpt:"How elite managers are reinventing high-press structures, turning defensive work into lethal attacking transitions across Europe's top leagues.",   author:"Marcus Osei",    date:"Mar 21, 2026", rt:"8 min", img:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80" },
    { id:2, cat:"Basketball", tag:"Feature",        title:"Analytics vs. Instinct: The New War for the NBA's Soul",      excerpt:"As front offices lean deeper into data, veteran coaches push back — and the tension is defining an entire generation of basketball.",               author:"Priya Nkosi",    date:"Mar 19, 2026", rt:"6 min", img:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80" },
    { id:3, cat:"Athletics",  tag:"Long Read",      title:"Sub-Two-Hour Marathon: Africa's Next Frontier",               excerpt:"A new wave of East African runners are training at altitude for a historic attempt that could permanently redefine human endurance limits.",       author:"Kwame Darko",    date:"Mar 17, 2026", rt:"5 min", img:"https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80" },
    { id:4, cat:"Tennis",     tag:"Preview",        title:"The Changing of the Guard on Clay Courts",                    excerpt:"Emerging names are ending a decade-long dynasty on the red clay circuit ahead of this season's Grand Slam tournament in Paris.",                  author:"Sophia Laurent", date:"Mar 15, 2026", rt:"7 min", img:"https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80" },
    { id:5, cat:"Cricket",    tag:"Investigation",  title:"T20 Globalization and the Franchise Gold Rush",               excerpt:"Billionaires, broadcasters, and board politics are reshaping franchise cricket in a new era spanning six continents and dozens of new leagues.",   author:"Arjun Mehta",    date:"Mar 13, 2026", rt:"9 min", img:"https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80" },
    { id:6, cat:"Motorsport", tag:"Feature",        title:"Sustainable Fuel, Faster Laps: Formula 1's Green Paradox",   excerpt:"Formula 1's push for net-zero by 2030 is running headlong into teams chasing hundredths of a second on circuits around the world.",                author:"Elena Voss",     date:"Mar 10, 2026", rt:"6 min", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
    ];

    export const CATS = ["All","Football","Basketball","Athletics","Tennis","Cricket","Motorsport"];

    export const TICKER = ["⚽ Chelsea 2–1 Arsenal · PL GW29","🏀 Lakers 114–108 Celtics · NBA","🎾 Alcaraz QF Roland Garros","🏈 Chiefs blockbuster WR trade","🏏 India 287/4 vs South Africa","🏎️ Verstappen pole Bahrain GP"];

    export const TEAM = [
    { name:"Emmanuel Asante", role:"Founder & Editor-in-Chief",   bio:"15 years covering global sport. Former BBC Sport Africa correspondent.",         img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { name:"Marcus Osei",     role:"Football Correspondent",       bio:"UEFA-accredited. Covers Champions League, AFCON and the Premier League.",         img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
    { name:"Priya Nkosi",     role:"Basketball & Olympics Editor", bio:"Ringside in three Olympics. NBA Finals press credentials since 2016.",            img:"https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80" },
    { name:"Elena Voss",      role:"Motorsport & Cycling",         bio:"Formula 1 paddock regular. Covered seven consecutive Tours de France.",           img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
    ];

    export const SEO = {
    home:     { title:"The Sports Digest — Africa's Premier Sports Journalism Platform",    description:"Breaking sports news, in-depth analysis, and investigative features covering football, basketball, athletics, tennis, cricket and motorsport from Accra to the world.",   keywords:"sports news africa, football analysis, basketball, athletics, cricket, motorsport, sports journalism ghana" },
    about:    { title:"About The Sports Digest — Our Story, Mission & Award-Winning Team", description:"Learn about The Sports Digest, our award-winning correspondents, and our mission to tell the real stories behind the game across 12+ sports worldwide.",                  keywords:"sports digest about, sports journalists Africa, sports editorial team accra ghana" },
    articles: { title:"Features & Analysis — The Sports Digest",                           description:"Long-form sports features, investigative journalism and expert tactical analysis from The Sports Digest's award-winning correspondents.",                                   keywords:"sports features, sports analysis, long form sports writing, sports investigation africa" },
    contact:  { title:"Contact The Sports Digest — Pitch, Press & Partnerships",           description:"Reach The Sports Digest editorial team for story pitches, press accreditation, advertising and partnership enquiries. Based in Accra, Ghana.",                             keywords:"contact sports digest, sports media partnership, press accreditation ghana sports" },
    };

    export interface Article {
    id: number;
    cat: string;
    tag: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    rt: string;
    img: string;
    }

    export interface TeamMember {
    name: string;
    role: string;
    bio: string;
    img: string;
    }

    export interface SEOData {
    title: string;
    description: string;
    keywords: string;
    }
