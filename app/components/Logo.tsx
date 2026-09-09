"use client";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <img
      src="/logo-app.png"
      alt="The Sports Digest"
      className="h-8 w-auto"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    />
  );
}