import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// The v3 handoff doc calls for "a safe Markdown renderer whose raw-HTML mode is disabled" —
// `AiResponseRenderer`'s plain-text segments were never actually running through one (confirmed
// live 2026-09-26: a response with real GFM headers/bold/tables rendered the literal `##`/`**`/`|`
// characters instead). `rehypeRaw` is deliberately not used, so any HTML in the source stays inert
// text rather than being injected into the DOM.
const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => (
    <p className="mt-2 text-[12.5px] leading-relaxed wrap-break-word text-ink first:mt-0">{children}</p>
  ),
  h1: ({ children }) => <h1 className="mt-4 text-[15px] font-semibold text-ink first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-4 text-[13.5px] font-semibold text-ink first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-3 text-[12.5px] font-semibold text-ink first:mt-0">{children}</h3>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-4 text-[12.5px] text-ink first:mt-0">{children}</ul>,
  ol: ({ children }) => <ol className="mt-2 list-decimal space-y-1 pl-4 text-[12.5px] text-ink first:mt-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-ultra hover:underline">
      {children}
    </a>
  ),
  hr: () => <hr className="my-3 border-line" />,
  blockquote: ({ children }) => (
    <blockquote className="mt-2 border-l-2 border-line pl-3 text-ink-3 italic first:mt-0">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-paper-2 px-1 py-0.5 font-mono text-[11.5px] text-ink">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mt-2 overflow-x-auto rounded-card bg-paper-2 p-3 font-mono text-[11.5px] text-ink first:mt-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mt-2 overflow-x-auto rounded-card border border-line first:mt-0">
      <table className="w-full min-w-max border-collapse text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-line bg-paper-2">{children}</thead>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-[10.5px] font-medium tracking-[0.4px] whitespace-nowrap text-ink-4 uppercase">
      {children}
    </th>
  ),
  tr: ({ children }) => <tr className="border-b border-line last:border-b-0">{children}</tr>,
  td: ({ children }) => <td className="px-3 py-2 text-[12px] wrap-break-word text-ink">{children}</td>,
};

export function AiMarkdownText({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
      {content}
    </ReactMarkdown>
  );
}
