import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

export default function Carte() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeBaseMap, setActiveBaseMap] = useState("OpenStreetMap");
  const location = useLocation();
  const navigate = useNavigate();

  const cities = [
    { name: "Antananarivo", coords: [-18.8792, 47.5079], zoom: 11 },
    { name: "Toamasina", coords: [-18.1499, 49.4023], zoom: 12 },
    { name: "Antsirabe", coords: [-19.8667, 47.0333], zoom: 13 },
    { name: "Fianarantsoa", coords: [-21.4536, 47.0858], zoom: 12 },
    { name: "Mahajanga", coords: [-15.7167, 46.3167], zoom: 12 },
    { name: "Toliara", coords: [-23.3544, 43.6698], zoom: 12 }
  ];

  // Récupérer la ville sélectionnée depuis la navigation
  useEffect(() => {
    if (location.state?.selectedCity) {
      setSelectedCity(location.state.selectedCity);
    } else {
      setSelectedCity(cities[0]);
    }
  }, [location.state]);

  // Fonction pour capturer la carte en tant qu'image
  const captureMap = async () => {
    if (!mapInstanceRef.current || isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(mapRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `carte-${selectedCity.name}-${new Date().toISOString().split('T')[0]}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

    } catch (error) {
      console.error('Erreur lors de la capture:', error);
      alert('Erreur lors de la capture de la carte');
    } finally {
      setIsCapturing(false);
    }
  };

  // Initialiser la carte avec la ville sélectionnée
  useEffect(() => {
    if (!mapRef.current || !selectedCity) return;

    const initializeMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Corriger les icônes manquantes
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Initialiser la carte avec la ville sélectionnée
        mapInstanceRef.current = L.map(mapRef.current).setView(selectedCity.coords, selectedCity.zoom);

        // Fond de carte OSM
        const osmBaseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(mapInstanceRef.current);

        // Fond de carte Google Satellite
        const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          attribution: '&copy; Google',
          maxZoom: 20
        });

        // Contrôle des layers
        const baseMaps = {
          "OpenStreetMap": osmBaseMap,
          "Satellite": googleSatellite
        };

        L.control.layers(baseMaps).addTo(mapInstanceRef.current);

        // Ajouter un marqueur pour la ville sélectionnée
        L.marker(selectedCity.coords)
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div class="p-3">
              <h3 class="font-bold text-lg text-blue-800">${selectedCity.name}</h3>
              <p class="text-sm text-gray-600 mt-1">Coordonnées: ${selectedCity.coords[0].toFixed(4)}°, ${selectedCity.coords[1].toFixed(4)}°</p>
              <p class="text-sm text-gray-600">Zoom: ${selectedCity.zoom}</p>
            </div>
          `)
          .openPopup();

        // Redimensionner la carte
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 100);

        setMapLoaded(true);

      } catch (error) {
        console.error('Erreur lors du chargement de la carte:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedCity]);

  // Mettre à jour la carte quand la ville change
  const handleCityChange = (cityName) => {
    const newCity = cities.find(city => city.name === cityName);
    if (newCity && mapInstanceRef.current) {
      setSelectedCity(newCity);
      mapInstanceRef.current.setView(newCity.coords, newCity.zoom);
      
      // Nettoyer les anciens marqueurs
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Ajouter le nouveau marqueur
      const L = require('leaflet');
      L.marker(newCity.coords)
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-3">
            <h3 class="font-bold text-lg text-blue-800">${newCity.name}</h3>
            <p class="text-sm text-gray-600 mt-1">Coordonnées: ${newCity.coords[0].toFixed(4)}°, ${newCity.coords[1].toFixed(4)}°</p>
            <p class="text-sm text-gray-600">Zoom: ${newCity.zoom}</p>
          </div>
        `)
        .openPopup();
    }
  };

  const switchToOSM = () => {
    if (!mapInstanceRef.current) return;
    const L = require('leaflet');
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        if (layer._url.includes('openstreetmap')) {
          layer.addTo(mapInstanceRef.current);
          setActiveBaseMap("OpenStreetMap");
        } else if (layer._url.includes('google')) {
          mapInstanceRef.current.removeLayer(layer);
        }
      }
    });
  };

  const switchToSatellite = () => {
    if (!mapInstanceRef.current) return;
    const L = require('leaflet');
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        if (layer._url.includes('google')) {
          layer.addTo(mapInstanceRef.current);
          setActiveBaseMap("Satellite");
        } else if (layer._url.includes('openstreetmap')) {
          mapInstanceRef.current.removeLayer(layer);
        }
      }
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Redimensionner la carte quand le mode plein écran change
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [isFullscreen, mapLoaded]);

  // Fonction pour quitter le plein écran avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  if (!selectedCity) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay plein écran */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="w-full h-full relative">
            <div 
              ref={mapRef} 
              className="w-full h-full"
            />
            
            {/* Barre de contrôle en mode plein écran - TOUT EN UNE LIGNE */}
            {mapLoaded && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 z-[1000]">
                <div className="flex items-center gap-4">
                  {/* Sélecteur de province */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 text-sm font-semibold">Province:</span>
                    <select 
                      value={selectedCity.name}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {cities.map(city => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Séparateur */}
                  <div className="w-px h-6 bg-slate-300"></div>

                  {/* Fond de carte */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 text-sm font-semibold">Fond:</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={switchToOSM}
                        className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                          activeBaseMap === "OpenStreetMap" 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        🗺️ OSM
                      </button>
                      <button 
                        onClick={switchToSatellite}
                        className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                          activeBaseMap === "Satellite" 
                            ? 'bg-green-500 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        🛰️ Satellite
                      </button>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="w-px h-6 bg-slate-300"></div>

                  {/* Capture */}
                  <button 
                    onClick={captureMap}
                    disabled={isCapturing}
                    className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                      isCapturing 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {isCapturing ? '📸 Capture...' : '📸 Capturer'}
                  </button>

                  {/* Séparateur */}
                  <div className="w-px h-6 bg-slate-300"></div>

                  {/* Plein écran */}
                  <button 
                    onClick={toggleFullscreen}
                    className="px-3 py-1 rounded text-sm bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200"
                  >
                    ✕ Quitter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Carte normale */}
      {!isFullscreen && (
        <div className="min-h-screen bg-slate-900 text-white">
          {/* Header avec navigation et contrôles */}
          <header className="bg-slate-800 border-b border-slate-700 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Bouton retour */}
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                >
                  ← Retour
                </button>

                {/* TOUS LES CONTRÔLES EN UNE LIGNE */}
                <div className="flex items-center gap-6">
                  {/* Sélecteur de province */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm font-semibold">Province:</span>
                    <select 
                      value={selectedCity.name}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-40"
                    >
                      {cities.map(city => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Séparateur */}
                  <div className="w-px h-8 bg-slate-600"></div>

                  {/* Fond de carte */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm font-semibold">Fond de carte:</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={switchToOSM}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          activeBaseMap === "OpenStreetMap" 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                        }`}
                      >
                        🗺️ OpenStreetMap
                      </button>
                      <button 
                        onClick={switchToSatellite}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          activeBaseMap === "Satellite" 
                            ? 'bg-green-500 text-white shadow-lg' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                        }`}
                      >
                        🛰️ Satellite
                      </button>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="w-px h-8 bg-slate-600"></div>

                  {/* Capture */}
                  <button 
                    onClick={captureMap}
                    disabled={isCapturing}
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isCapturing 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg hover:shadow-yellow-500/25'
                    }`}
                  >
                    {isCapturing ? '📸 Capture en cours...' : '📸 Capturer la carte'}
                  </button>

                  {/* Séparateur */}
                  <div className="w-px h-8 bg-slate-600"></div>

                  {/* Plein écran */}
                  <button 
                    onClick={toggleFullscreen}
                    className="px-4 py-2 rounded-lg text-sm bg-purple-500 text-white hover:bg-purple-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                  >
                    📺 Plein écran
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Carte */}
          <div className="w-full h-[calc(100vh-80px)] relative">
            <div 
              ref={mapRef} 
              className="w-full h-full"
            />
            
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-400">Chargement de la carte...</p>
                </div>
              </div>
            )}

            {/* Notification de capture */}
            {isCapturing && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-lg z-[1001]">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Capture de la carte en cours...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}