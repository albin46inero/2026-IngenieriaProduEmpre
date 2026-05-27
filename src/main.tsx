import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import HistoriaPage from './pages/HistoriaPage';
import MisionVisionPage from './pages/MisionPage';
import PerfilProfesionalPage from './pages/PerfilProfesionalPage';
import AutoridadesPage from './pages/AutoridadesPage';
import AvisosPage from './pages/AvisosPage';
import ComunicadosPage from './pages/ComunicadosPage';
import GacetaPage from './pages/GacetaPage';
import SeminariosPage from './pages/SeminariosPage';
import CursosPage from './pages/CursosPage';
import ServiciosPage from './pages/ServiciosPage';
import OfertasAcademicasPage from './pages/OfertasAcademicasPage';
import PublicacionesPage from './pages/PublicacionesPage';
import EventosPage from './pages/EventosPage';
import VideosPage from './pages/VideosPage';  

import './index.css';
import MisionPage from './pages/MisionPage';

function Router() {
  // ✅ Obtener hash SIN el símbolo #
  const [route, setRoute] = React.useState(() => 
    window.location.hash.replace('#', '') || 'home'
  );

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      console.log('🔄 Ruta cambiada a:', hash); // Debug
      setRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Ejecutar al cargar por si ya hay hash
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  console.log('📍 Ruta actual:', route); // Debug

  // ✅ Routing con switch (más limpio)
  switch (route) {
    case 'historia':
      return <HistoriaPage />;
    case 'mision-vision':  // ✅ Este es el hash que debe coincidir
      return <MisionPage />;
    case 'perfil':
      return <PerfilProfesionalPage />;
    case 'autoridades':
      return <AutoridadesPage />;
    case 'avisos':
      return <AvisosPage />;
      case 'comunicados':
      return <ComunicadosPage />;
      case 'gaceta':
      return <GacetaPage />;
      case 'seminarios':
      return <SeminariosPage />;
      case 'cursos':
      return <CursosPage />;
      case 'servicios':
      return <ServiciosPage />;
      case 'ofertas-academicas':
      return <OfertasAcademicasPage/>;
      case 'publicaciones':
      return <PublicacionesPage/>;
      case 'eventos':
      return <EventosPage/>;
      case 'videos':
      return <VideosPage/>; 
  
    default:
      return <App />;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);