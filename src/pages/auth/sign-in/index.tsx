import { LeftSection } from "@/pages/auth/sign-in/left-section";
import { AuthRightSection } from "@/pages/auth/shared/right-section";

const SignIn = () => {
  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
      <LeftSection />
      <div className="hidden md:block">
        <AuthRightSection />
      </div>
    </div>
  );
};

export default SignIn;
