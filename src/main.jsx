import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'virtual:windi.css'  // ✅ seulement si le plugin Vite WindiCSS est actif
import App from './App.jsx'
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
