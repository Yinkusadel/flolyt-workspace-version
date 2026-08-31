import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAcceptInvitation from "@/features/auth/use-accept-invitation";

interface AcceptInvitationFormProps {
  token: string;
}

export const AcceptInvitationForm = ({ token }: AcceptInvitationFormProps) => {
  const { form, isPending, onSubmit } = useAcceptInvitation({ token });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="text-[10.5px] text-ink-3">
            First name
          </label>
          <Input
            id="firstName"
            placeholder="Ada"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            className="mt-2"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="mt-1.5 text-[11px] text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="text-[10.5px] text-ink-3">
            Last name
          </label>
          <Input
            id="lastName"
            placeholder="Lovelace"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            className="mt-2"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="mt-1.5 text-[11px] text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 h-9.5 w-full rounded-card bg-ink text-[13px] font-semibold text-paper hover:bg-ink/90"
      >
        {isPending ? "Joining..." : "Join workspace"}
      </Button>
    </form>
  );
};
