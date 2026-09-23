    "use client";

    import { Logo } from "./Logo";
    import { FaTiktok, FaWhatsapp, FaInstagram } from "react-icons/fa";

    interface FooterProps {
        onNavigate: (page: string) => void;
    }

    export function Footer({ onNavigate }: FooterProps) {
        const footerColumns = [
            {
                h: "Coverage",
                ls: [
                    "Football",
                    "Basketball",
                    "Athletics",
                    "Tennis",
                    "Cricket",
                    "Motorsport",
                ],
            },
            {
                h: "Company",
                ls: [
                    "About Us",
                    "Our Team",
                    "Awards",
                    "Careers",
                    "Advertise",
                ],
            },
            {
                h: "Legal",
                ls: [
                    "Privacy Policy",
                    "Terms of Use",
                    "Cookie Policy",
                    "Editorial Standards",
                ],
            },
        ];

        const socialLinks = [
            {
                icon: "𝕏",
                label: "X / Twitter",
                url: "https://x.com/sportsdigesthub?s=20t",
            },
            {
                icon: "f",
                label: "Facebook",
                url: "https://www.facebook.com/share/1AmxGoLd4c/?mibextid=wwXIfr",
            },
            {
                icon: "▶",
                label: "YouTube",
                url: "https://www.youtube.com/@sportsdigesthub",
            },
            {
                icon: FaInstagram,
                label: "Instagram",
                url: "https://www.instagram.com/sportsdigesthub/",
            },
            {
                icon: FaWhatsapp,
                label: "WhatsApp",
                url: "https://whatsapp.com/channel/0029VbAsxVQFi8xj98qHuX2P",
            },
            {
                icon: FaTiktok,
                label: "TikTok",
                url: "https://www.tiktok.com/@sportsdigesthub",
            },
        ];

        return (
            <footer role="contentinfo">
                <div className="wrap">
                    <div className="fgr">
                        <div className="fbrand">
                            <Logo onClick={() => onNavigate("home")} />

                            <p>
                                Fearless sports journalism from Accra to the world.
                                Award-winning coverage since 2018.
                            </p>
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
                        <span>
                            © 2026 The Sports Digest. All rights reserved.
                        </span>

                        <div className="socs" aria-label="Social media">
                            {socialLinks.map((social, i) => {
                                const Icon = social.icon;

                                return (
                                    <div
                                        key={i}
                                        className="soc"
                                        aria-label={social.label}
                                    >
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                        >
                                            {typeof Icon === "string" ? (
                                                Icon
                                            ) : (
                                                <Icon />
                                            )}
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </footer>
        );
    }