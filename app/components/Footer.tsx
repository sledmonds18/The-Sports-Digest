    "use client";

    import { Logo } from "./Logo";

    interface FooterProps {
    onNavigate: (page: string) => void;
    }

    export function Footer({ onNavigate }: FooterProps) {
    const footerColumns = [
        { h: "Coverage", ls: ["Football", "Basketball", "Athletics", "Tennis", "Cricket", "Motorsport"] },
        { h: "Company", ls: ["About Us", "Our Team", "Awards", "Careers", "Advertise"] },
        { h: "Legal", ls: ["Privacy Policy", "Terms of Use", "Cookie Policy", "Editorial Standards"] },
    ];

    const socialLinks = ["𝕏", "f", "in", "▶"];
    const socialLabels = ["X / Twitter", "Facebook", "LinkedIn", "YouTube"];

    return (
        <footer role="contentinfo">
        <div className="wrap">
            <div className="fgr">
            <div className="fbrand">
                <Logo onClick={() => onNavigate("home")} />
                <p>Fearless sports journalism from Accra to the world. Award-winning coverage since 2018.</p>
            </div>
            {footerColumns.map((col) => (
                <div key={col.h} className="fcol">
                <h4>{col.h}</h4>
                <ul>
                    {col.ls.map((link) => (
                    <li key={link}>
                        <a href="">{link}</a>
                    </li>
                    ))}
                </ul>
                </div>
            ))}
            </div>
            <div className="fbot">
            <span>© 2026 The Sports Digest. All rights reserved.</span>
            <div className="socs" aria-label="Social media">
                {socialLinks.map((s, i) => (
                <div key={i} className="soc" aria-label={socialLabels[i]}>
                    {s}
                </div>
                ))}
            </div>
            </div>
        </div>
        </footer>
    );
    }
