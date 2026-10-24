// components/DishCard.js — presentational; no state, no hooks.

import Link from "next/link";
import { formatETB } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";
import DishTile from "./DishTile";
import { card } from "./styles";

export default function DishCard({ dish, headingLevel: Heading = "h3" }) {
  return (
    <article className={`${card} flex w-full flex-col p-4`}>
      <DishTile emoji={dish.emoji} />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-700">{dish.category}</p>
      <Heading className="mt-1 text-lg font-bold">
        <Link href={`/menu/${dish.id}`} className="hover:text-brand-700 hover:underline">
          {dish.name}
        </Link>
      </Heading>
      <p className="mt-1 flex-1 text-sm text-muted">{dish.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-lg font-bold">{formatETB(dish.price)}</p>
        <AddToCartButton dishId={dish.id} dishName={dish.name} />
      </div>
    </article>
  );
}
