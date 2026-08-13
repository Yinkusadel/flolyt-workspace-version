import { SignInForm } from "@/pages/auth/sign-in/sign-in-form";
import flolytLogo from "../../../../assets/logo.png";

export const LeftSection = () => {
  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        <img src={flolytLogo} alt="Flolyt" className="size-7.5 object-contain" />

        <h1 className="mt-9 text-[22px] font-semibold text-ink">Sign in to your workspace</h1>
        <p className="mt-1.5 text-[12.5px] text-ink-3">
          Flolyt rooms are shared, so you always arrive as yourself.
        </p>

        <SignInForm />
      </div>
    </div>
  );
};
