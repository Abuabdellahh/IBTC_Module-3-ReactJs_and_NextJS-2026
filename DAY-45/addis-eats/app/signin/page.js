// app/signin/page.js — Public sign-in page
// Reads ?next= to return the user to their original destination after sign-in.
// Reads ?error= to show a failed-credentials message.
// Open-redirect protection: next is validated server-side in /api/signin.

export const metadata = {
  title: "Sign in",
  description: "Sign in to your Addis Eats account.",
  robots: { index: false, follow: false },
};

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const next  = params.next  || "/";
  const error = params.error || null;

  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Sign in</h1>

        {error === "invalid" && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            Invalid email or password.
          </div>
        )}

        <div className="mb-4 rounded-lg bg-purple-50 px-4 py-3 text-xs text-purple-700">
          <strong>Demo credentials</strong><br />
          Customer: user@example.com / password123<br />
          Staff: staff@example.com / staffpass123
        </div>

        <form action="/api/signin" method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email" name="email" type="email" required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password" name="password" type="password" required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Carries the original destination — validated server-side to prevent open redirects */}
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
