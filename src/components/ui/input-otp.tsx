import * as React from "react"
import { OTPInput, OTPInputContext, type OTPInputProps } from "input-otp"

import { cn } from "@/lib/utils"

// Not wrapped in forwardRef — every usage in this codebase drives OTPInput via
// react-hook-form's Controller (value/onChange), never an uncontrolled ref.
function InputOTP({ className, containerClassName, ...props }: OTPInputProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex w-full items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

const InputOTPGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="input-otp-group" className={cn("flex w-full items-center gap-2", className)} {...props} />
  )
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const slot = inputOTPContext?.slots[index]
  const char = slot?.char
  const hasFakeCaret = slot?.hasFakeCaret
  const isActive = slot?.isActive

  return (
    <div
      ref={ref}
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-11 flex-1 items-center justify-center rounded-panel border border-border bg-paper-2 text-[15px] font-semibold text-ink outline-none transition-colors",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        isActive && "z-10 border-ring ring-3 ring-ring/50",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-ink" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }
