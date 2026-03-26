    "use client";

    import { useState, useEffect } from "react";
    import { Logo } from "./Logo";

    interface NavigationProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    }

    export function Navigation({ currentPage, onNavigate }: NavigationProps) {
    const [menu, setMenu] = useState(false);
    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScroll(window.scrollY > 15);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavigate = (page: string) => {
        onNavigate(page);
        setMenu(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const navItems = [
        ["home", "Home"],
        ["about", "About"],
        ["articles", "Features"],
        ["contact", "Contact"],
    ] as const;

    return (
        <>
        <nav className={`nav${scroll ? " sc" : ""}`} aria-label="Main navigation">
            <Logo onClick={() => handleNavigate("home")} />
            <div className="dlinks" role="menubar">
            {navItems.map(([page, label]) => (
                <a
                key={page}
                className={`nl${currentPage === page ? " act" : ""}`}
                onClick={() => handleNavigate(page)}
                role="menuitem"
                aria-current={currentPage === page ? "page" : undefined}
                >
                {label}
                </a>
            ))}
            <button
                className="ncta"
                onClick={() => handleNavigate("contact")}
            >
                Subscribe
            </button>
            </div>
            <button
            className={`hbg${menu ? " op" : ""}`}
            onClick={() => setMenu((o) => !o)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mmenu"
            >
            <span />
            <span />
            <span />
            </button>
        </nav>

        <div
            id="mmenu"
            className={`mmenu${menu ? " op" : ""}`}
            role="navigation"
            aria-label="Mobile navigation"
        >
            {navItems.map(([page, label]) => (
            <a
                key={page}
                className={currentPage === page ? "act" : ""}
                onClick={() => handleNavigate(page)}
                tabIndex={menu ? 0 : -1}
            >
                {label}
            </a>
            ))}
            <button
            className="mcta"
            onClick={() => handleNavigate("contact")}
            tabIndex={menu ? 0 : -1}
            >
            Subscribe Free
            </button>
        </div>
        </>
    );
    }
