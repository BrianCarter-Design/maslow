import { Link } from 'react-router-dom'

interface NavbarProps {
  userName?: string
}

export default function Navbar({ userName }: NavbarProps) {
  const initials = userName ? userName.slice(0, 1).toUpperCase() : '?'

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-10 py-6 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
          >
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-xl text-[#111928] tracking-tight">Maslow</span>
        </Link>

        {/* Nav Links */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <Link to="/" className="font-medium text-[#111928] text-base hover:text-[#5d0096] transition-colors">
            Blog
          </Link>
          <Link to="/" className="font-medium text-[#111928] text-base hover:text-[#5d0096] transition-colors">
            Enneagram
          </Link>
        </div>

        {/* Avatar */}
        {userName ? (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
          >
            {initials}
          </div>
        ) : (
          <Link
            to="/"
            className="shrink-0 px-5 py-2 rounded-full font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
          >
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  )
}
