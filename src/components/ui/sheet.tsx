import * as React from "react"
import { X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Same primitive family as Dialog (radix-ui's Dialog.Root), just anchored to the right edge and
// full-height instead of centered — a Sheet is exactly how shadcn itself builds this, so it
// inherits the same already-patched @radix-ui/react-presence fix (see preact_radix_dialog_crash
// memory) rather than introducing a second overlay mechanism. Per that same memory: always mount
// with `open` state starting false and toggle it, never gate the whole component behind a truthy
// conditional that renders it already-open.

function Sheet({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-ink/28 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

// Same nested-Radix-layer fix as DialogContent (see dialog.tsx's own comment) — duplicated rather
// than shared since it's a few lines and keeps Sheet a standalone file.
function isInsideNestedRadixLayer(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !!target.closest("[data-radix-popper-content-wrapper], [data-slot='dropdown-menu-content']")
  )
}

function SheetContent({
  className,
  children,
  showCloseButton = true,
  onPointerDownOutside,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col gap-0 border-l border-line bg-paper shadow-lg outline-none duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          className
        )}
        onPointerDownOutside={(event) => {
          if (isInsideNestedRadixLayer(event.target)) {
            event.preventDefault()
            return
          }
          onPointerDownOutside?.(event)
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="sheet-close-button"
            className="absolute top-3 right-3 rounded-control text-ink-4 opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex shrink-0 flex-col gap-1 border-b border-line px-5 pt-6 pr-10 pb-4", className)}
      {...props}
    />
  )
}

/** The scrolling region between a fixed `SheetHeader` and the rest — pass body padding via className. */
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("min-h-0 flex-1 overflow-y-auto", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-[15px] font-semibold text-ink", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-[11.5px] text-ink-3", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
