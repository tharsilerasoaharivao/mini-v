// Navbar.jsx
import { useState, useEffect } from "react";

export default function Navbar() {
  const [lang, setLang] = useState("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { label: "Tableau de bord", href: "#" },
    { label: "Infrastructures", href: "#" },
    { label: "Analyse & Statistiques", href: "#" },
    { label: "Rapports", href: "#" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full text-white shadow-lg z-50 transition-all duration-300 ${scrolled ? "bg-slate-900/95 backdrop-blur-sm shadow-xl" : "bg-slate-900"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* LOGO */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-blue-500 rounded-lg p-1.5">
            <div className="w-6 h-6 flex items-center justify-center text-white font-bold">DU</div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Dashboard Urbain
          </h1>
        </div>

        {/* MENUS PRINCIPAUX */}
        <ul className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item, index) => (
            <li key={index}>
              <a href={item.href} className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:bg-slate-800/50 hover:text-blue-300 group border-r border-slate-700 last:border-r-0">
               
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* DROITE */}
        <div className="flex justify-end items-center w-full gap-3">
          <div className="relative group">
            <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 pr-8 appearance-none cursor-pointer transition-all duration-200 hover:bg-slate-700 focus:(outline-none ring-2 ring-blue-400) group-hover:border-slate-600">
              <option value="fr">🇫🇷 FR</option>
              <option value="mg">🇲🇬 MG</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="text-xs">▼</span>
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25">
            Connexion
          </button>

          <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/25 flex items-center gap-2">
           
            Inscription
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden text-2xl p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MENU MOBILE */}
      <div className={`md:hidden bg-slate-800 transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col items-stretch px-4">
          {navItems.map((item, index) => (
            <a key={index} href={item.href} className="flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-slate-700/50 hover:text-blue-300 border-b border-slate-700 last:border-b-0" onClick={() => setMenuOpen(false)}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </a>
          ))}

          <div className="border-t border-slate-700 mt-3 pt-4 px-4">
            <div className="flex items-center gap-3 mb-4">
              <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="fr">🇫🇷 Français</option>
                <option value="mg">🇲🇬 Malagasy</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 text-center">
                Connexion
              </button>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 text-center flex items-center justify-center gap-2">
                
                Tableau
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}