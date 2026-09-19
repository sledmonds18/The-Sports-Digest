"use client";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <div className="flex h-14 w-48 items-center overflow-hidden">
  <img
    src="/logo-app 2.png"
    alt="The Sports Digest"
    className="max-h-full max-w-full object-contain"
    style={{ cursor: onClick ? "pointer" : "default" }}
    onClick={onClick}
  />
</div>
  );
}
