"use client";
// app/menu/useDebounce.js
// Delays updating a value until the user stops typing for `delay` ms.
// Prevents a search request for every individual keystroke.

import { useEffect, useState } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
