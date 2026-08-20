import { Link } from "react-router-dom";

import { SignUpForm } from "@/pages/auth/sign-up/sign-up-form";
import flolytLogo from "../../../../assets/logo.png";

export const LeftSection = () => {
  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        <img src={flolytLogo} alt="Flolyt" className="size-7.5 object-contain" />

        <h1 className="mt-9 text-[22px] font-semibold text-ink">Create your workspace</h1>
        <p className="mt-1.5 text-[12.5px] text-ink-3">
          No password to set — we'll email you a code to confirm your address.
        </p>

        <SignUpForm />

        <p className="mt-6 text-[12px] text-ink-3">
          Already have a workspace?{" "}
          <Link to="/auth/sign-in" className="font-semibold text-ink hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
