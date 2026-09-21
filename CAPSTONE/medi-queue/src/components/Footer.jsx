import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white text-xs">✚</span>
              </div>
              <span className="font-bold text-lg text-white">MediQueue</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Skip the line, not the care. Book clinic appointments in seconds and take control of your health.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/doctors', label: 'Find a Doctor' },
                { to: '/appointments', label: 'My Appointments' },
                { to: '/login', label: 'Login' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-500 hover:text-sky-400 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500">
              <li>📧 support@mediqueue.com</li>
              <li>📞 +251 911 000 000</li>
              <li>📍 Addis Ababa, Ethiopia</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2026 MediQueue. All rights reserved.</p>
          <p className="text-xs text-gray-600">
            Built with ❤️ for IBT Module 3 Capstone — React & Next.js 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
