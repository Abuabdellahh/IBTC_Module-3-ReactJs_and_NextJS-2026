import { Link } from 'react-router-dom'

const stats = [
  { label: 'Doctors', value: '50+', icon: '👨⚕️' },
  { label: 'Patients Served', value: '10,000+', icon: '🏥' },
  { label: 'Specialties', value: '20+', icon: '🩺' },
  { label: 'Avg Wait Time', value: '< 5 min', icon: '⚡' },
]

const steps = [
  { icon: '🔍', step: '01', title: 'Find a Doctor', desc: 'Browse by specialty and real-time availability' },
  { icon: '📅', step: '02', title: 'Pick a Slot', desc: 'Choose a date and time that works for you' },
  { icon: '✅', step: '03', title: 'Get Confirmed', desc: 'Receive instant booking confirmation' },
]

const specialties = [
  { icon: '🫀', name: 'Cardiology' },
  { icon: '🧠', name: 'Neurology' },
  { icon: '🦷', name: 'Dentistry' },
  { icon: '👁️', name: 'Ophthalmology' },
  { icon: '🦴', name: 'Orthopedics' },
  { icon: '👶', name: 'Pediatrics' },
]

export default function Home() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-sky-950 via-sky-900 to-cyan-900 text-white overflow-hidden">

        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-sky-200 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Now accepting new patients
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-up">
              Skip the Line,<br />
              <span className="text-gradient">Not the Care</span>
            </h1>

            <p className="text-sky-200 text-lg leading-relaxed mb-8 animate-fade-up delay-200">
              Book clinic appointments in seconds. No more waiting rooms, no more wasted hours. Your health, on your schedule.
            </p>

            <div className="flex gap-4 flex-wrap animate-fade-up delay-300">
              <Link
                to="/doctors"
                className="bg-white text-sky-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-sky-50 hover:scale-105 hover:shadow-glow-lg transition-all duration-200 shadow-lg"
              >
                Find a Doctor →
              </Link>
              <Link
                to="/appointments"
                className="glass border border-white/30 text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/20 transition-all duration-200"
              >
                My Appointments
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 animate-fade-up delay-400">
              <div className="flex -space-x-2">
                {['🧑', '👩', '👨', '👩‍⚕️'].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-sky-700 border-2 border-sky-900 flex items-center justify-center text-sm">
                    {e}
                  </div>
                ))}
              </div>
              <p className="text-sm text-sky-300">
                <span className="text-white font-semibold">10,000+</span> patients trust us
              </p>
            </div>
          </div>

          {/* Right — floating card */}
          <div className="hidden md:flex justify-center animate-fade-in delay-300">
            <div className="relative">
              {/* Main card */}
              <div className="glass rounded-3xl p-6 w-72 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-xl shadow-glow">
                    👨⚕️
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Dr. Aisha Bekele</p>
                    <p className="text-xs text-sky-500">General Practice</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'].map((t, i) => (
                    <div
                      key={t}
                      className={`text-center py-2 rounded-xl text-xs font-medium border transition-all ${
                        i === 1
                          ? 'bg-sky-500 text-white border-sky-500 shadow-glow'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-center py-2.5 rounded-xl text-sm font-semibold shadow-glow">
                  Confirm Booking ✓
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 glass rounded-2xl px-3 py-2 shadow-lg animate-bounce-slow">
                <p className="text-xs font-semibold text-gray-700">⭐ 4.9 Rating</p>
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-3 py-2 shadow-lg animate-float">
                <p className="text-xs font-semibold text-green-600">✅ Confirmed!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-5 text-center shadow-card border border-gray-100 animate-fade-up card-lift"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-2xl font-extrabold text-gradient">{s.value}</p>
              <p className="text-gray-500 text-xs mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Specialties ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Specialty</h2>
          <p className="text-gray-500">Find the right expert for your specific health needs</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {specialties.map((s, i) => (
            <Link
              key={s.name}
              to="/doctors"
              className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-card card-lift group animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{s.icon}</div>
              <p className="text-xs font-semibold text-gray-700">{s.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-sky-950 to-cyan-900 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-sky-300 mb-14">Three simple steps to your appointment</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className="relative animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-sky-500/50 to-transparent" />
                )}
                <div className="glass rounded-3xl p-7 text-center hover:bg-white/20 transition-all duration-300 card-lift">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-2xl mx-auto mb-4 shadow-glow">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-sky-400 tracking-widest mb-2">STEP {item.step}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-sky-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-sky-500 to-cyan-400 rounded-3xl p-12 shadow-glow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <h2 className="relative text-3xl font-extrabold text-white mb-3">Ready to Skip the Queue?</h2>
          <p className="relative text-sky-100 mb-8">Join thousands of patients who book smarter with MediQueue</p>
          <Link
            to="/doctors"
            className="relative inline-block bg-white text-sky-600 font-bold px-8 py-3.5 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            Book Your Appointment →
          </Link>
        </div>
      </section>

    </div>
  )
}
