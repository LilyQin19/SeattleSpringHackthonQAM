import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { TrainingPlanProvider } from '@/contexts/TrainingPlanContext'
import { RunProvider } from '@/contexts/RunContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <TrainingPlanProvider>
        <RunProvider>
          <App />
        </RunProvider>
      </TrainingPlanProvider>
    </AuthProvider>
  </React.StrictMode>,
)
