"use client";

import { useState } from "react";
import { useSEO } from "./components/lib/hooks";
import { SEO } from "./components/lib/data";
import { Articles } from "./components/Ariticle";
import { Toast } from "./components/Toast";


import {
  Navigation,
  Home,
  Contact,
  Ticker,
  Footer,
} from "@/app/components";
import { About } from "./components/About";

export default function SportsDigest() {
  const [page, setPage] = useState<"home" | "about" | "articles" | "contact">("home");
  const [toast, setToast] = useState({ on: false, msg: "" });

  useSEO(SEO[page] || SEO.home);

  const navigate = (p: string) => {
    setPage(p as "home" | "about" | "articles" | "contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (msg: string) => {
    setToast({ on: true, msg });
    setTimeout(() => setToast({ on: false, msg: "" }), 3600);
  };

  return (
    <>
      {/* Skip link */}
      <a href="#mc" style={{ position: "absolute", left: "-9999px" }}>
        Skip to main content
      </a>

      {/* Navigation */}
      <Navigation currentPage={page} onNavigate={navigate} />


      <Ticker />


           {/* Page Content */}
      <div className="page" id="mc">
        {page === "home" && <Home onNavigate={navigate} onToast={showToast} />}
        {page === "about" && <About onNavigate={navigate} onToast={showToast} />}
        {page === "articles" && <Articles onToast={showToast} />}
        {page === "contact" && <Contact onToast={showToast} />}
        <Footer onNavigate={navigate} />
      </div>

      {/* SEO JSON-LD */}
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

      {/* Toast */}
      <Toast message={toast.msg} isOpen={toast.on} />
    </>
  );
}