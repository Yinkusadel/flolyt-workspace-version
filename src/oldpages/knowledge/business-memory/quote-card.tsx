/** A learning stated in the serif face, with where it came from — no left accent strand (flattened per house rule). */
export function QuoteCard({ text, source }: { text: string; source: string }) {
  return (
    <div className="rounded-card border border-line2 bg-paper p-5 sm:p-6">
      <p className="font-serif text-[15px] leading-relaxed text-ink sm:text-[16px]">{text}</p>
      <p className="mt-4 border-t border-dashed border-line pt-3 font-mono text-[9.5px] text-ink-4">{source}</p>
    </div>
  );
}
