import { useState, useEffect } from 'react';
import { useCarreraData } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PerfilProfesionalPage() {
  const { institucion, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Colores dinámicos del servicio
  const primary = institucion?.colorinstitucion?.[0]?.color_primario || '#349433';
  const secondary = institucion?.colorinstitucion?.[0]?.color_secundario || '#00B9D1';
  // Estado y datos del carrusel
const [carouselIndex, setCarouselIndex] = useState(0);


  // Auto-avance del carrusel de portadas
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

  // ✅ Helper para URLs de imágenes
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
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
          .perfil-text { font-size: 1rem !important; line-height: 1.8 !important; }
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
        {/* ==================== PERFIL PROFESIONAL (DISEÑO MODERNO) ==================== */}
      <section id="perfil-content" style={{
  padding: '6rem 0',
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,  // ← CAMBIO AQUÍ
  position: 'relative',
  overflow: 'hidden',
  borderTop: `3px solid rgba(255,255,255,0.4)`,   // ← NUEVO
  borderBottom: `3px solid rgba(255,255,255,0.4)`  // ← NUEVO
}}>
          {/* Gradientes de fondo */}
          

          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Header de la sección */}
            <div style={{
              textAlign: 'center',
              padding: '6rem 0 4rem',
              animation: 'fadeInUp 0.6s ease-out'
            }}>
              <h2 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                color: '#030303',
                marginBottom: '1rem',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                Perfil Profesional
              </h2>
              <div style={{
                width: '100px',
                height: '4px',
                background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                margin: '0 auto 1.5rem',
                borderRadius: '2px'
              }}></div>
              <p style={{
                fontSize: '1.2rem',
                color: '#080808',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                Conoce el perfil de nuestros profesionales y sus oportunidades laborales
              </p>
            </div>

            {/* PERFIL PROFESIONAL - Consumo de institucion_sobre_ins */}
            {institucion?.institucion_sobre_ins && (
              <div style={{
                padding: '4rem 0',
                animation: 'fadeInUp 0.6s ease-out 0.1s both'
              }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                  {/* Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1.75rem',
                    background: `linear-gradient(135deg, ${primary}, ${primary}cc)`,
                    color: '#060606',
                    borderRadius: '50px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    marginBottom: '2.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    border: `2px solid ${primary}80`,
                    boxShadow: `0 4px 20px ${primary}60, 0 0 40px ${primary}30`
                  }}>
                     Perfil del Profesional
                  </div>
                  
                  {/* Texto de Perfil Profesional - Consumo directo del servicio */}
                  <div 
                    className="perfil-text"
                    style={{
                      color: '#0b0b0b',
                      lineHeight: '2',
                      fontSize: 'clamp(1.05rem, 2vw, 1.15rem)',
                      textAlign: 'justify'
                    }}
                    dangerouslySetInnerHTML={{ __html: institucion.institucion_sobre_ins }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* Animaciones y responsive */}
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 768px) {
              #perfil-content { padding: 0 !important; }
              .perfil-text { font-size: 1rem !important; line-height: 1.8 !important; }
            }
          `}</style>
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