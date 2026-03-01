import { Routes, Route, Navigate } from 'react-router-dom'
import { useGame } from './store/GameContext'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import CreateTournament from './screens/CreateTournament'
import TournamentDetail from './screens/TournamentDetail'
import ScoreEntry from './screens/ScoreEntry'
import Leaderboard from './screens/Leaderboard'
import Profile from './screens/Profile'
import Table from './screens/Table'
import Games from './screens/Games'

function Protected({ children }) {
  const { currentPlayer } = useGame()
  if (!currentPlayer) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/create" element={<Protected><CreateTournament /></Protected>} />
      <Route path="/tournament/:id" element={<Protected><TournamentDetail /></Protected>} />
      <Route path="/tournament/:id/match/:matchId" element={<Protected><ScoreEntry /></Protected>} />
      <Route path="/tournament/:id/leaderboard" element={<Protected><Leaderboard /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/table"   element={<Protected><Table /></Protected>} />
      <Route path="/games"   element={<Protected><Games /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
