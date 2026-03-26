        "use client";

        interface LogoProps {
        onClick?: () => void;
        }

        export function Logo({ onClick }: LogoProps) {
        return (
            <img
            src="\logo-app.png"
            alt="Logo"
            className="h-8 w-auto"
            />
        );
        }