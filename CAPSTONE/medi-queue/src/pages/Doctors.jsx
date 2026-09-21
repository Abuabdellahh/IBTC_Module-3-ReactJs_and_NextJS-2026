import { useState } from 'react'
import { doctors } from '../data/mockData'
import DoctorCard from '../components/DoctorCard'

const specialties = ['All', ...new Set(doctors.map((d) => d.specialty))]

export default function Doctors() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = doctors.filter((d) => {
    const matchSpec = filter === 'All' || d.specialty === filter
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
    return matchSpec && matchSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-gradient-to-br from-sky-950 to-sky-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-2 animate-fade-in">Our Team</p>
          <h1 className="text-4xl font-extrabold mb-3 animate-fade-up">Find Your Doctor</h1>
          <p className="text-sky-300 animate-fade-up delay-100">Browse specialists and book your appointment instantly</p>

          {/* Search bar */}
          <div className="mt-6 max-w-md animate-fade-up delay-200">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-sky-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {specialties.map((s, i) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 animate-fade-in ${
                filter === s
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-transparent shadow-glow scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300 hover:text-sky-500 hover:scale-105'
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> doctor{filtered.length !== 1 ? 's' : ''}
          {filter !== 'All' && <span> in <span className="text-sky-500 font-semibold">{filter}</span></span>}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doctor, i) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg font-medium">No doctors found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
