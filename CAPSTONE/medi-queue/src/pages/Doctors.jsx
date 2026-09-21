import { useState } from 'react'
import { doctors } from '../data/mockData'
import DoctorCard from '../components/DoctorCard'

const specialties = ['All', ...new Set(doctors.map((d) => d.specialty))]

export default function Doctors() {
  const [filter, setFilter] = useState('All')

  const filtered =
    filter === 'All' ? doctors : doctors.filter((d) => d.specialty === filter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Doctors</h1>
      <p className="text-gray-500 mb-6">Find the right specialist for your needs</p>

      {/* Specialty filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === s
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  )
}
