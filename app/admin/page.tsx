"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminToken } from "./useAdmin";

export default function AdminIndex() {
  const router = useRouter();
  const { token, loaded } = useAdminToken();

  useEffect(() => {
    if (!loaded) return;
    router.replace(token ? "/admin/editar-web" : "/admin/login");
  }, [loaded, token, router]);

  return null;
}
