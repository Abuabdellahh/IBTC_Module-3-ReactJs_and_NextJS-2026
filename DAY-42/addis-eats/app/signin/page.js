// app/signin/page.js
// Public page — shows the sign-in form.
// Reads ?next= from the URL so we can return the user to their original destination.

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const next = params.next || "/";

  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Sign in</h1>

        <p className="mb-4 text-xs text-purple-600">
          Demo credentials:<br />
          <strong>Customer:</strong> user@example.com / password123<br />
          <strong>Staff:</strong> staff@example.com / staffpass123
        </p>

        <form action="/api/signin" method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Hidden field carries the original destination through the form POST */}
          <input type="hidden" name="next" value={next} />

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
