"use client";

import { useEffect, useState } from "react";

const KEY = "noble_admin_token";

export function useAdminToken() {
  const [token, setTokenState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTokenState(localStorage.getItem(KEY));
    setLoaded(true);
  }, []);

  const setToken = (t: string | null) => {
    if (t) localStorage.setItem(KEY, t);
    else localStorage.removeItem(KEY);
    setTokenState(t);
  };

  return { token, setToken, loaded };
}
