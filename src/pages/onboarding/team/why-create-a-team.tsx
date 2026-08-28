const POINTS = [
  {
    key: "shared",
    title: "One shared workspace",
    description:
      "Everyone you invite sees the same agents, data and rooms — there's no separate account per person.",
  },
  {
    key: "roles",
    title: "Roles decide reach",
    description:
      "Member, Lead or Administrator — each invite picks one, and it can be changed any time from the team page.",
  },
  {
    key: "optional",
    title: "Inviting is optional right now",
    description: "Creating the team is enough to move on. People can be invited the moment you're ready, not before.",
  },
];

/** Right rail for /onboarding/team — same shape as the data step's WhatSourceUnlocks/WhatYouCanAskNow asides. */
export function WhyCreateATeam() {
  return (
    <aside className="hidden w-100 shrink-0 overflow-y-auto border-l border-line bg-paper-2 p-8 lg:block">
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
        What creating a team does
      </p>

      <div className="mt-6 space-y-6">
        {POINTS.map((item) => (
          <div key={item.key} className="flex gap-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal" aria-hidden />
            <div>
              <p className="text-[12.5px] font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-3">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-card border border-dashed border-line bg-paper p-4">
        <p className="text-[12px] font-semibold text-ink">You stay the owner</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">
          Whoever creates a team keeps it — ownership doesn't move with an invite or a role change.
        </p>
      </div>
    </aside>
  );
}
