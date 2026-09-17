import { initials } from "@/lib/utils";

const HUES = [
  "var(--color-brand)",
  "var(--color-violet)",
  "var(--color-blue)",
  "var(--color-amber)",
  "var(--color-cyan)",
  "var(--color-rose)",
];

function hueFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return HUES[h % HUES.length];
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const color = hueFor(name);
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}
