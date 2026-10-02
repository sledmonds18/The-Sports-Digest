    "use client";

    import { useState, useEffect } from "react";
    import { Logo } from "./Logo";

    import {
    SportsMenuScreens,
    type MenuScreen,
    } from "./SportsMenuScreens";

    interface NavigationProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    menuScreen: MenuScreen;
    onMenuScreenChange: (screen: MenuScreen) => void;
    }

    export function Navigation({
    currentPage,
    onNavigate,
    menuScreen,
    onMenuScreenChange,
    }: NavigationProps) {
    const [menu, setMenu] = useState(false);
    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        setScroll(window.scrollY > 15);
        };

        window.addEventListener("scroll", handleScroll, {
        passive: true,
        });

        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleNavigate = (page: string) => {
        onNavigate(page);

        setMenu(false);
        onMenuScreenChange("main");

        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });
    };

    const navItems = [
        ["home", "Home"],
        ["about", "About"],
        ["contact", "Contact"],
    ] as const;

    return (
        <>
        {/* =========================
            NAVBAR
        ========================== */}
        <nav
            className={`nav${scroll ? " sc" : ""}`}
            aria-label="Main navigation"
        >
            <Logo onClick={() => handleNavigate("home")} />

            {/* Desktop Navigation */}
            <div className="dlinks" role="menubar">
            {navItems.map(([page, label]) => (
                <a
                key={page}
                className={`nl${
                    currentPage === page ? " act" : ""
                }`}
                onClick={() => handleNavigate(page)}
                role="menuitem"
                aria-current={
                    currentPage === page ? "page" : undefined
                }
                >
                {label}
                </a>
            ))}
            </div>

            {/* Hamburger */}
            <button
            className={`hbg${menu ? " op" : ""}`}
            onClick={() => {
                setMenu((open) => !open);
                onMenuScreenChange("main");
            }}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mmenu"
            >
            <span />
            <span />
            <span />
            </button>
        </nav>

        {/* =========================
            MOBILE MENU
        ========================== */}
        <div
            id="mmenu"
            className={`mmenu${menu ? " op" : ""}`}
            role="navigation"
            aria-label="Mobile navigation"
        >
            {/* =========================
                MAIN MENU
            ========================== */}
            {menuScreen === "main" && (
            <div className="sports-main-menu">

                {/* Home */}
                <button
                className="menu-link"
                onClick={() => handleNavigate("home")}
                tabIndex={menu ? 0 : -1}
                >
                HOME
                </button>

                {/* Sports */}
                <div className="sports-menu-list">

                {/* Football */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("football")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    ⚽ Football
                </button>

                {/* Basketball */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("basketball")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    🏀 Basketball
                </button>

                {/* Tennis */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("tennis")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    🎾 Tennis
                </button>

                {/* Boxing */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("boxing")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    🥊 Boxing
                </button>

                {/* Athletics */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("athletics")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    🏃 Athletics
                </button>

                {/* Formula 1 */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("f1")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    🏎 Formula 1
                </button>

                {/* Volleyball */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("volleyball")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    🏐 Volleyball
                </button>

                {/* Cricket */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("cricket")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    🏏 Cricket
                </button>

                {/* American Football */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("american-football")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    🏈 American Football
                </button>

                {/* Baseball */}
                <button
                    className="sports-menu-item"
                    onClick={() =>
                    onMenuScreenChange("baseball")
                    }
                    tabIndex={menu ? 0 : -1}
                >
                    ⚾ Baseball
                </button>
                </div>

                {/* =========================
                    OTHER SECTIONS
                ========================== */}

                {/* News */}
                <button
                className="menu-link"
                onClick={() =>
                    onMenuScreenChange("news")
                }
                tabIndex={menu ? 0 : -1}
                >
                📰 NEWS
                </button>

                {/* Scores & Results */}
                <button
                className="menu-link"
                onClick={() =>
                    handleNavigate("results")
                }
                tabIndex={menu ? 0 : -1}
                >
                📊 SCORES & RESULTS
                </button>

                {/* Trending */}
                <button
                className="menu-link"
                onClick={() =>
                    handleNavigate("trending")
                }
                tabIndex={menu ? 0 : -1}
                >
                🔥 TRENDING
                </button>


                {/* About */}
                <button
                className="menu-link"
                onClick={() =>
                    handleNavigate("about")
                }
                tabIndex={menu ? 0 : -1}
                >
                ABOUT
                </button>

                {/* Contact */}
                <button
                className="menu-link"
                onClick={() =>
                    handleNavigate("contact")
                }
                tabIndex={menu ? 0 : -1}
                >
                CONTACT
                </button>

                {/* Subscribe */}
                <button
                className="mcta"
                onClick={() =>
                    handleNavigate("contact")
                }
                tabIndex={menu ? 0 : -1}
                >
                SUBSCRIBE FREE
                </button>
            </div>
            )}

            {/* =========================
                SECONDARY SPORTS MENUS
            ========================== */}

            {menuScreen !== "main" && (
            <SportsMenuScreens
                menuScreen={menuScreen}
                onScreenChange={onMenuScreenChange}
                onNavigate={handleNavigate}
            />
            )}
        </div>
        </>
    );
    }