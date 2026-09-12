// Faixa/etiqueta de classificação etária, no estilo das classificações
// portuguesas (M/6, M/12, M/16, M/18...). A cor muda consoante a idade,
// para que seja reconhecível de relance tanto na página principal como na
// página de detalhes.

/** Extrai o número da idade a partir de valores como "12+", "12" ou "M/12". */
function parseAge(age: string): number | null {
  const match = /\d+/.exec(age);
  if (!match) return null;
  return Number(match[0]);
}

/** Classes de cor consoante o escalão etário. */
export function ageToneClasses(age?: string): string {
  if (!age) return "bg-rim text-mist";
  const n = parseAge(age);
  if (n === null) return "bg-rim text-mist";
  if (n >= 18) return "bg-[#E14848] text-frost";
  if (n >= 16) return "bg-bloom text-void";
  if (n >= 12) return "bg-[#F2B84B] text-void";
  return "bg-teal text-void";
}

/** Texto a mostrar, ex: "M/12" ou "Todos" para o escalão mais baixo. */
export function ageLabel(age?: string): string | null {
  if (!age) return null;
  const n = parseAge(age);
  if (n === null) return age;
  return `M/${n}`;
}

export default function AgeBadge({
  age,
  className = "",
  size = "sm",
}: {
  age?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const label = ageLabel(age);
  if (!label) return null;

  const sizing =
    size === "md"
      ? "px-2.5 py-1 text-[13px]"
      : "px-1.5 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-semibold leading-none tracking-wide ${sizing} ${ageToneClasses(age)} ${className}`}
      aria-label={`Classificação etária: ${label}`}
    >
      {label}
    </span>
  );
}
