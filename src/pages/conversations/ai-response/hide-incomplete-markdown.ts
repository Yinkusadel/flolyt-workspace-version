const PAIRED_MARKERS = ["**", "__", "~~"] as const;

/**
 * Hides an in-progress bold/strikethrough run until its closing marker streams in, so a lone
 * opening `**`/`__`/`~~` never flashes as literal text mid-stream — the run pops in atomically
 * once complete instead. Deliberately limited to these three 2-char markers: single `*`/`_` are
 * too common in ordinary prose and identifiers (multiplication, snake_case field keys like
 * `second_purchase_window`) to safely treat an odd count as "still open" without false positives.
 * Only meant for text that's still streaming — a finished message's markdown is trusted as-is.
 */
export function hideIncompleteMarkdownTail(text: string): string {
  const stack: { marker: (typeof PAIRED_MARKERS)[number]; index: number }[] = [];
  let i = 0;

  while (i < text.length) {
    const marker = PAIRED_MARKERS.find((m) => text.startsWith(m, i));
    if (!marker) {
      i += 1;
      continue;
    }

    const top = stack[stack.length - 1];
    if (top?.marker === marker) {
      stack.pop();
    } else {
      stack.push({ marker, index: i });
    }
    i += marker.length;
  }

  return stack.length > 0 ? text.slice(0, stack[0].index) : text;
}
