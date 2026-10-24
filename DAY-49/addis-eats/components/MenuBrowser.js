"use client";
// components/MenuBrowser.js
// The dishes arrive as props from the static menu page, so search and filter
// run in the browser with no network request at all. useDeferredValue keeps
// typing responsive (INP) while the list re-renders.

import { useDeferredValue, useState } from "react";
import DishCard from "./DishCard";
import EmptyState from "./EmptyState";
import { field } from "./styles";

export default function MenuBrowser({ dishes, categories }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visible = dishes.filter((dish) => {
    const inCategory = category === "All" || dish.category === category;
    const matches =
      !deferredQuery ||
      dish.name.toLowerCase().includes(deferredQuery) ||
      dish.description.toLowerCase().includes(deferredQuery);
    return inCategory && matches;
  });

  return (
    <>
      <form role="search" onSubmit={(event) => event.preventDefault()} className="mb-4 max-w-md">
        <label htmlFor="dish-search" className={field.label}>Search the menu</label>
        <input
          id="dish-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “tibs” or “lentil”"
          className={field.input}
          autoComplete="off"
        />
      </form>

      <div role="group" aria-label="Filter by category" className="mb-6 flex flex-wrap gap-2">
        {["All", ...categories].map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
            className="min-h-11 rounded-full border border-line bg-surface px-4 text-sm font-medium aria-pressed:border-brand-600 aria-pressed:bg-brand-600 aria-pressed:text-white"
          >
            {name}
          </button>
        ))}
      </div>

      <p role="status" className="mb-4 text-sm text-muted">
        {visible.length} {visible.length === 1 ? "dish" : "dishes"}
      </p>

      {visible.length === 0 ? (
        <EmptyState icon="🔍" title="No dishes match">
          Nothing matches “{query}” {category !== "All" && `in ${category}`}. Try another word or clear the filter.
        </EmptyState>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((dish) => (
            <li key={dish.id} className="flex">
              <DishCard dish={dish} headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
