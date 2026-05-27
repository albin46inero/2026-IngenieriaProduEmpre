import { useState, useEffect } from 'react';
import { useCarreraData } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GacetaPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // ✅ Colores dinámicos del servicio
  const primary = institucion?.colorinstitucion?.[0]?.color_primario || '#349433';
  const secondary = institucion?.colorinstitucion?.[0]?.color_secundario || '#00B9D1';

  // Auto-avance del carrusel Hero
  useEffect(() => {
    if (!contenido?.portada || contenido.portada.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev === (contenido.portada!.length - 1) ? 0 : prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [contenido?.portada]);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPdf(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #f3f4f6', borderTop: `4px solid ${primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#666', marginTop: 16 }}>Cargando gacetas...</p>
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

  // ✅ Helper para URLs
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  const getPdfUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas/${path}`;
  };

  // ✅ Filtrar y ordenar gacetas
  const gacetas = (recursos?.upea_gaceta_universitaria || [])
    .filter(gac => gac.gaceta_documento)
    .sort((a, b) => new Date(b.gaceta_fecha).getTime() - new Date(a.gaceta_fecha).getTime());

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rotateCard { 
          0% { transform: perspective(1000px) rotateY(0deg) scale(1); }
          50% { transform: perspective(1000px) rotateY(15deg) scale(1.05); }
          100% { transform: perspective(1000px) rotateY(0deg) scale(1); }
        }
        .pdf-publication {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        .pdf-publication-inner {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          animation: rotateCard 4s ease-in-out infinite;
          animation-delay: var(--delay);
        }
        .pdf-publication:hover .pdf-publication-inner {
          animation-play-state: paused;
          transform: perspective(1000px) rotateY(-25deg) scale(1.1) translateX(20px);
          box-shadow: -20px 20px 40px rgba(0,0,0,0.4);
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

        {/* ==================== PUBLICACIONES - EFECTO ROTACIÓN 3D ==================== */}
         <section id="gacetas-content" style={{
          padding: '6rem 0',
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,  // ← CAMBIO AQUÍ
          position: 'relative',
          overflow: 'hidden',
          borderTop: `3px solid rgba(255,255,255,0.4)`,   // ← NUEVO
          borderBottom: `3px solid rgba(255,255,255,0.4)`  // ← NUEVO
        }}>
        
         <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: `radial-gradient(ellipse at 20% 30%, ${primary}90 0%, transparent 70%), radial-gradient(ellipse at 80% 70%, ${secondary}90 0%, transparent 70%)`, pointerEvents: 'none' }}></div>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'fadeInUp 0.6s ease-out' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#e0e0e6', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                Nuestras Gacetas
              </h2>
              <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${primary}, ${secondary})`, margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                {gacetas.length} {gacetas.length === 1 ? 'documento' : 'documentos'} disponibles
              </p>
            </div>

            {gacetas.length > 0 ? (
              <>
                {/* Grid de Publicaciones con Rotación 3D Individual */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '4rem',
                  marginBottom: '4rem'
                }}>
                  {gacetas.map((gaceta, idx) => (
                    <div 
                      key={gaceta.gaceta_id}
                      className="pdf-publication"
                      style={{
                        '--delay': `${idx * 0.3}s`
                      } as React.CSSProperties}
                    >
                      <div 
                        className="pdf-publication-inner"
                        onClick={() => setSelectedPdf(getPdfUrl(gaceta.gaceta_documento))}
                        style={{
                          width: '220px',
                          height: '320px',
                          position: 'relative',
                          cursor: 'pointer',
                          transformStyle: 'preserve-3d',
                          background: `linear-gradient(135deg, ${primary}dd, ${primary}99)`,
                          borderRadius: '8px',
                          boxShadow: '8px 8px 20px rgba(0,0,0,0.3)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '2rem 1.5rem',
                          border: `3px solid ${secondary}`,
                          overflow: 'hidden'
                        }}
                      >
                        {/* Decoración de fondo */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: `
                            radial-gradient(circle at 20% 20%, ${secondary}30 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
                          `,
                          pointerEvents: 'none'
                        }}></div>

                        {/* Logo/Header de la publicación */}
                        <div style={{
                          textAlign: 'center',
                          position: 'relative',
                          zIndex: 1,
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            width: '60px',
                            height: '60px',
                            margin: '0 auto 0.75rem',
                            background: '#fff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}>
                            {institucion?.institucion_logo ? (
                              <img 
                                src={getImageUrl(institucion.institucion_logo)} 
                                alt="Logo" 
                                style={{ width: '80%', height: '80%', objectFit: 'contain' }} 
                              />
                            ) : (
                              <span style={{ fontSize: '2rem' }}>📚</span>
                            )}
                          </div>
                          <p style={{
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            margin: 0,
                            lineHeight: 1.3
                          }}>
                            {institucion?.institucion_nombre || 'UPEA'}
                          </p>
                          <p style={{
                            color: secondary,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            margin: '0.25rem 0 0',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {gaceta.gaceta_tipo}
                          </p>
                        </div>

                        {/* Título centrado */}
                        <div style={{
                          textAlign: 'center',
                          position: 'relative',
                          zIndex: 1,
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <h3 style={{
                            color: '#fff',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            margin: 0,
                            lineHeight: 1.4,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}>
                            {gaceta.gaceta_titulo}
                          </h3>
                        </div>

                        {/* Footer de la tarjeta */}
                        <div style={{
                          textAlign: 'center',
                          position: 'relative',
                          zIndex: 1,
                          marginTop: '1rem'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '3px',
                            background: secondary,
                            margin: '0 auto 0.75rem',
                            borderRadius: '2px'
                          }}></div>
                          <p style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            margin: 0
                          }}>
                            {formatearFecha(gaceta.gaceta_fecha)}
                          </p>
                          <div style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1.25rem',
                            background: secondary,
                            color: '#fff',
                            borderRadius: '50px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}>
                            Ver PDF
                          </div>
                        </div>

                        {/* Efecto de borde/lomo del libro */}
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '8px',
                          background: `linear-gradient(180deg, ${secondary}, ${primary})`,
                          borderRadius: '8px 0 0 8px'
                        }}></div>
                      </div>

                      {/* Año debajo de la publicación */}
                      <p style={{
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginTop: '1.5rem'
                      }}>
                        {new Date(gaceta.gaceta_fecha).getFullYear()}
                      </p>
                    </div>
                  ))}
                </div>

               
               
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem', opacity: 0.3 }}>📚</div>
                <h3 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.75rem' }}>
                  No hay publicaciones disponibles
                </h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                  Pronto publicaremos nueva documentación oficial.
                </p>
              </div>
            )}
          </div>
{/* ==================== MODAL PDF - SOLUCIÓN SIMPLE ==================== */}
{selectedPdf && (
  <div 
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.9)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeInUp 0.3s ease',
      padding: '2rem'
    }}
    onClick={() => setSelectedPdf(null)}
  >
    <div 
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'zoomIn 0.3s ease'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icono */}
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 1.5rem',
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        color: '#fff'
      }}>
        📄
      </div>

      {/* Título */}
      <h3 style={{
        fontSize: '1.5rem',
        color: '#1e293b',
        marginBottom: '1rem',
        fontWeight: 700
      }}>
        Abrir Documento
      </h3>

      {/* Mensaje */}
      <p style={{
        color: '#64748b',
        fontSize: '1rem',
        marginBottom: '2rem',
        lineHeight: 1.6
      }}>
        El documento se abrirá en una nueva pestaña de tu navegador.
      </p>

      {/* Botón principal */}
      <a 
        href={selectedPdf}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          // ✅ Forzar apertura en nueva pestaña
          window.open(selectedPdf, '_blank', 'noopener,noreferrer');
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem 2.5rem',
          background: `linear-gradient(135deg, ${primary}, ${primary}cc)`,
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: `0 4px 15px ${primary}40`,
          transition: 'all 0.3s ease',
          marginBottom: '1rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = `0 6px 20px ${primary}60`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 15px ${primary}40`;
        }}
      >
        🔗 Abrir PDF ahora
      </a>

      {/* Botón secundario: Descargar */}
      <br />
      <a 
        href={selectedPdf}
        download
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 2rem',
          background: 'transparent',
          color: primary,
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: 600,
          fontSize: '0.95rem',
          border: `2px solid ${primary}`,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${primary}10`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        ⬇️ Descargar PDF
      </a>

      {/* Botón cerrar */}
      <button 
        onClick={() => setSelectedPdf(null)}
        style={{
          display: 'block',
          margin: '2rem auto 0',
          padding: '0.5rem 1.5rem',
          background: 'transparent',
          color: '#64748b',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
      >
        ✕ Cerrar
      </button>
    </div>
  </div>
)}
        </section>
      </main>

      <Footer data={institucion} />
    </div>
  );
}