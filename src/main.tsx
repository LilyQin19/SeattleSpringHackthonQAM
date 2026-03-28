import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { RunProvider } from '@/contexts/RunContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RunProvider>
        <App />
      </RunProvider>
    </AuthProvider>
  </React.StrictMode>,
)
