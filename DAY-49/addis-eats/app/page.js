// app/page.js — home. Static (prerendered at build): it reads only the catalogue.

import Link from "next/link";
import DishCard from "@/components/DishCard";
import { btn, card } from "@/components/styles";
import { getDishes } from "@/lib/menu";

const STEPS = [
  { icon: "📋", title: "Pick your dishes", text: "Browse the menu and add what you fancy to your cart." },
  { icon: "📱", title: "Check out in a minute", text: "Give a phone number and a landmark — no card needed." },
  { icon: "🛵", title: "Follow it live", text: "Watch your order go from the kitchen to your door." },
];

export default function HomePage() {
  const featured = getDishes().slice(0, 3);

  return (
    <>
      <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Bole · Piassa · CMC · Sarbet</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Home-style Ethiopian food, delivered across Addis Ababa.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Doro Wat for the weekend, Beyaynetu for fasting days, and Buna whenever you need it.
            Order in a minute and follow your delivery live.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className={btn.primary}>Browse the menu</Link>
            <Link href="/signup" className={btn.secondary}>Create an account</Link>
          </div>
        </div>
        <div aria-hidden="true" className="hidden h-72 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-100 via-brand-50 to-brand-100 text-9xl lg:flex">
          🍲
        </div>
      </section>

      <section aria-labelledby="how-heading" className="mt-16">
        <h2 id="how-heading" className="text-2xl font-bold">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className={`${card} p-5`}>
              <p className="text-3xl" aria-hidden="true">{step.icon}</p>
              <h3 className="mt-3 font-bold">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="featured-heading" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="featured-heading" className="text-2xl font-bold">Popular this week</h2>
          <Link href="/menu" className="font-semibold text-brand-700 underline">See the full menu</Link>
        </div>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((dish) => (
            <li key={dish.id} className="flex">
              <DishCard dish={dish} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
