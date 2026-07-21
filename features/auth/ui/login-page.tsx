"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/api/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Eye, EyeOff, AlertCircle } from "lucide-react";

const DEMO_CREDENTIALS = [
  { email: "admin@divelop.com", password: "123", role: "Administrador" },
  { email: "consultor@divelop.com", password: "123", role: "Consultor" },
  { email: "cliente@mineraandina.com", password: "123", role: "Cliente (Líder)" },
  { email: "operador@mineraandina.com", password: "123", role: "Usuario Cliente" },
];

export function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 600));
    const loggedUser = await login(email, password);
    if (loggedUser) {
      if (loggedUser.role === "cliente" || loggedUser.role === "usuario_cliente") {
        router.push("/my-forms");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError("Credenciales inválidas. Verifica tu email y contraseña.");
      setLoading(false);
    }
  }

  function fillDemo(email: string, password: string) {
    setEmail(email);
    setPassword(password);
    setError("");
  }

  return (
    <div className="w-full max-w-md px-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
          <Leaf className="w-7 h-7 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">Divelop ESG</h1>
        <p className="text-sm text-muted-foreground mt-1">Plataforma de Reporting de Sostenibilidad</p>
      </div>

      {/* Card */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                "Ingresar a la plataforma"
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3 text-center">Acceso rápido para demostración</p>
            <div className="grid gap-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => fillDemo(cred.email, cred.password)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border transition-all text-left group"
                >
                  <div>
                    <span className="font-medium text-foreground">{cred.role}</span>
                    <p className="text-muted-foreground">{cred.email}</p>
                  </div>
                  <span className="text-muted-foreground group-hover:text-emerald-400 transition-colors text-xs">Usar →</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        © 2026 Divelop Sostenibilidad S.A.C. · Plataforma ESG Reporting
      </p>
    </div>
  );
}
