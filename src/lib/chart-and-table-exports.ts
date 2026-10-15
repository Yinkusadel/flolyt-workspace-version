function safeFileName(title: string): string {
  return title.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_").toLowerCase() || "export";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadTableCsv(title: string, columns: string[], rows: string[][]) {
  const csv = [columns, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${safeFileName(title)}.csv`);
}

export function downloadJson(title: string, data: unknown) {
  downloadBlob(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8;" }),
    `${safeFileName(title)}.json`
  );
}

export async function downloadChartPng(elementId: string, title: string) {
  const node = document.getElementById(elementId);
  if (!node) return;
  const { toPng } = await import("html-to-image");
  // html-to-image's static clone doesn't always resolve recharts' percentage-sized internal
  // containers correctly, which shows up as a stray gray box behind the plot — pinning explicit
  // pixel dimensions (the node's real rendered size) instead of letting it infer avoids that.
  const rect = node.getBoundingClientRect();
  const dataUrl = await toPng(node, {
    backgroundColor: "#ffffff",
    cacheBust: true,
    pixelRatio: 2,
    width: rect.width,
    height: rect.height,
    // Capture the whole card (title + chart + legend) but skip the hover-only copy/download
    // icons — they're interactive chrome, not part of the chart itself.
    filter: (child) => !(child instanceof HTMLElement && child.dataset.chartExportIgnore === "true"),
  });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${safeFileName(title)}.png`;
  a.click();
}
