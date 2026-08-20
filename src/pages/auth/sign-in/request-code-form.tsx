import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRequestLoginCode from "@/features/auth/use-request-login-code";

interface RequestCodeFormProps {
  defaultEmail?: string;
  onRequested: (email: string, challengeId: string) => void;
}

export const RequestCodeForm = ({ defaultEmail, onRequested }: RequestCodeFormProps) => {
  const { form, isPending, onSubmit } = useRequestLoginCode({ onRequested, defaultEmail });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10" noValidate>
      <div>
        <label htmlFor="email" className="text-[10.5px] text-ink-3">
          Work email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="ada@northwind.example"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className="mt-2"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-[11px] text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 h-9.5 w-full rounded-card bg-ink text-[13px] font-semibold text-paper hover:bg-ink/90"
      >
        {isPending ? "Sending code..." : "Continue with email"}
      </Button>
    </form>
  );
};
