import { useState } from "react";
import { Check, Copy, Download, FileJson, ImageIcon, Sheet } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResponseCtaProps {
  onCopy: () => void;
  onDownloadCsv?: () => void;
  onDownloadJson: () => void;
  onDownloadPng?: () => void;
}

// Shared hover-reveal copy/download menu for both DATA_TABLE and DATA_CHART cards — needs the
// parent card to carry the `group` class for the opacity-0 group-hover:opacity-100 reveal.
export function ResponseCta({ onCopy, onDownloadCsv, onDownloadJson, onDownloadPng }: ResponseCtaProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        type="button"
        onClick={handleCopy}
        title="Copy data"
        className="flex size-6 items-center justify-center rounded text-ink-4 transition-colors hover:bg-paper-2 hover:text-ink"
      >
        {copied ? <Check className="size-3.5 text-teal" /> : <Copy className="size-3.5" />}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title="Download"
            className="flex size-6 items-center justify-center rounded text-ink-4 transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <Download className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {onDownloadCsv && (
            <DropdownMenuItem onClick={onDownloadCsv}>
              <Sheet className="size-4" />
              Download CSV
            </DropdownMenuItem>
          )}
          {onDownloadPng && (
            <DropdownMenuItem onClick={onDownloadPng}>
              <ImageIcon className="size-4" />
              Download PNG
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onDownloadJson}>
            <FileJson className="size-4" />
            Download JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
