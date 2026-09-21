import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doctors } from '../data/mockData'

export default function DoctorDetail() {
  const { id } = useParams()
  const doctor = doctors.find((d) => d.id === id)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [booked, setBooked] = useState(false)

  if (!doctor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <p className="text-6xl mb-4">🏥</p>
        <p className="text-gray-500 text-lg font-medium">Doctor not found.</p>
        <Link to="/doctors" className="text-sky-500 hover:underline mt-4 inline-block font-medium">
          ← Back to Doctors
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Gradient header */}
      <div className="bg-gradient-to-br from-sky-950 to-sky-900 pt-10 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/doctors" className="inline-flex items-center gap-1.5 text-sky-400 text-sm hover:text-sky-300 transition-colors mb-6">
            ← Back to Doctors
          </Link>
          <div className="flex items-center gap-5 animate-fade-up">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-4xl shadow-glow flex-shrink-0">
              👨⚕️
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">{doctor.name}</h1>
              <p className="text-sky-400 font-semibold mt-1">{doctor.specialty}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-sky-300">
                <span>⭐ <span className="text-white font-semibold">{doctor.rating}</span></span>
                <span>🕐 {doctor.experience}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  doctor.available
                    ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
                    : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                }`}>
                  {doctor.available ? '● Available' : '○ Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content — overlaps header */}
      <div className="max-w-3xl mx-auto px-4 -mt-14 pb-16 relative z-10">

        {/* Bio card */}
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6 mb-5 animate-fade-up delay-100">
          <h2 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wider text-sky-500">About</h2>
          <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>

          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
            {[
              { label: 'Experience', value: doctor.experience },
              { label: 'Rating', value: `${doctor.rating} / 5.0` },
              { label: 'Status', value: doctor.available ? 'Available' : 'Unavailable' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="font-bold text-gray-800 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking card */}
        {booked ? (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 text-center animate-scale-in shadow-card">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
            <h2 className="text-xl font-bold text-green-800 mb-1">Appointment Confirmed!</h2>
            <p className="text-green-600 text-sm mb-6">
              <span className="font-semibold">{doctor.name}</span> at <span className="font-semibold">{selectedSlot}</span>
            </p>
            <Link
              to="/appointments"
              className="inline-block bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:shadow-glow hover:scale-105 transition-all duration-200"
            >
              View My Appointments →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6 animate-fade-up delay-200">
            <h2 className="font-bold text-gray-800 mb-1">Select a Time Slot</h2>
            <p className="text-sm text-gray-400 mb-5">All times are in Addis Ababa (EAT)</p>

            {doctor.available ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {doctor.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
                        selectedSlot === slot
                          ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-transparent shadow-glow scale-105'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-sky-300 hover:text-sky-500 hover:scale-105'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => selectedSlot && setBooked(true)}
                  disabled={!selectedSlot}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold py-3.5 rounded-2xl hover:shadow-glow hover:scale-[1.01] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {selectedSlot ? `Confirm Booking — ${selectedSlot}` : 'Select a time slot'}
                </button>
              </>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-red-500 font-medium text-sm">This doctor is currently unavailable for booking.</p>
                <Link to="/doctors" className="text-sky-500 text-sm hover:underline mt-2 inline-block">
                  Browse other doctors →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
