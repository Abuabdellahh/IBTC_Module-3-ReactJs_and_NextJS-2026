import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl">🏥</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your appointments</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <span className="text-primary cursor-pointer hover:underline">Register</span>
        </p>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700 text-center">
          🔒 Authentication coming soon — protected routes will be wired here
        </div>
      </div>
    </div>
  )
}
