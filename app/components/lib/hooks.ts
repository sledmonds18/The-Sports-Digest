    "use client";

    import { useEffect } from "react";
    import type { SEOData } from "./data";

    /* ─── SEO HEAD MANAGER ──────────────────────────────────────── */
    export function useSEO({ title, description, keywords }: SEOData) {
    useEffect(() => {
        document.title = title;
        const set = (name: string, content: string, prop = false) => {
        const attr = prop ? "property" : "name";
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
            el = document.createElement("meta");
            el.setAttribute(attr, name);
            document.head.appendChild(el);
        }
        el.setAttribute("content", content);
        };
        set("description", description);
        set("keywords", keywords);``
        set("robots", "index, follow");
        set("viewport", "width=device-width, initial-scale=1");
        set("og:title", title, true);
        set("og:description", description, true);
        set("og:type", "website", true);
        set("og:image", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200", true);
        set("twitter:card", "summary_large_image");
        set("twitter:title", title);
        set("twitter:description", description);
        let can = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
        if (!can) {
        can = document.createElement("link") as HTMLLinkElement;
        can.rel = "canonical";
        document.head.appendChild(can);
        }
        can.href = typeof window !== "undefined" ? window.location.href : "";
    }, [title, description, keywords]);
    }
