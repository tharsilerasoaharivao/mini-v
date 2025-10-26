import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Accueil from './pages/Accueil'
import Carte from './pages/Carte'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar/>
        <main className="pt-16"> {/* Compensation pour la navbar fixe */}
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/carte" element={<Carte />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

// Composant pour la page 404


export default App