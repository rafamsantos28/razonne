import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-content flex-col items-start justify-center gap-4 px-6 md:px-10">
      <h1 className="font-display text-2xl font-semibold text-frost">
        Não encontrámos essa página
      </h1>
      <p className="text-sm text-mist">
        O título que procuras pode ter sido removido ou o endereço está incorreto.
      </p>
      <Link
        href="/"
        className="rounded-md border border-rim px-5 py-2.5 text-sm text-frost transition-colors hover:border-mist"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
