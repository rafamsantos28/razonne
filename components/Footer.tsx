import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-rim/60">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-10 text-sm text-mist md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-2">
          <Image src="/mark.png" alt="" width={22} height={22} className="opacity-80" />
          <span>Razonne+ / razonneplus.pt</span>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-mist/70">
          Vídeo entregue com Mux. Todos os títulos apresentados pertencem aos
          seus respetivos autores.
        </p>
      </div>
    </footer>
  );
}
