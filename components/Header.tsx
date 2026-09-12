"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-rim/60 bg-void/80 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2" aria-label="Razonne+, página inicial">
          <Image
            src="/wordmark.png"
            alt="Razonne+"
            width={158}
            height={63}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>
        <nav className="flex items-center gap-6 text-sm text-mist">
          <Link href="/" className="transition-colors hover:text-frost">
            Catálogo
          </Link>

          {status === "authenticated" && session?.user?.email ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-frost sm:inline">{session.user.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md border border-rim px-3.5 py-1.5 text-sm text-frost transition-colors hover:border-mist"
              >
                Sair
              </button>
            </div>
          ) : status === "loading" ? null : (
            <div className="flex items-center gap-3">
              <Link href="/entrar" className="transition-colors hover:text-frost">
                Entrar
              </Link>
              <Link
                href="/criar-conta"
                className="rounded-md bg-razonne-gradient px-3.5 py-1.5 text-sm font-medium text-void transition-opacity hover:opacity-90"
              >
                Criar conta
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
