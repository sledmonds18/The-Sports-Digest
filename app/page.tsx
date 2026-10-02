  "use client";

  import { useState } from "react";
  import { useSEO } from "./components/lib/hooks";
  import { SEO } from "./components/lib/data";

  import {
    Navigation,
    Ticker,
    SportsCategories,
    SportsMenuScreens,
    Home,
    About,
    Articles,
    Contact,
    Footer,
    Toast,
    SportsPage,
    GhanaPremierLeague,
    type MenuScreen,
  } from "./components";


  export default function SportsDigest() {
    /* =========================
      MAIN PAGE
    ========================== */
  const [page, setPage] = useState<
  | "home"
  | "about"
  | "articles"
  | "contact"
  | "ghana-premier-league"
  | "black-stars"
  | "black-queens"
  | "ghana-fa-cup"
  | "division-one"
  | "ghana-football"
  | "ghana-sports"
  | "premier-league"
  | "champions-league"
  | "la-liga"
  | "bundesliga"
  | "serie-a"
  | "ligue-1"
  | "mls"
  | "international-football"
  | "fifa"
  | "uefa"
  | "transfers"
  | "live"
  | "fixtures"
  | "results"
  | "standings"
>("home");
    /* =========================
      SPORTS MENU
    ========================== */
    const [menuScreen, setMenuScreen] =
      useState<MenuScreen>("main");

    /* =========================
      TOAST
    ========================== */
    const [toast, setToast] = useState({
      on: false,
      msg: "",
    });

    /* =========================
      SEO
    ========================== */
    useSEO(
      SEO[page as keyof typeof SEO] || SEO.home
    );

    /* =========================
      MAIN NAVIGATION
    ========================== */
    const navigate = (p: string) => {
  setPage(
    p as
      | "home"
      | "about"
      | "articles"
      | "contact"
      | "ghana-premier-league"
      | "black-stars"
      | "black-queens"
      | "ghana-fa-cup"
      | "division-one"
      | "ghana-football"
      | "ghana-sports"
      | "premier-league"
      | "champions-league"
      | "la-liga"
      | "bundesliga"
      | "serie-a"
      | "ligue-1"
      | "mls"
      | "international-football"
      | "fifa"
      | "uefa"
      | "transfers"
      | "live"
      | "fixtures"
      | "results"
      | "standings"
  );

      /* When a normal page is opened,
        close/reset the sports menu */
      setMenuScreen("main");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    /* =========================
      TOAST
    ========================== */
    const showToast = (msg: string) => {
      setToast({
        on: true,
        msg,
      });

      setTimeout(() => {
        setToast({
          on: false,
          msg: "",
        });
      }, 3600);
    };

    /* =========================
      SPORTS MENU
    ========================== */
    const openSportMenu = (screen: MenuScreen) => {
      setMenuScreen(screen);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return (
      <>
        {/* Skip link */}
        <a
          href="#mc"
          style={{
            position: "absolute",
            left: "-9999px",
          }}
        >
          Skip to main content
        </a>

        {/* =========================
            MAIN NAVIGATION
        ========================== */}
        <Navigation
          currentPage={page}
          onNavigate={navigate}
          menuScreen={menuScreen}
          onMenuScreenChange={setMenuScreen}
        />

        {/* =========================
            LIVE TICKER
        ========================== */}
        <Ticker />

        {/* =========================
            DESKTOP SPORTS CATEGORIES
        ========================== */}
        <SportsCategories
          onSportSelect={openSportMenu}
        />

        {/* =========================
            DESKTOP SPORTS SUB-MENU
        ========================== */}
        {menuScreen !== "main" && (
          <div className="desktop-sport-menu">
            <SportsMenuScreens
              menuScreen={menuScreen}
              onScreenChange={setMenuScreen}
              onNavigate={navigate}
            />
          </div>
        )}

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <div className="page" id="mc">
          {page === "home" && (
            <Home
              onNavigate={navigate}
              onToast={showToast}
            />
          )}

          {page === "about" && (
            <About
              onNavigate={navigate}
              onToast={showToast}
            />
          )}

          {page === "articles" && (
            <Articles onToast={showToast} />
          )}

          {page === "contact" && (
            <Contact onToast={showToast} />
          )}

                {page === "ghana-premier-league" && (
        <GhanaPremierLeague
          onNavigate={navigate}
          onToast={showToast}
        />
      )}

                {!["home", "about", "articles", "contact", "ghana-premier-league"].includes(page) && (
        <SportsPage
          section={page}
          onNavigate={navigate}
          onToast={showToast}
        />
      )}

          <Footer onNavigate={navigate} />
        </div>

        {/* =========================
            STRUCTURED DATA
        ========================== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              name: "The Sports Digest",
              url: "https://thesportsdigest.com",
            }),
          }}
        />

        {/* =========================
            TOAST
        ========================== */}
        <Toast
          message={toast.msg}
          isOpen={toast.on}
        />
      </>
    );
  }