import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Kiosk from './pages/Kiosk'
import Dashboard from './pages/Dashboard'

function App() {
  // Jika URL memiliki parameter ?page=hasil atau URL path diakhiri /hasil
  const isDashboard = window.location.search.includes('page=hasil') || window.location.hash.includes('hasil');

  return isDashboard ? <Dashboard /> : <Kiosk />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)