    "use client";

    export type MenuScreen =
    | "main"
    | "football"
    | "ghana"
    | "international"
    | "basketball"
    | "tennis"
    | "boxing"
    | "athletics"
    | "f1"
    | "volleyball"
    | "cricket"
    | "american-football"
    | "baseball"
    | "news"
    | "features";

    interface SportsMenuScreensProps {
    menuScreen: MenuScreen;
    onScreenChange: (screen: MenuScreen) => void;
    onNavigate: (page: string) => void;
    }

    export function SportsMenuScreens({
    menuScreen,
    onScreenChange,
    onNavigate,
    }: SportsMenuScreensProps) {
    const handleNavigate = (page: string) => {
        onNavigate(page);
        onScreenChange("main");
    };

    const goBack = () => {
        onScreenChange("main");
    };

    const goBackToFootball = () => {
        onScreenChange("football");
    };

    return (
        <>
        {/* =========================
            FOOTBALL
        ========================== */}
        {menuScreen === "football" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Football
            </button>

            <button
                className="menu-parent"
                onClick={() => onScreenChange("ghana")}
            >
                <span>🇬🇭 Inside Ghana</span>
                <span>›</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => onScreenChange("international")}
            >
                <span>🌍 International</span>
                <span>›</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("transfers")}
            >
                <span>🔥 Transfers</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("live")}
            >
                <span>🔴 Live Football</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("fixtures")}
            >
                <span>📅 Fixtures</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("results")}
            >
                <span>✅ Results</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("standings")}
            >
                <span>📈 Standings</span>
            </button>
            </div>
        )}

        {/* =========================
            INSIDE GHANA
        ========================== */}
        {menuScreen === "ghana" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBackToFootball}>
                ← Inside Ghana
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-premier-league")}
            >
                <span>⚽ Ghana Premier League</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("black-stars")}
            >
                <span>⭐ Black Stars</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("black-queens")}
            >
                <span>👑 Black Queens</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-fa-cup")}
            >
                <span>🏆 Ghana FA Cup</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("division-one")}
            >
                <span>⚽ Division One League</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-football")}
            >
                <span>📰 Ghana Football News</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-sports")}
            >
                <span>📰 Latest Ghana Sports News</span>
            </button>
            </div>
        )}

        {/* =========================
            INTERNATIONAL FOOTBALL
        ========================== */}
        {menuScreen === "international" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBackToFootball}>
                ← International
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("premier-league")}
            >
                <span>⚽ Premier League</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("champions-league")}
            >
                <span>🏆 Champions League</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("la-liga")}
            >
                <span>🇪🇸 La Liga</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("bundesliga")}
            >
                <span>🇩🇪 Bundesliga</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("serie-a")}
            >
                <span>🇮🇹 Serie A</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ligue-1")}
            >
                <span>🇫🇷 Ligue 1</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("mls")}
            >
                <span>🇺🇸 MLS</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("international-football")}
            >
                <span>🌍 International Football</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("fifa")}
            >
                <span>🏆 FIFA</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("uefa")}
            >
                <span>🏆 UEFA</span>
            </button>
            </div>
        )}

        {/* =========================
            BASKETBALL
        ========================== */}
        {menuScreen === "basketball" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Basketball
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-basketball")}
            >
                <span>🇬🇭 Inside Ghana</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("international-basketball")}
            >
                <span>🌍 International</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("nba")}
            >
                <span>🏀 NBA</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("wnba")}
            >
                <span>🏀 WNBA</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ncaa")}
            >
                <span>🎓 NCAA</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("euroleague")}
            >
                <span>🏆 EuroLeague</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("fiba")}
            >
                <span>🌍 FIBA</span>
            </button>
            </div>
        )}

        {/* =========================
            TENNIS
        ========================== */}
        {menuScreen === "tennis" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Tennis
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-tennis")}
            >
                <span>🇬🇭 Inside Ghana</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("international-tennis")}
            >
                <span>🌍 International</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("atp")}
            >
                <span>🎾 ATP</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("wta")}
            >
                <span>🎾 WTA</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("grand-slams")}
            >
                <span>🏆 Grand Slams</span>
            </button>
            </div>
        )}

        {/* =========================
            BOXING
        ========================== */}
        {menuScreen === "boxing" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Boxing
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-boxing")}
            >
                <span>🇬🇭 Inside Ghana</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("international-boxing")}
            >
                <span>🌍 International</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("boxing-news")}
            >
                <span>🥊 Boxing News</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("upcoming-fights")}
            >
                <span>🔥 Upcoming Fights</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("fight-results")}
            >
                <span>✅ Fight Results</span>
            </button>
            </div>
        )}

        {/* =========================
            ATHLETICS
        ========================== */}
        {menuScreen === "athletics" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Athletics
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-athletics")}
            >
                <span>🇬🇭 Inside Ghana</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("international-athletics")}
            >
                <span>🌍 International</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("track-field")}
            >
                <span>🏃 Track & Field</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("world-athletics")}
            >
                <span>🌍 World Athletics</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("athletics-results")}
            >
                <span>🥇 Results</span>
            </button>
            </div>
        )}

        {/* =========================
            FORMULA 1
        ========================== */}
        {menuScreen === "f1" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Formula 1
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("f1-calendar")}
            >
                <span>🏁 Race Calendar</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("f1-results")}
            >
                <span>✅ Race Results</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("f1-drivers")}
            >
                <span>🏎️ Drivers</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("f1-teams")}
            >
                <span>🏢 Teams</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("f1-standings")}
            >
                <span>📊 Standings</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("f1-news")}
            >
                <span>📰 F1 News</span>
            </button>
            </div>
        )}

        {/* =========================
            VOLLEYBALL
        ========================== */}
        {menuScreen === "volleyball" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Volleyball
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-volleyball")}
            >
                <span>🇬🇭 Inside Ghana</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("international-volleyball")}
            >
                <span>🌍 International</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("volleyball-news")}
            >
                <span>🏐 Volleyball News</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("volleyball-results")}
            >
                <span>✅ Results</span>
            </button>
            </div>
        )}

        {/* =========================
            CRICKET
        ========================== */}
        {menuScreen === "cricket" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Cricket
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-cricket")}
            >
                <span>🇬🇭 Inside Ghana</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("international-cricket")}
            >
                <span>🌍 International</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("cricket-news")}
            >
                <span>🏏 Cricket News</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("icc")}
            >
                <span>🏆 ICC</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("cricket-results")}
            >
                <span>✅ Results</span>
            </button>
            </div>
        )}

        {/* =========================
            AMERICAN FOOTBALL
        ========================== */}
        {menuScreen === "american-football" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← American Football
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("nfl")}
            >
                <span>🏈 NFL</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("super-bowl")}
            >
                <span>🏆 Super Bowl</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("nfl-fixtures")}
            >
                <span>📅 Fixtures</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("nfl-results")}
            >
                <span>✅ Results</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("nfl-standings")}
            >
                <span>📊 Standings</span>
            </button>
            </div>
        )}

        {/* =========================
            BASEBALL
        ========================== */}
        {menuScreen === "baseball" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Baseball
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("mlb")}
            >
                <span>⚾ MLB</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("baseball-fixtures")}
            >
                <span>📅 Fixtures</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("baseball-results")}
            >
                <span>✅ Results</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("baseball-standings")}
            >
                <span>📊 Standings</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("baseball-news")}
            >
                <span>📰 Baseball News</span>
            </button>
            </div>
        )}

        {/* =========================
            NEWS
        ========================== */}
        {menuScreen === "news" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← News
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ghana-news")}
            >
                <span>🇬🇭 Ghana</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("africa-news")}
            >
                <span>🌍 Africa</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("international-news")}
            >
                <span>🌎 International</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("breaking-news")}
            >
                <span>🔥 Breaking News</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("transfers")}
            >
                <span>🔄 Transfers</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("sports-business")}
            >
                <span>💰 Sports Business</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("highlights")}
            >
                <span>🎥 Sports Highlights</span>
            </button>
            </div>
        )}

        {/* =========================
            FEATURES
        ========================== */}
        {menuScreen === "features" && (
            <div className="menu-screen">
            <button className="menu-back" onClick={goBack}>
                ← Features
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("ai-insights")}
            >
                <span>🤖 AI Match Insights</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("match-analysis")}
            >
                <span>📊 Match Analysis</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("polls")}
            >
                <span>🗳️ Polls</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("opinions")}
            >
                <span>💡 Sports Opinions</span>
            </button>

            <button
                className="menu-parent"
                onClick={() => handleNavigate("sports-stories")}
            >
                <span>📚 Sports Stories</span>
            </button>
            </div>
        )}
        </>
    );
    }