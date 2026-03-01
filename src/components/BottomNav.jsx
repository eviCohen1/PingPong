import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Trophy, PlusCircle, User, Swords } from 'lucide-react'
import { useLang } from '../store/LangContext'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useLang()

  const NAV = [
    { id: 'home',    icon: Home,       label: t('nav.home'),    path: '/' },
    { id: 'games',   icon: Swords,     label: t('nav.games'),   path: '/games' },
    { id: 'new',     icon: PlusCircle, label: '',               path: '/create', isMain: true },
    { id: 'table',   icon: Trophy,     label: t('nav.table'),   path: '/table' },
    { id: 'profile', icon: User,       label: t('nav.profile'), path: '/profile' },
  ]

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
    >
      <div className="glass border-t border-white/10 mx-0 flex items-center justify-around py-2 px-2">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = item.path === '/'
            ? pathname === '/'
            : pathname.startsWith(item.path)
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-sky' : 'text-white/40'
              }`}
            >
              {item.isMain ? (
                <div className="btn-grad p-2.5 rounded-2xl -mt-5 shadow-lg shadow-sky/30">
                  <Icon size={22} className="text-white" />
                </div>
              ) : (
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? 'text-[#37B5E9]' : 'text-white/40'}
                />
              )}
              {!item.isMain && (
                <span className={`text-[10px] font-semibold ${isActive ? 'text-[#37B5E9]' : 'text-white/30'}`}>
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
