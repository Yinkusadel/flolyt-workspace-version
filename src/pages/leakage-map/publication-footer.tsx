import type { LeakageV2Publication } from "@/services/api/leakage/get-leakage";

interface PublicationFooterProps {
  publication: LeakageV2Publication;
  contractVersion: string;
}

/** `2026-10-03T20:29:11.03Z` -> `2026-10-03 20:29:11 UTC`; an unparseable value is shown as the server sent it. */
function formatUtcStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.toISOString().slice(0, 19).replace("T", " ")} UTC`;
}

/**
 * The publication's own identifiers on one muted line, as the design shows. Run and snapshot ids are cut to
 * their first 8 characters for display, with the full id in the hover title for anyone quoting it to support.
 * Every value is a field of the response; nothing is derived.
 */
export function PublicationFooter({ publication, contractVersion }: PublicationFooterProps) {
  const items: { label: string; value: string; title?: string }[] = [
    { label: "snapshot", value: publication.snapshotId.slice(0, 8), title: publication.snapshotId },
    { label: "run", value: publication.runId.slice(0, 8), title: publication.runId },
    { label: "registry", value: publication.registryVersion },
    ...(publication.sectorProfileVersions.length > 0
      ? [{ label: "sector profile", value: publication.sectorProfileVersions.join(", ") }]
      : []),
    { label: "contract", value: contractVersion },
    { label: "published", value: formatUtcStamp(publication.publishedAtUtc) },
  ];
  return (
    <p className="flex flex-wrap gap-x-5 gap-y-1 pt-2 font-mono text-[10.5px] text-ink-4">
      {items.map((item) => (
        <span key={item.label} title={item.title}>
          {item.label} {item.value}
        </span>
      ))}
    </p>
  );
}
