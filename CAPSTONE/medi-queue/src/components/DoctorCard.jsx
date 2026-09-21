import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-2xl">
          👨‍⚕️
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
          <p className="text-sm text-primary">{doctor.specialty}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>⭐ {doctor.rating}</span>
        <span>{doctor.experience}</span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            doctor.available
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {doctor.available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <Link
        to={`/doctors/${doctor.id}`}
        className="mt-1 text-center bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-dark transition-colors"
      >
        View & Book
      </Link>
    </div>
  )
}
