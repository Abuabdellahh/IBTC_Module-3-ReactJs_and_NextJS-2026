// app/not-found.js — rendered for any unmatched route
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-bold text-purple-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-800">Page not found</h1>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700"
      >
        Go home
      </Link>
    </main>
  );
}
