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
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Doctor not found.</p>
        <Link to="/doctors" className="text-primary hover:underline mt-4 inline-block">
          ← Back to Doctors
        </Link>
      </div>
    )
  }

  const handleBook = () => {
    if (!selectedSlot) return
    setBooked(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/doctors" className="text-primary text-sm hover:underline mb-6 inline-block">
        ← Back to Doctors
      </Link>

      {/* Doctor profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-3xl">
            👨⚕️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
            <p className="text-primary font-medium">{doctor.specialty}</p>
            <p className="text-sm text-gray-500">{doctor.experience} experience · ⭐ {doctor.rating}</p>
          </div>
        </div>
        <p className="text-gray-600">{doctor.bio}</p>
      </div>

      {/* Booking */}
      {booked ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-2xl mb-2">✅</p>
          <h2 className="text-lg font-semibold text-green-800">Appointment Booked!</h2>
          <p className="text-green-700 text-sm mt-1">
            {doctor.name} at {selectedSlot}
          </p>
          <Link
            to="/appointments"
            className="mt-4 inline-block bg-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors"
          >
            View My Appointments
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Select a Time Slot</h2>

          {doctor.available ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {doctor.slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSlot === slot
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <button
                onClick={handleBook}
                disabled={!selectedSlot}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </>
          ) : (
            <p className="text-red-500 text-sm">This doctor is currently unavailable for booking.</p>
          )}
        </div>
      )}
    </div>
  )
}
