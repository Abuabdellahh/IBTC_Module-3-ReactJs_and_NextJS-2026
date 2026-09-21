import { Link } from 'react-router-dom'

const stats = [
  { label: 'Doctors', value: '50+' },
  { label: 'Patients Served', value: '10,000+' },
  { label: 'Specialties', value: '20+' },
  { label: 'Avg Wait Time', value: '< 5 min' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-600 to-sky-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Skip the Line, Not the Care
          </h1>
          <p className="text-sky-100 text-lg mb-8">
            Book clinic appointments in seconds. No more waiting rooms, no more
            wasted hours. Your health, on your schedule.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/doctors"
              className="bg-white text-sky-700 font-semibold px-6 py-3 rounded-xl hover:bg-sky-50 transition-colors"
            >
              Find a Doctor
            </Link>
            <Link
              to="/appointments"
              className="border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-sky-700 transition-colors"
            >
              My Appointments
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', step: '1. Find a Doctor', desc: 'Browse by specialty and availability' },
              { icon: '📅', step: '2. Pick a Slot', desc: 'Choose a date and time that works for you' },
              { icon: '✅', step: '3. Get Confirmed', desc: 'Receive instant booking confirmation' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-3">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="font-semibold text-gray-800">{item.step}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
