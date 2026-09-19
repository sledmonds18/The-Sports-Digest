"use client";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <img
      src="/logo-app 2.png"
      alt="The Sports Digest"
      className="h-3 w-auto"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    />
  );
}
