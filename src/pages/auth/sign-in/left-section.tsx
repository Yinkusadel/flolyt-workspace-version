import { SignInForm } from "@/pages/auth/sign-in/sign-in-form";

export const LeftSection = () => {
  return (
    <div className="flex h-full flex-col justify-center px-14 py-14">
      <div className="flex size-7.5 items-center justify-center rounded-surface bg-ultra">
        <span className="text-[16px] font-bold text-paper">F</span>
      </div>

      <h1 className="mt-9 text-[22px] font-semibold text-ink">Sign in to your workspace</h1>
      <p className="mt-1.5 text-[12.5px] text-ink-3">
        Flolyt rooms are shared, so you always arrive as yourself.
      </p>

      <SignInForm />
    </div>
  );
};
