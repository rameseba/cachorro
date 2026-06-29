"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAdminToken } from "../useAdmin";

export default function AdminLogin() {
  const router = useRouter();
  const login = useMutation(api.admin.login);
  const { setToken } = useAdminToken();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login({ password });
      if (res.ok && res.token) {
        setToken(res.token);
        router.push("/admin/editar-web");
      } else {
        setError("Contraseña incorrecta.");
      }
    } catch {
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <img src="/assets/logo.png" alt="Noble Cachorro" />
        <h1>Panel de Administración</h1>
        <p>Editor web de Criadero Noble Cachorro</p>
        <input
          className="admin-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <div className="admin-error">{error}</div>}
        <button className="admin-btn admin-btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
