"use client";

import { useState } from "react";

// Team badge with an initials-circle fallback when a crest is missing or fails
// to load. Sized via `className` so callers can shrink it per surface.
export default function TeamCrest({
  name,
  logo,
  className = "h-8 w-8",
}: {
  name?: string;
  logo?: string;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const label = (name || "").trim();
  const initials = label
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (logo && !imageFailed) {
    return (
      <img
        src={logo}
        alt=""
        loading="lazy"
        onError={() => setImageFailed(true)}
        className={`${className} shrink-0 object-contain`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-gray-300`}
    >
      {initials || "?"}
    </span>
  );
}
