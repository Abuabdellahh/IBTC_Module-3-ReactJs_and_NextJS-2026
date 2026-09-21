import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor, index = 0 }) {
  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card card-lift overflow-hidden group">

        {/* Card top accent */}
        <div className="h-1.5 bg-gradient-to-r from-sky-400 to-cyan-400" />

        <div className="p-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center text-2xl ring-2 ring-sky-200 group-hover:ring-sky-400 transition-all duration-300">
                👨‍⚕️
              </div>
              {doctor.available && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse-slow" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{doctor.name}</h3>
              <p className="text-sm text-sky-500 font-medium">{doctor.specialty}</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-amber-400">★</span>
              <span className="font-semibold text-gray-800">{doctor.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>🕐</span>
              <span>{doctor.experience}</span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                doctor.available
                  ? 'bg-green-50 text-green-600 ring-1 ring-green-200'
                  : 'bg-red-50 text-red-500 ring-1 ring-red-200'
              }`}
            >
              {doctor.available ? '● Available' : '○ Unavailable'}
            </span>
          </div>

          {/* Bio */}
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{doctor.bio}</p>

          {/* CTA */}
          <Link
            to={`/doctors/${doctor.id}`}
            className="mt-1 text-center bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-sm font-semibold py-2.5 rounded-xl hover:shadow-glow hover:scale-[1.02] transition-all duration-200"
          >
            View & Book →
          </Link>
        </div>
      </div>
    </div>
  )
}
