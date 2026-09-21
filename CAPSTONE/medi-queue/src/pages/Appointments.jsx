import { Link } from 'react-router-dom'
import { appointments } from '../data/mockData'

const statusConfig = {
  confirmed: {
    bar: 'bg-green-400',
    badge: 'bg-green-50 text-green-600 ring-1 ring-green-200',
    icon: '✅',
  },
  pending: {
    bar: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
    icon: '⏳',
  },
  cancelled: {
    bar: 'bg-red-400',
    badge: 'bg-red-50 text-red-500 ring-1 ring-red-200',
    icon: '❌',
  },
}

export default function Appointments() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-sky-950 to-sky-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-2 animate-fade-in">Dashboard</p>
          <h1 className="text-4xl font-extrabold mb-2 animate-fade-up">My Appointments</h1>
          <p className="text-sky-300 animate-fade-up delay-100">Track and manage your upcoming visits</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {appointments.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">📅</div>
            <p className="text-gray-700 text-lg font-semibold">No appointments yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Book your first appointment with one of our doctors</p>
            <Link
              to="/doctors"
              className="inline-block bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold px-6 py-3 rounded-2xl hover:shadow-glow hover:scale-105 transition-all duration-200"
            >
              Find a Doctor →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((apt, i) => {
              const cfg = statusConfig[apt.status] || statusConfig.pending
              return (
                <Link
                  key={apt.id}
                  to={`/appointments/${apt.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-card card-lift overflow-hidden flex animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Status bar */}
                  <div className={`w-1.5 flex-shrink-0 ${cfg.bar}`} />

                  <div className="flex-1 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                        👨⚕️
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{apt.doctorName}</p>
                        <p className="text-sm text-sky-500 font-medium">{apt.specialty}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Patient: {apt.patientName}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-700">{apt.date}</p>
                      <p className="text-xs text-gray-400 mb-1.5">{apt.time}</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                        {cfg.icon} {apt.status}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center pr-4 text-gray-300 group-hover:text-sky-400 transition-colors">
                    →
                  </div>
                </Link>
              )
            })}

            {/* Book more CTA */}
            <Link
              to="/doctors"
              className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-5 text-sm font-semibold text-gray-400 hover:border-sky-300 hover:text-sky-500 transition-all duration-200 animate-fade-up"
              style={{ animationDelay: `${appointments.length * 100}ms` }}
            >
              + Book another appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
