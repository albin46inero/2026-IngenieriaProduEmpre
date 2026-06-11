import { useState, useEffect } from 'react';
import { useCarreraData } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HistoriaPage() {
  const { institucion, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Colores dinámicos del servicio - Consumo correcto
  const primary = institucion?.colorinstitucion?.[0]?.color_primario || '#349433';
  const secondary = institucion?.colorinstitucion?.[0]?.color_secundario || '#00B9D1';

  // Auto-avance del carrusel
  useEffect(() => {
    if (!contenido?.portada || contenido.portada.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === (contenido.portada!.length - 1) ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [contenido?.portada]);

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#666', marginTop: 16 }}>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingBox}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error</h2>
        <p style={{ color: '#555' }}>{error}</p>
        <button style={styles.btn} onClick={() => (window.location.href = '/')}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  // ✅ Helper para URLs de imágenes - Maneja URLs completas y relativas
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    // Si ya es URL completa, retornarla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Si es ruta relativa, construir URL completa
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .historia-content { padding: 1.5rem !important; }
          .historia-title { font-size: 1.8rem !important; }
          .historia-text { font-size: 1rem !important; }
        }
      `}</style>

      <Header data={institucion} />

      <main>
             {/* ==================== 🎯 HERO SECTION ==================== */}
<section id="hero" style={{
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '80px',
  overflow: 'hidden'
}}>
  <style>{`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes rotate3D { 
      0% { transform: perspective(1000px) rotateY(0deg); } 
      100% { transform: perspective(1000px) rotateY(360deg); } 
    }
    @keyframes letterBlink {
      0%, 45% { opacity: 1; transform: scale(1); }
      50%, 100% { opacity: 0; transform: scale(0.92); }
    }
    .square-font {
      font-family: 'Courier New', monospace, 'Segoe UI', sans-serif;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .letter-animate {
      display: inline-block;
      animation: letterBlink 2.8s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.06s);
    }
  `}</style>


  {contenido?.portada && contenido.portada.length > 0 && contenido.portada.map((portada, index) => {
    const isActive = index === currentSlide;
   
    return (
      <div 
        key={portada.portada_id || index}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: isActive ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
          zIndex: isActive ? 1 : 0,
          pointerEvents: 'none'
        }}
      >
        {/* IMAGEN DE FONDO COMPLETA */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${portada.portada_imagen})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          {/* Overlay oscuro PARA QUE SE VEA EL TEXTO */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.35)'
          }}></div>
        </div>
      </div>
    );
  })}

  {/* CONTENIDO ENCIMA DE LAS PORTADAS */}
  <div style={{ 
    position: 'relative',
    zIndex: 10,
    textAlign: 'center', 
    color: '#fff', 
    padding: '2rem', 
    maxWidth: '1200px', 
    margin: '0 auto', 
    animation: 'fadeInUp 1s ease-out'
  }}>
    
    {/* LOGO */}
    <div style={{
      width: '280px', height: '280px', margin: '0 auto 2.5rem', 
      background: '#fff', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      border: '6px solid #fff', animation: 'rotate3D 12s ease-in-out infinite', 
      overflow: 'hidden'
    }}>
      {institucion?.institucion_logo && (
        <img 
          src={institucion.institucion_logo}
          alt="Logo" 
          style={{ width: '90%', height: '90%', objectFit: 'contain' }}
        />
      )}
    </div>

    {/* TÍTULO */}
    <h1 style={{ 
      fontSize: '3.5rem', fontWeight: 900, margin: '0 0 1.5rem', 
      letterSpacing: '2px', textShadow: '3px 3px 8px rgba(0,0,0,0.8)',
      color: '#FFD700'
    }}>
      {(institucion?.institucion_nombre || 'PRODUCCIÓN EMPRESARIAL').split('').map((char, index) => (
        <span 
          key={index}
          className="letter-animate square-font"
          style={{ 
            ['--i' as string]: index,
            color: index % 3 === 0 ? '#FFD700' : index % 3 === 1 ? '#fff' : secondary,
            display: 'inline-block'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>


  </div>

  {/* REDES SOCIALES */}
  <div style={{ 
    position: 'fixed', bottom: '2rem', right: '2rem', 
    display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 100 
  }}>
  
  </div>
</section>
              {/* ==================== SECCIÓN DE HISTORIA ==================== */}
         <section id="historia-content" style={{
  padding: '6rem 0',
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,  // ← CAMBIO AQUÍ
  position: 'relative',
  overflow: 'hidden',
  borderTop: `3px solid rgba(255,255,255,0.4)`,   // ← NUEVO
  borderBottom: `3px solid rgba(255,255,255,0.4)`  // ← NUEVO
}}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            {/* Header de la sección */}
            <div style={{
              textAlign: 'center',
              marginBottom: '4rem',
              animation: 'fadeInUp 0.6s ease-out'
            }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                color: '#1e293b',
                marginBottom: '1rem',
                fontWeight: 800
              }}>
                Historia de la Carrera
              </h2>
              <div style={{
                width: '80px',
                height: '4px',
                background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                margin: '0 auto 1.5rem',
                borderRadius: '2px'
              }}></div>
              <p style={{
                fontSize: '1.15rem',
                color: '#64748b',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                Conoce nuestra trayectoria, logros y compromiso con la excelencia académica
              </p>
            </div>

            {/* ✅ Contenido de Historia - SOLO consume institucion_historia del servicio */}
            {institucion?.institucion_historia ? (
              <div className="historia-content" style={{
                background: `linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)`,
                borderRadius: '20px',
                padding: '4rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                border: `2px solid ${primary}20`,
                animation: 'fadeInUp 0.6s ease-out 0.2s both',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Elemento decorativo */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${primary}10 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }}></div>

                {/* Icono/Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  background: `${primary}15`,
                  color: primary,
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: '2rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <span style={{ fontSize: '1.5rem' }}>📚</span>
                  <span>Nuestra Historia</span>
                </div>

                {/* ✅ Texto de Historia - Consumo directo del servicio */}
                <div 
                  className="historia-text"
                  style={{
                    color: '#334155',
                    lineHeight: '2',
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    textAlign: 'justify',
                    position: 'relative',
                    zIndex: 1
                  }}
                  dangerouslySetInnerHTML={{ __html: institucion.institucion_historia }}
                />

                {/* Línea decorativa inferior */}
                <div style={{
                  width: '100px',
                  height: '4px',
                  background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                  margin: '3rem auto 0',
                  borderRadius: '2px'
                }}></div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: '#f8fafc',
                borderRadius: '20px',
                border: `2px dashed ${primary}30`
              }}>
                <span style={{ fontSize: '5rem', opacity: 0.3, display: 'block', marginBottom: '1rem' }}>📚</span>
                <h3 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.75rem' }}>
                  No hay información de historia disponible
                </h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                  Pronto publicaremos la historia de nuestra institución.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer data={institucion} />
    </div>
  );
}

// ESTILOS
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  loadingBox: { 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: '#f8f9fa' 
  },
  spinner: { 
    width: '50px', 
    height: '50px', 
    border: '4px solid #f3f4f6', 
    borderTop: '4px solid #349433', 
    borderRadius: '50%', 
    animation: 'spin 1s linear infinite' 
  },
  btn: { 
    padding: '0.75rem 2rem', 
    background: '#349433', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: '600', 
    marginTop: '1rem',
    fontSize: '1rem' 
  }
};