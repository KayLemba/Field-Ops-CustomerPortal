"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";

export default function RootPage() {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "idle") return;
    router.replace(user ? "/reports" : "/login");
  }, [status, user, router]);

  return null;
}
