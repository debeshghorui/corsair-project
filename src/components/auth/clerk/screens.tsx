"use client";

import { SignIn, SignUp } from "@clerk/nextjs";

import { POST_AUTH_PATH } from "@/server/auth/paths";

export function SignInScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl={POST_AUTH_PATH}
        forceRedirectUrl={POST_AUTH_PATH}
      />
    </div>
  );
}

export function SignUpScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl={POST_AUTH_PATH}
        forceRedirectUrl={POST_AUTH_PATH}
      />
    </div>
  );
}
