import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GameProvider } from './store/GameContext'
import { LangProvider } from './store/LangContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
