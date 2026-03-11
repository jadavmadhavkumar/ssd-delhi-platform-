"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";

// Initialize Convex client with proper error handling
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
let convex: ConvexReactClient | null = null;

// Only create client if URL is available
if (convexUrl && convexUrl !== "https://dummy.convex.cloud") {
  try {
    convex = new ConvexReactClient(convexUrl, {
      skipConvexDeploymentUrlCheck: true,
    });
  } catch (error) {
    console.warn("Failed to initialize Convex client:", error);
  }
}

// Re-export Clerk components for use in client components
export { SignedIn, SignedOut, SignInButton, UserButton, useAuth };

export function Providers({ children }: { children: ReactNode }) {
  // If Convex isn't configured yet, render children without providers
  // This allows the app to work during initial setup
  if (!convex) {
    return (
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        {children}
      </ClerkProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </ClerkProvider>
  );
}
