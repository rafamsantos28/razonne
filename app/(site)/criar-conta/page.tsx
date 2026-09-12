"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CriarContaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }
    if (password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Não foi possível criar a conta.");
      return;
    }

    // Conta criada com sucesso — entra automaticamente.
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      // A conta foi criada, mas o login automático falhou por alguma razão;
      // manda o utilizador para a página de login.
      router.push("/entrar");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-content justify-center px-6 py-20 md:px-10">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-frost">Criar conta</h1>
        <p className="mt-1 text-sm text-mist">
          Só precisas de um email e de uma palavra-passe.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-mist">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-rim bg-panel px-3.5 py-2.5 text-sm text-frost focus:border-teal focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-mist">
            Palavra-passe
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-rim bg-panel px-3.5 py-2.5 text-sm text-frost focus:border-teal focus:outline-none"
            />
            <span className="text-xs text-mist/70">Mínimo de 8 caracteres.</span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-mist">
            Confirmar palavra-passe
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md border border-rim bg-panel px-3.5 py-2.5 text-sm text-frost focus:border-teal focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-bloom-soft">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-razonne-gradient px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "A criar conta…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-mist">
          Já tens conta?{" "}
          <Link href="/entrar" className="text-teal-soft hover:underline">
            Entra aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
