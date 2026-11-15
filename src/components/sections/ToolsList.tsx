import { profile } from "@/data/profile";
import { skillGroupLabels } from "@/data/site";

type SkillGroup = keyof typeof profile.skills;

/* ── Tools list ── */
export function ToolsList() {
  const groups = Object.keys(profile.skills) as SkillGroup[];

  return (
    <dl className="mt-8 border-b border-border">
      {groups.map((group) => (
        <div
          key={group}
          className="grid gap-x-16 gap-y-1 border-t border-border py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        >
          <dt className="text-muted">{skillGroupLabels[group]}</dt>
          <dd>{profile.skills[group].join(", ")}</dd>
        </div>
      ))}
    </dl>
  );
}
