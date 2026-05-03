import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-thai",
  display: "swap",
});

const plexLatin = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-latin",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pharmroo.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Pharmroo · ฟามรู้ — ประเมินความเสี่ยงโรค NCDs",
  description:
    "ตอบคำถาม 15 ข้อ ใช้เวลา 2 นาที รู้ระดับความเสี่ยงโรค NCDs และจุดที่ควรปรับ",
  openGraph: {
    title: "Pharmroo · ฟามรู้",
    description: "ประเมินความเสี่ยงโรค NCDs ใน 2 นาที",
    url: siteUrl,
    siteName: "Pharmroo",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharmroo · ฟามรู้",
    description: "ประเมินความเสี่ยงโรค NCDs ใน 2 นาที",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F6F4EE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${plexThai.variable} ${plexLatin.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
