import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Space_Grotesk,
  Fira_Code,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "devONE | Edward Osei-Nyarko",
    template: "%s | devONE",
  },
  description:
    "Software developer building production systems that serve communities. Security-first. Problem-first.",
  metadataBase: new URL("https://edwardosei.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edwardosei.dev",
    siteName: "devONE | Edward Osei-Nyarko",
    title: "devONE | Edward Osei-Nyarko",
    description:
      "Software developer building production systems that serve communities. Security-first. Problem-first.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "devONE | Edward Osei-Nyarko, Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "devONE | Edward Osei-Nyarko",
    description:
      "Software developer building production systems that serve communities.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
