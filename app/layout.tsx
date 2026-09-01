import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = "https://razonneplus.pt";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Razonne+",
    template: "%s | Razonne+",
  },
  description:
    "Razonne+ é a plataforma de streaming onde encontras o teu próximo título para ver esta noite.",
  openGraph: {
    title: "Razonne+",
    description:
      "Razonne+ é a plataforma de streaming onde encontras o teu próximo título para ver esta noite.",
    url: siteUrl,
    siteName: "Razonne+",
    locale: "pt_PT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-razonne-radial bg-fixed">
        {children}
      </body>
    </html>
  );
}
