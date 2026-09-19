"use client";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <div className="flex h-full w-48 shrink-0 items-center overflow-hidden">
      <img
        src="/logo-app 2.png"
        alt="The Sports Digest"
        className="block max-h-full max-w-full object-contain"
        style={{ cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
      />
    </div>
  );
}