// Capa gerada em SVG quando um título ainda não tem `poster` definido em
// lib/catalog.ts. Usa um gradiente e iniciais derivadas do título para que o
// catálogo pareça intencional mesmo antes de teres imagens reais.

function hueSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

export default function PosterArt({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const seed = hueSeed(title);
  const id = `pg-${seed}`;
  const initials = title
    .split(" ")
    .filter((w) => w.length > 2 || w === title.split(" ")[0])
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <svg
      viewBox="0 0 300 450"
      className={className}
      role="img"
      aria-label={`Capa de ${title}`}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#101319" />
          <stop offset="45%" stopColor={`hsl(${(seed + 170) % 360} 55% 22%)`} />
          <stop offset="100%" stopColor={`hsl(${seed} 60% 24%)`} />
        </linearGradient>
        <linearGradient id={`${id}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#49E4D9" />
          <stop offset="100%" stopColor="#F06FC0" />
        </linearGradient>
      </defs>
      <rect width="300" height="450" fill={`url(#${id})`} />
      <rect width="300" height="450" fill="#0A0B0E" fillOpacity="0.15" />
      <line x1="28" y1="382" x2="120" y2="382" stroke={`url(#${id}-line)`} strokeWidth="3" />
      <text
        x="28"
        y="360"
        fontSize="54"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        fill="#EAF3F3"
        fillOpacity="0.92"
      >
        {initials}
      </text>
    </svg>
  );
}
