"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocalStorage } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

export default function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile] = useLocalStorage<UserProfile | null>("numen:profile", null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const needsOnboarding = mounted && !profile && pathname !== "/onboarding";

  useEffect(() => {
    if (needsOnboarding) router.replace("/onboarding");
  }, [needsOnboarding, router]);

  if (pathname === "/onboarding") return <>{children}</>;
  if (!mounted || needsOnboarding) return null;

  return <>{children}</>;
}
