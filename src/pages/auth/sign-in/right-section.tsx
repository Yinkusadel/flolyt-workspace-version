const FEATURES = [
  {
    title: "Everything is attributed",
    description: "Every action names who took it — person or agent.",
  },
  {
    title: "Agents act under your permissions",
    description: "An approval runs with your access, never more.",
  },
  {
    title: "Memory stays in your workspace",
    description: "Nothing learned here is shared across tenants.",
  },
];

export const RightSection = () => {
  return (
    <div className="flex h-full flex-col justify-center bg-paper-2 px-14 py-14">
      <span className="font-mono text-[9.5px] font-medium tracking-[0.1em] text-ink-4">
        WHAT YOU ARE SIGNING INTO
      </span>

      <h2 className="mt-6 font-serif text-[17px] text-ink">A room, not an inbox.</h2>
      <p className="mt-3 max-w-sm text-[12px] leading-[1.5] text-ink-3">
        Your questions become shared rooms your team can walk into. Nothing you ask sits
        privately in a chat log nobody else can find.
      </p>

      <div className="mt-10 max-w-sm">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="border-t border-line py-4 first:pt-0">
            <p className="text-[12.5px] font-semibold text-ink">{feature.title}</p>
            <p className="mt-1 text-[11.5px] text-ink-3">{feature.description}</p>
          </div>
        ))}
        <div className="border-t border-line" />
      </div>
    </div>
  );
};
