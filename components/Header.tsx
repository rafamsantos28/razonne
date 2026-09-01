import Link from "next/link";
import Image from "next/image";

export default function Header() {
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
      </div>
    </header>
  );
}
