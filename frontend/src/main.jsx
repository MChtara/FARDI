import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AppTheme from './theme.jsx'

// Phase 4: Design System and Animations
import './styles/theme.css'
import './animations/animations.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <AppTheme>
      <BrowserRouter basename="/app">
        <App />
      </BrowserRouter>
    </AppTheme>
  </StrictMode>
)
