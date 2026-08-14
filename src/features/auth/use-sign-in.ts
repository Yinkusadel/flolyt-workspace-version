import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

import { signInSchema, type SignInSchemaType } from "@/validators/auth";
import {
  signIn,
  type SignInCredentials,
  type SignInResponse,
} from "@/services/api/auth/sign-in";
import { useAuth } from "@/utils/auth-context";
import { useEffect, useState } from "react";
import { COOKIE_KEYS, setCookie } from "@/utils/cookies";
import { useNavigate } from "react-router-dom";
import useGetUserByEmail from "./use-get-user-by-email";
const useSignIn = () => {
  const navigate = useNavigate();
  const { refreshUser, setUser } = useAuth();
  const [emailForFetch, setEmailForFetch] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [jwtClaims, setJwtClaims] = useState<ReturnType<typeof decodeFlolytJwt>>(null);


  /** -----------------------------
 * JWT Types
 * ----------------------------*/
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


  /** -----------------------------
   * JWT Decoder
   * ----------------------------*/
  function decodeFlolytJwt(token: string) {
    try {
      const raw = jwtDecode<FlolytJwt>(token);
      const company: CompanyClaim = JSON.parse(raw.company);

      return {
        // userId: raw.sub,
        // email: raw.email,
        // role: raw.role,
        // isPlatformAdmin: raw.platform_admin === "true",

        tenantCurrency: company?.Currency ?? "NGN",
        companyId: company?.Id,
        companyName: company?.Name,
        timeZoneId: company?.TimeZoneId,
      };
    } catch {
      return null;
    }
  }


  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation<SignInResponse, Error, SignInCredentials>({
    mutationFn: signIn,
    onSuccess: (data, variables) => {
      if (data.isAuthenticated && data.token) {

        /** --------------------------------
 * 1. Decode JWT (SOURCE OF TRUTH)
 * --------------------------------*/
        const claims = decodeFlolytJwt(data.token);

        if (!claims) {
          toast.error("Invalid session token");
          return;
        }

        setJwtClaims(claims);

        const requiresOnboarding = Boolean(data.onboardingRequired);

        setNeedsOnboarding(requiresOnboarding);
        setIsPlatformAdmin(data.isPlatformAdmin);
        setEmailForFetch(variables.email);

        if (requiresOnboarding) {
          toast.info("Welcome! Let’s finish setting up your account 🚀");
        } else {
          toast.success("Login successful");
        }

        return;

      } else if (!data.isAuthenticated && data.token === null) {
        toast.error("Please complete registration by verifying your OTP");
        setEmailForFetch(variables.email);
      } else {
        toast.error(data.authenticationError || "Login failed. Please try again.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  // Fetch user info by email
  const { user, isLoading: isFetchingUser } = useGetUserByEmail(emailForFetch ?? "");
  console.log(user, "full user object");

  useEffect(() => {
    if (user && jwtClaims) {
      const userObj = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        hasCompletedOnboarding: !needsOnboarding,
        isPlatformAdmin,

        tenantCurrency: jwtClaims.tenantCurrency,
        companyId: jwtClaims.companyId,
        companyName: jwtClaims.companyName,
        timeZoneId: jwtClaims.timeZoneId,
      };

      setUser(userObj);
      setCookie(COOKIE_KEYS.USER_DATA, JSON.stringify(userObj), { expires: 7 });

      const isOtpVerified = user.status === "Confirmed";
      console.log(isOtpVerified, "user status for isOtpVerified ");
      console.log(user, "user object after login");
      if (needsOnboarding) {
        // navigate(`/create-company-profile/${user.id}`);
        navigate(
          `/auth/create-company-profile/${user.id}?email=${encodeURIComponent(user.email)}`
        );

      } else {
        navigate("/");
      }
    }
  }, [user, jwtClaims, needsOnboarding, isPlatformAdmin, setUser, navigate]);

  const onSubmit = (values: SignInSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    isPending: mutation.isPending,
    mutate: mutation.mutate,
    onSubmit,
  };
};

export default useSignIn;
