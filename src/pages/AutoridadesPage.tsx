import { useState, useEffect } from 'react';
import { useCarreraData } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AutoridadesPage() {
  const { institucion, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Colores dinámicos del servicio
  const primary = institucion?.colorinstitucion?.[0]?.color_primario || '#349433';
  const secondary = institucion?.colorinstitucion?.[0]?.color_secundario || '#00B9D1';

  // Auto-avance del carrusel
  useEffect(() => {
    if (!contenido?.portada || contenido.portada.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev === (contenido.portada!.length - 1) ? 0 : prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [contenido?.portada]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #f3f4f6', borderTop: `4px solid ${primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#666', marginTop: 16 }}>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error</h2>
        <p style={{ color: '#555' }}>{error}</p>
        <button style={{ padding: '0.75rem 2rem', background: primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '1rem' }} onClick={() => (window.location.href = '/')}>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (max-width: 768px) { .auth-card { padding: 1.5rem !important; } }
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

  {/* 🖼️ PORTADAS - AQUÍ ESTÁN LAS IMÁGENES REALES */}
  {contenido?.portada && contenido.portada.length > 0 && contenido.portada.map((portada, index) => {
    const isActive = index === currentSlide;
    console.log('🔍 Portada', index, ':', portada.portada_imagen, 'Activa:', isActive);
    
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

        {/* ==================== 👥 AUTORIDADES - DISEÑO ACTUALIZADO ==================== */}
        <section id="autoridades-content" style={{
          padding: '6rem 0',
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          borderTop: `3px solid rgba(255,255,255,0.4)`,
          borderBottom: `3px solid rgba(255,255,255,0.4)`
        }}>
          {/* Elementos decorativos de fondo */}
          <div style={{ 
            position: 'absolute', top: '5%', right: '8%', 
            fontSize: '12rem', opacity: 0.06, color: '#fff', 
            pointerEvents: 'none', transform: 'rotate(10deg)' 
          }}>👔</div>
          <div style={{ 
            position: 'absolute', bottom: '10%', left: '5%', 
            fontSize: '10rem', opacity: 0.06, color: '#fff', 
            pointerEvents: 'none', transform: 'rotate(-10deg)' 
          }}>🎓</div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Header de sección */}
            <div style={{ textAlign: 'center', marginBottom: '4.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
              <span style={{ 
                display: 'inline-block', padding: '0.5rem 1.8rem', 
                background: 'rgba(255,255,255,0.2)', color: '#000', 
                borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, 
                marginBottom: '1rem', border: `1px solid rgba(255,255,255,0.4)`,
                backdropFilter: 'blur(8px)'
              }}>
                👥 NUESTRO EQUIPO
              </span>
              <h2 style={{ 
                fontSize: '2.8rem', color: '#000000', marginBottom: '1rem', 
                fontWeight: 800, letterSpacing: '-0.02em',
                textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
              }}>
                Nuestras <span style={{ color: primary }}>Autoridades</span>
              </h2>
              <div style={{ 
                width: '100px', height: '5px', 
                background: `linear-gradient(90deg, #000, ${primary}, ${secondary}, #000)`, 
                margin: '0 auto 1.5rem', borderRadius: '3px' 
              }}></div>
              <p style={{ 
                fontSize: '1.15rem', color: '#1a1a1a', maxWidth: '650px', 
                margin: '0 auto', fontWeight: 400, lineHeight: 1.7 
              }}>
                Conoce a las autoridades que lideran nuestra institución con compromiso y excelencia
              </p>
            </div>

            {/* Grid de Autoridades */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              maxWidth: '1100px',
              margin: '0 auto'
            }}>
              {contenido?.autoridad?.map((auth, idx) => {
                const accentColor = idx % 2 === 0 ? primary : secondary;
                
                return (
                  <div 
                    key={auth.id_autoridad} 
                    className="auth-card"
                    style={{ 
                      textAlign: 'center', 
                      padding: '2rem 1.5rem',
                      background: '#ffffff',
                      borderRadius: '24px',
                      border: `3px solid ${accentColor}`,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      animation: `fadeInUp 0.6s ease-out ${idx * 0.15}s both`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                      e.currentTarget.style.boxShadow = `0 30px 80px ${accentColor}40`;
                      e.currentTarget.style.borderColor = accentColor === primary ? secondary : primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
                      e.currentTarget.style.borderColor = accentColor;
                    }}
                  >
                    {/* Foto */}
                    <div style={{ 
                      width: '160px', 
                      height: '160px', 
                      margin: '0 auto 1.5rem', 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      border: `4px solid ${accentColor}`, 
                      boxShadow: `0 8px 25px ${accentColor}30`,
                      background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={getImageUrl(auth.foto_autoridad)} 
                        alt={auth.nombre_autoridad} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:4rem;opacity:0.3">👤</span>';
                        }}
                      />
                    </div>

                    {/* Nombre - LETRAS NEGRAS */}
                    <h3 style={{ 
                      color: '#000000', 
                      fontSize: '1.35rem', 
                      fontWeight: 800, 
                      margin: '0 0 0.5rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      lineHeight: 1.3
                    }}>
                      {auth.nombre_autoridad}
                    </h3>

                    {/* Cargo - CON BADGE DE COLOR */}
                    <p style={{ 
                      color: accentColor, 
                      fontSize: '0.95rem', 
                      fontWeight: 700, 
                      margin: '0 0 1.25rem', 
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      background: `${accentColor}15`,
                      padding: '0.4rem 1.2rem',
                      borderRadius: '50px',
                      display: 'inline-block'
                    }}>
                      {auth.cargo_autoridad}
                    </p>

                    {/* Línea Divisoria */}
                    <div style={{ 
                      width: '50px', 
                      height: '3px', 
                      background: `linear-gradient(90deg, ${primary}, ${secondary})`, 
                      margin: '0 auto 1.5rem', 
                      borderRadius: '2px'
                    }}></div>

                    {/* Contacto */}
                    <div style={{ 
                      color: '#334155', 
                      fontSize: '0.95rem', 
                      lineHeight: 1.8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      marginTop: 'auto'
                    }}>
                      {auth.celular_autoridad && auth.celular_autoridad !== '234' && auth.celular_autoridad !== 'qwe' && (
                        <a href={`tel:${auth.celular_autoridad}`} style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.5rem', 
                          color: '#000', textDecoration: 'none', fontWeight: 500,
                          transition: 'color 0.2s ease'
                        }} onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
                           onMouseLeave={(e) => e.currentTarget.style.color = '#000'}>
                          <span>📞</span>
                          <span>{auth.celular_autoridad}</span>
                        </a>
                      )}
                      {auth.facebook_autoridad && auth.facebook_autoridad !== 'qweqwe' && auth.facebook_autoridad !== 'qwe' && (
                        <a href={auth.facebook_autoridad.startsWith('http') ? auth.facebook_autoridad : `https://facebook.com/${auth.facebook_autoridad}`} target="_blank" rel="noopener noreferrer" style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.5rem', 
                          color: '#000', textDecoration: 'none', fontWeight: 500,
                          transition: 'color 0.2s ease'
                        }} onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
                           onMouseLeave={(e) => e.currentTarget.style.color = '#000'}>
                          <span>🌐</span>
                          <span>Facebook</span>
                        </a>
                      )}
                      {(!auth.celular_autoridad || auth.celular_autoridad === '234') && (!auth.facebook_autoridad || auth.facebook_autoridad === 'qweqwe') && (
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>Información de contacto no disponible</p>
                      )}
                    </div>

                    {/* Barra decorativa inferior */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                      borderRadius: '0 0 24px 24px'
                    }}></div>
                  </div>
                );
              })}
            </div>

            {/* Fallback si no hay autoridades */}
            {!contenido?.autoridad?.length && (
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem', 
                color: '#000',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '20px',
                border: `2px dashed ${primary}`,
                backdropFilter: 'blur(10px)',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>👥</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#000' }}>
                  Sin autoridades registradas
                </h3>
                <p style={{ color: '#333', fontSize: '1rem' }}>
                  Pronto agregaremos la información de nuestro equipo directivo.
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