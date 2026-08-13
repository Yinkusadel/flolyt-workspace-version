import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import useSignIn from "@/features/auth/use-sign-in";

export const SignInForm = () => {
  const { form, isPending, onSubmit } = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 max-w-sm" noValidate>
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

      <div className="mt-4">
        <label htmlFor="password" className="text-[10.5px] text-ink-3">
          Password
        </label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className="mt-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1.5 text-[11px] text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 h-9.5 w-full rounded-card bg-ink text-[13px] font-semibold text-paper hover:bg-ink/90"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};
