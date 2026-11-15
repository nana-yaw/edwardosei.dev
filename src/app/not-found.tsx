import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { homePath, mainId } from "@/data/navigation";
import { notFoundPage } from "@/data/site";

export default function NotFound() {
  return (
    <>
      <SiteHeader pinned />
      {/* One screen with the header, so a page this short never scrolls. */}
      <main
        id={mainId}
        className="mx-auto flex min-h-[calc(100dvh-var(--header-height))] w-full max-w-page flex-col items-start justify-center px-4 sm:px-8 lg:px-12"
      >
        <h1 className="text-display">{notFoundPage.title}</h1>
        <p className="mt-6 text-lede text-muted">{notFoundPage.lede}</p>
        <Link
          href={homePath}
          className="mt-9 inline-flex h-12 items-center whitespace-nowrap bg-accent px-6 font-semibold text-accent-ink transition-[background-color] duration-150 hover:bg-foreground active:bg-muted"
        >
          {notFoundPage.action}
        </Link>
      </main>
    </>
  );
}
