import { useParams, Link } from 'react-router-dom'
import { appointments, doctors } from '../data/mockData'

const statusStyle = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function AppointmentDetail() {
  const { id } = useParams()
  const apt = appointments.find((a) => a.id === id)
  const doctor = apt ? doctors.find((d) => d.id === apt.doctorId) : null

  if (!apt) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Appointment not found.</p>
        <Link to="/appointments" className="text-primary hover:underline mt-4 inline-block">
          ← Back to Appointments
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/appointments" className="text-primary text-sm hover:underline mb-6 inline-block">
        ← Back to Appointments
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">Appointment Details</h1>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusStyle[apt.status]}`}>
            {apt.status}
          </span>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <Row label="Appointment ID" value={apt.id} />
          <Row label="Patient" value={apt.patientName} />
          <Row label="Doctor" value={apt.doctorName} />
          <Row label="Specialty" value={apt.specialty} />
          <Row label="Date" value={apt.date} />
          <Row label="Time" value={apt.time} />
          {doctor && <Row label="Doctor Bio" value={doctor.bio} />}
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 border border-red-300 text-red-500 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
            Cancel Appointment
          </button>
          <Link
            to={`/doctors/${apt.doctorId}`}
            className="flex-1 bg-primary text-white text-center py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors"
          >
            Rebook
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-50 pb-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium text-right max-w-xs">{value}</span>
    </div>
  )
}
