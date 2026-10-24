// app/menu/page.js — Static. The full catalogue is rendered into the HTML at
// build time and handed to MenuBrowser for instant client-side filtering.

import MenuBrowser from "@/components/MenuBrowser";
import { CATEGORIES, getDishes } from "@/lib/menu";

export const metadata = {
  title: "Menu",
  description: "Doro Wat, Kitfo, Tibs, Shiro, Beyaynetu and Buna — the full Addis Eats menu with prices in birr.",
  alternates: { canonical: "/menu" },
  openGraph: { url: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Our menu</h1>
      <p className="mt-2 mb-8 text-muted">Cooked to order in our Bole kitchen. Prices include VAT.</p>
      <MenuBrowser dishes={getDishes()} categories={CATEGORIES} />
    </>
  );
}
