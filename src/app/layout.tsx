import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Space_Grotesk,
  Fira_Code,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ReducedMotionProvider } from "@/components/ReducedMotionProvider";
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
  },
  twitter: {
    card: "summary_large_image",
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
        <ReducedMotionProvider>
          <PostHogProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </PostHogProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
