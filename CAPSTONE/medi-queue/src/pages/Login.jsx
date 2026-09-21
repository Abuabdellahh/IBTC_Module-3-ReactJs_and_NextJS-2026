import { useState } from 'react'

export default function Login() {
  const [focused, setFocused] = useState(null)

  return (
    <div className="min-h-[calc(100vh-64px)] flex">

      {/* Left — gradient panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-sky-950 via-sky-900 to-cyan-900 relative overflow-hidden items-center justify-center p-12">

        {/* Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-float-slow" />

        <div className="relative text-center text-white animate-fade-up">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-4xl mx-auto mb-6 shadow-glow">
            ✚
          </div>
          <h2 className="text-3xl font-extrabold mb-3">MediQueue</h2>
          <p className="text-sky-300 text-lg mb-10">Skip the Line, Not the Care</p>

          {/* Feature list */}
          <div className="flex flex-col gap-4 text-left max-w-xs mx-auto">
            {[
              { icon: '⚡', text: 'Book appointments in seconds' },
              { icon: '👨⚕️', text: 'Access 50+ verified doctors' },
              { icon: '📅', text: 'Manage all your visits in one place' },
              { icon: '🔒', text: 'Your data is safe and private' },
            ].map(({ icon, text }, i) => (
              <div
                key={text}
                className="flex items-center gap-3 glass rounded-2xl px-4 py-3 animate-slide-in-left"
                style={{ animationDelay: `${i * 100 + 200}ms` }}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm text-sky-100 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md animate-fade-up">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-2xl mx-auto mb-3 shadow-glow">
              ✚
            </div>
            <h1 className="text-2xl font-extrabold text-gradient">MediQueue</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-400 text-sm mb-8">Sign in to manage your appointments</p>

            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className={`relative rounded-2xl border transition-all duration-200 ${
                  focused === 'email' ? 'border-sky-400 shadow-glow ring-2 ring-sky-100' : 'border-gray-200'
                }`}>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📧</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <span className="text-xs text-sky-500 cursor-pointer hover:underline">Forgot password?</span>
                </div>
                <div className={`relative rounded-2xl border transition-all duration-200 ${
                  focused === 'password' ? 'border-sky-400 shadow-glow ring-2 ring-sky-100' : 'border-gray-200'
                }`}>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold py-3.5 rounded-2xl hover:shadow-glow hover:scale-[1.02] transition-all duration-200 mt-1"
              >
                Sign In →
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <span className="text-sky-500 font-semibold cursor-pointer hover:underline">Create one free</span>
            </p>

            <div className="mt-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">🔒</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                Authentication coming in Sprint 2 — protected routes will be wired here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
