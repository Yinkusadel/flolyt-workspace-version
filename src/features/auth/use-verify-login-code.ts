import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { verifyLoginCodeSchema, type VerifyLoginCodeSchemaType } from "@/validators/auth";
import {
  verifyLoginCode,
  type VerifyLoginCodePayload,
  type VerifyLoginCodeResponse,
} from "@/services/api/auth/verify-login-code";
import { useAuth } from "@/utils/auth-context";
import { COOKIE_KEYS, setCookie } from "@/utils/cookies";
import useGetUserByEmail from "./use-get-user-by-email";

type FlolytJwt = {
  sub: string;
  email: string;
  role?: string;
  company: string;
  platform_admin?: "true";
  exp: number;
};

type CompanyClaim = {
  Id: string;
  Name: string;
  EmailContact: string;
  TimeZoneId: string;
  Currency: string | null;
  DateCreated: string;
};

function decodeFlolytJwt(token: string) {
  try {
    const raw = jwtDecode<FlolytJwt>(token);
    // company is "" for users with no company yet (e.g. onboardingRequired), not a decode failure.
    const company: CompanyClaim | null = raw.company ? JSON.parse(raw.company) : null;

    return {
      tenantCurrency: company?.Currency ?? "NGN",
      companyId: company?.Id,
      companyName: company?.Name,
      timeZoneId: company?.TimeZoneId,
    };
  } catch {
    return null;
  }
}

interface UseVerifyLoginCodeOptions {
  challengeId: string;
  email: string;
}

const useVerifyLoginCode = ({ challengeId, email }: UseVerifyLoginCodeOptions) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [emailForFetch, setEmailForFetch] = useState<string | null>(null);
  const [onboardingRequired, setOnboardingRequired] = useState(false);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [jwtClaims, setJwtClaims] = useState<ReturnType<typeof decodeFlolytJwt>>(null);

  const form = useForm<VerifyLoginCodeSchemaType>({
    resolver: zodResolver(verifyLoginCodeSchema),
    // Not "onChange" — InputOTP fires an onChange on mount to sync its initial
    // value, which would validate (and show red) before the user has typed anything.
    mode: "onTouched",
    defaultValues: { challengeId, code: "" },
  });

  const mutation = useMutation<VerifyLoginCodeResponse, Error, VerifyLoginCodePayload>({
    mutationFn: verifyLoginCode,
    onSuccess: (data) => {
      if (!data.isAuthenticated || !data.token) {
        toast.error(data.authenticationError || "That code is not valid. Request a new one and try again.");
        return;
      }

      const claims = decodeFlolytJwt(data.token);

      if (!claims) {
        toast.error("Invalid session token");
        return;
      }

      setJwtClaims(claims);
      setOnboardingRequired(Boolean(data.onboardingRequired));
      setIsPlatformAdmin(data.isPlatformAdmin);
      setEmailForFetch(email);
      toast.success("Signed in");
    },
    onError: (error) => {
      toast.error(error.message || "That code is not valid. Request a new one and try again.");
    },
  });

  const { user } = useGetUserByEmail(emailForFetch ?? "");

  useEffect(() => {
    if (!user || !jwtClaims) return;

    const userObj = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      hasCompletedOnboarding: !onboardingRequired,
      isPlatformAdmin,
      tenantCurrency: jwtClaims.tenantCurrency,
      companyId: jwtClaims.companyId,
      companyName: jwtClaims.companyName,
      timeZoneId: jwtClaims.timeZoneId,
    };

    setUser(userObj);
    setCookie(COOKIE_KEYS.USER_DATA, JSON.stringify(userObj), { expires: 7 });

    // Onboarding step 1 (workspace) exists now — steps 2-5 (business model, data,
    // agents, team) don't yet, so this only carries a user through the first step.
    navigate(onboardingRequired ? "/onboarding/start" : "/");
  }, [user, jwtClaims, onboardingRequired, isPlatformAdmin, setUser, navigate]);

  const onSubmit = (values: VerifyLoginCodeSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    isPending: mutation.isPending,
    onSubmit,
  };
};

export default useVerifyLoginCode;
