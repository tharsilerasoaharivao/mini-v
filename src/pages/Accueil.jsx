import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Accueil() {
  const [selectedCity, setSelectedCity] = useState("Antananarivo");
  const [activeTab, setActiveTab] = useState("infrastructures");
  const navigate = useNavigate();

  const cities = [
    { name: "Antananarivo", coords: [-18.8792, 47.5079], zoom: 11 },
    { name: "Toamasina", coords: [-18.1499, 49.4023], zoom: 12 },
    { name: "Antsirabe", coords: [-19.8667, 47.0333], zoom: 13 },
    { name: "Fianarantsoa", coords: [-21.4536, 47.0858], zoom: 12 },
    { name: "Mahajanga", coords: [-15.7167, 46.3167], zoom: 12 },
    { name: "Toliara", coords: [-23.3544, 43.6698], zoom: 12 }
  ];

  const stats = [
    { label: "Routes asphaltées", value: "65%", change: "+5%", positive: true },
    { label: "Réseaux d'eau potable", value: "78%", change: "+2%", positive: true },
    { label: "Éclairage public", value: "45%", change: "-3%", positive: false },
    { label: "Espaces verts", value: "32%", change: "+8%", positive: true }
  ];

  const recentProjects = [
    { name: "Rénovation RN2", progress: 75, status: "En cours" },
    { name: "Nouveau réseau eau", progress: 90, status: "Bientôt terminé" },
    { name: "Éclairage LED", progress: 40, status: "En cours" },
    { name: "Parc urbain", progress: 100, status: "Terminé" }
  ];

  const handleExploreMap = () => {
    // Trouver les données complètes de la ville sélectionnée
    const selectedCityData = cities.find(city => city.name === selectedCity);
    
    // Rediriger vers la page /carte avec toutes les données de la ville
    navigate('/carte', { 
      state: { 
        selectedCity: selectedCityData 
      } 
    });
  };

  const handleNavigation = (path, city = null) => {
    if (city) {
      const cityData = cities.find(c => c.name === city);
      navigate(path, { state: { selectedCity: cityData } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">

      {/* Hero Section */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center">
          Tableau de Bord <span className="text-blue-400">Cartographique</span>
        </h1>
        <p className="text-2xl md:text-3xl text-slate-300 mb-12 text-center leading-relaxed max-w-4xl">
          Outil décisionnel intelligent pour l'analyse et la gestion des infrastructures urbaines malgaches
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 w-full max-w-4xl">
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto text-lg"
          >
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
          <button 
            onClick={handleExploreMap}
            className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg w-full sm:w-auto transition-all duration-300 transform hover:scale-105"
          >
            Explorer la Carte
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto px-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-400 transition-all duration-300 w-full">
              <div className="text-slate-400 text-lg mb-3">{stat.label}</div>
              <div className="text-4xl font-bold mb-3">{stat.value}</div>
              <div className={`text-lg font-semibold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change} vs dernier trimestre
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-700 py-12 w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-4 md:px-8">
          <div>
            <h3 className="text-white font-semibold text-2xl mb-6">Dashboard Urbain</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Outil de prise de décision pour le développement des infrastructures urbaines à Madagascar.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Navigation</h4>
            <ul className="space-y-4 text-lg text-slate-400">
              <li><button onClick={() => handleNavigation('/')} className="hover:text-blue-400 transition-colors">Accueil</button></li>
              <li><button onClick={() => handleNavigation('/carte')} className="hover:text-blue-400 transition-colors">Carte Interactive</button></li>
              <li><button onClick={() => handleNavigation('/rapports')} className="hover:text-blue-400 transition-colors">Rapports</button></li>
              <li><button onClick={() => handleNavigation('/contact')} className="hover:text-blue-400 transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Villes</h4>
            <ul className="space-y-4 text-lg text-slate-400">
              {cities.slice(0, 4).map(city => (
                <li key={city.name}>
                  <button 
                    onClick={() => handleNavigation('/carte', city.name)}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {city.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Contact</h4>
            <ul className="space-y-4 text-lg text-slate-400">
              <li>contact@dashboard-urbain.mg</li>
              <li>+261 34 00 000 00</li>
              <li>Antananarivo, Madagascar</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400 text-lg max-w-7xl mx-auto px-4 md:px-8">
          © 2024 Dashboard Urbain Madagascar. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}