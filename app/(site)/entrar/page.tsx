"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou palavra-passe incorretos.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-content justify-center px-6 py-20 md:px-10">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-frost">Entrar</h1>
        <p className="mt-1 text-sm text-mist">
          Entra com o email e a palavra-passe da tua conta Razonne+.
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-rim bg-panel px-3.5 py-2.5 text-sm text-frost focus:border-teal focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-bloom-soft">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-razonne-gradient px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-mist">
          Ainda não tens conta?{" "}
          <Link href="/criar-conta" className="text-teal-soft hover:underline">
            Cria uma agora
          </Link>
        </p>
      </div>
    </div>
  );
}
