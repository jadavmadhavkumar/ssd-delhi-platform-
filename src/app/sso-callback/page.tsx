"use client";

import { useSignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      if (!isLoaded || !signIn) return;

      try {
        // Check if there's a status in the URL
        const status = searchParams.get("status");
        if (status === "complete") {
          // Session should be automatically active after OAuth
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/sign-in");
      }
    }

    handleCallback();
  }, [isLoaded, signIn, searchParams, router]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#003285] mb-4" />
        <h2 className="text-xl font-semibold text-[#003285]">
          Completing sign in...
        </h2>
        <p className="text-muted-foreground mt-2">
          Please wait a moment
        </p>
      </div>
    </div>
  );
}
