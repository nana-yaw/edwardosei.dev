import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";
import { siteUrl } from "@/data/navigation";
import { meta } from "@/data/site";

// One family for display and body. The width axis is what sets the two apart.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: meta.siteName,
    template: meta.titleTemplate,
  },
  description: meta.description,
  metadataBase: new URL(siteUrl),
  // No url here: a site-wide url credited every shared page to the root.
  openGraph: meta.openGraph,
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
    <html lang="en" className={archivo.variable}>
      <body className="antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
