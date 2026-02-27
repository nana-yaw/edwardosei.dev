import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <h1
        className="text-8xl font-bold tracking-tighter sm:text-9xl"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--accent)",
        }}
      >
        404
      </h1>
      <p
        className="mt-4 text-lg"
        style={{
          color: "color-mix(in srgb, var(--text) 50%, transparent)",
          fontFamily: "var(--font-body)",
        }}
      >
        Page not found
      </p>
      <Link
        href="/portfolio"
        className="mt-8 rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-80"
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--bg)",
          fontFamily: "var(--font-body)",
        }}
      >
        Back to portfolio
      </Link>
    </div>
  );
}
