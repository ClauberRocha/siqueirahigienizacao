import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";
import { claimAdminIfEmpty } from "@/lib/admin.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Área do proprietário — ${siteConfig.brandName}` },
      { name: "description", content: "Acesso restrito ao proprietário." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "sign_up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      // Se ainda não existe admin, promove este usuário.
      try {
        await claimAdminIfEmpty();
      } catch {
        /* ignora — usuário pode não ser admin, cai na tela e verá aviso */
      }
      toast.success("Autenticado!");
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error("Falha no acesso", { description: err?.message ?? "Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-4">
          <Link to="/" className="text-xs text-muted-foreground hover:underline">
            ← Voltar ao site
          </Link>
          <h1 className="mt-2 text-xl font-bold">Área do proprietário</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "sign_in"
              ? "Entre com seu e-mail e senha."
              : "Crie a conta do proprietário (primeiro acesso)."}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde…" : mode === "sign_in" ? "Entrar" : "Criar conta"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "sign_in" ? "sign_up" : "sign_in"))}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:underline"
        >
          {mode === "sign_in"
            ? "Primeiro acesso? Criar conta"
            : "Já tenho conta — entrar"}
        </button>
      </Card>
    </div>
  );
}
