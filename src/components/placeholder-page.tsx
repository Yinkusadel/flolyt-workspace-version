/** Stand-in for a sidebar section that has a route and a link, but no rebuilt content yet. */
export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">{title}</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">{description}</p>
      </div>

      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <h2 className="text-[16px] font-semibold text-ink">Not rebuilt yet</h2>
        <p className="mx-auto mt-2.5 max-w-md text-[11.5px] leading-relaxed text-ink-3">
          This section is on the sidebar as a placeholder for now.
        </p>
      </div>
    </div>
  );
}
