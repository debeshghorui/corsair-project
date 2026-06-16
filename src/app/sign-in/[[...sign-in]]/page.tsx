import { SignIn } from "@clerk/nextjs";

import { POST_AUTH_PATH } from "@/server/auth/postAuth";

export default function SignInPage() {
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
