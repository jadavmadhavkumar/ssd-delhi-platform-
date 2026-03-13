"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Fragment, ReactNode, useEffect } from "react";

// Component to suppress Convex WebSocket connection logs
function ConvexLogSuppressor() {
  useEffect(() => {
    // Suppress Convex WebSocket connection logs (they're normal but noisy)
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    console.warn = (...args) => {
      const msg = args[0]?.toString() || "";
      if (msg.includes("forward-logs") || msg.includes("WebSocket reconnected") || msg.includes("Attempting reconnect")) {
        return;
      }
      originalWarn.apply(console, args);
    };
    
    console.log = (...args) => {
      const msg = args[0]?.toString() || "";
      if (msg.includes("forward-logs") || msg.includes("WebSocket reconnected") || msg.includes("Attempting reconnect")) {
        return;
      }
      originalLog.apply(console, args);
    };
    
    // Cleanup on unmount
    return () => {
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, []);
  
  return null;
}

// Initialize Convex client with proper error handling
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
let convex: ConvexReactClient | null = null;

// Only create client if URL is available
if (convexUrl && convexUrl !== "https://dummy.convex.cloud") {
  try {
    convex = new ConvexReactClient(convexUrl, {
      skipConvexDeploymentUrlCheck: true,
      logLevel: "error", // Only show errors, suppress connection logs
      unsavedChangesWarning: false, // Disable unsaved changes warnings
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
      <Fragment>
        <ConvexLogSuppressor />
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkProvider>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <ConvexLogSuppressor />
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </ClerkProvider>
    </Fragment>
  );
}
