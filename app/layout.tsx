import type { Metadata } from "next";
import "./styles/sports-digest.css";

export const metadata: Metadata = {
  title: "The Sports Digest — Africa's Premier Sports Journalism Platform",
  description:
    "Breaking sports news, in-depth analysis, and investigative features covering football, basketball, athletics, tennis, cricket and motorsport from Accra to the world.",
  keywords:
    "sports news africa, football analysis, basketball, athletics, cricket, motorsport, sports journalism ghana",
  openGraph: {
    title: "The Sports Digest — Africa's Premier Sports Journalism Platform",
    description:
      "Breaking sports news, in-depth analysis, and investigative features covering football, basketball, athletics, tennis, cricket and motorsport from Accra to the world.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sports Digest — Africa's Premier Sports Journalism Platform",
    description:
      "Breaking sports news, in-depth analysis, and investigative features covering football, basketball, athletics, tennis, cricket and motorsport.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://thesportsdigest.com" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
