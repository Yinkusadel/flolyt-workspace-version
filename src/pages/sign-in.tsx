import { LeftSection } from "@/pages/auth/sign-in/left-section";
import { RightSection } from "@/pages/auth/sign-in/right-section";

const SignIn = () => {
  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
      <LeftSection />
      <div className="hidden md:block">
        <RightSection />
      </div>
    </div>
  );
};

export default SignIn;
