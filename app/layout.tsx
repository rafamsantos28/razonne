import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    default: "O Teu Cinema em Casa | Razonne+",
    template: "%s | Razonne+",
  },
  description:
    "Razonne+ é a plataforma de streaming onde encontras o teu próximo título para ver sem teres de sair de casa.",
  openGraph: {
    title: "Razonne+",
    description:
      "Razonne+ é a plataforma de streaming onde encontras o teu próximo título para ver sem teres de sair de casa.",
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
      <body className="flex min-h-screen flex-col font-body bg-razonne-radial bg-fixed">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
