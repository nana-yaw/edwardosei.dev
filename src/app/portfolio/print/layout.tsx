import { Inter, Playfair_Display } from "next/font/google";

// The print page names these two faces in its own stylesheet. The screen
// design no longer loads them, so this route loads them for itself.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export default function PrintLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${inter.variable} ${playfair.variable}`}>{children}</div>
  );
}
