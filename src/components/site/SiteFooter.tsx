import { footer } from "@/data/site";
import { profile } from "@/data/profile";

/* ── Site footer ── */
export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-page flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-border px-4 py-10 text-sm text-muted sm:px-8 lg:px-12">
      <p>
        {profile.name}, {profile.location}
      </p>
      <ul className="flex flex-wrap gap-x-8 gap-y-2">
        {footer.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="whitespace-nowrap underline-offset-4 decoration-accent hover:text-foreground hover:underline active:text-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
