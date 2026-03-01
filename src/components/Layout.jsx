import StatusBar from './StatusBar'
import BottomNav from './BottomNav'

export default function Layout({ children, hideNav }) {
  return (
    <div className="min-h-screen bg-[#0A0F1E] relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(55,181,233,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '15%', right: '-10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(75,75,237,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Mobile container */}
      <div className="max-w-sm mx-auto relative z-10 min-h-screen flex flex-col">
        <StatusBar />
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: hideNav ? 0 : 80 }}>
          {children}
        </div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  )
}
