// components/DishTile.js — decorative dish artwork. An emoji on a warm tile
// costs zero image bytes (nothing to optimise, no CLS) and is hidden from
// screen readers because the dish name next to it already says what it is.

export default function DishTile({ emoji, size = "md" }) {
  const sizes = { md: "h-28 text-5xl", lg: "h-56 text-8xl" };
  return (
    <div
      aria-hidden="true"
      className={`flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-brand-100 ${sizes[size]}`}
    >
      {emoji}
    </div>
  );
}
