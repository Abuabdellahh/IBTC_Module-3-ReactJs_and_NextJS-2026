import { Link } from 'react-router-dom'
import { appointments } from '../data/mockData'

const statusStyle = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function Appointments() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
      <p className="text-gray-500 mb-8">Track and manage your upcoming visits</p>

      {appointments.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-lg">No appointments yet.</p>
          <Link to="/doctors" className="text-primary hover:underline mt-2 inline-block">
            Book your first appointment →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((apt) => (
            <Link
              key={apt.id}
              to={`/appointments/${apt.id}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-xl">
                  👨⚕️
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{apt.doctorName}</p>
                  <p className="text-sm text-gray-500">{apt.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700 font-medium">{apt.date} · {apt.time}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[apt.status]}`}>
                  {apt.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
