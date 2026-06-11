import { useState, useEffect } from 'react';
import { useCarreraData } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AvisosPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [imagenModal, setImagenModal] = useState<string | null>(null);

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

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImagenModal(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

  // ✅ Filtrar avisos y comunicados
  const todosLosAvisos = recursos?.upea_publicaciones
    ?.filter(pub => {
      const titulo = pub.publicaciones_titulo?.toUpperCase() || '';
      const tipo = pub.publicaciones_tipo?.toUpperCase() || '';
      
      return titulo.includes('AVISO') || 
             titulo.includes('COMUNICADO') || 
             tipo.includes('AVISO') || 
             tipo.includes('COMUNICADO') ||
             tipo.includes('GACETA') ||
             titulo.includes('GACETA');
    })
    .map(pub => ({
      id: pub.publicaciones_id,
      titulo: pub.publicaciones_titulo,
      descripcion: pub.publicaciones_descripcion,
      fecha: pub.publicaciones_fecha,
      imagen: pub.publicaciones_imagen,
      tipo: pub.publicaciones_tipo || 'AVISO',
      autor: pub.publicaciones_autor,
      enlace: pub.publicaciones_documento || '#',
      estado: 1
    }))
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) || [];

  const avisosFiltrados = filtroActivo === 'TODOS' 
    ? todosLosAvisos 
    : todosLosAvisos.filter(a => {
        const catUpper = filtroActivo.toUpperCase();
        const tipoUpper = a.tipo?.toUpperCase() || '';
        const tituloUpper = a.titulo?.toUpperCase() || '';
        return tipoUpper === catUpper || tituloUpper.includes(catUpper);
      });

  const categorias = ['TODOS', ...Array.from(new Set(todosLosAvisos.map(a => a.tipo || 'AVISO')))];

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
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (max-width: 768px) { .aviso-card { padding: 1.5rem !important; } }
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
        {/* ==================== 📰 AVISOS Y COMUNICADOS - DISEÑO ACTUALIZADO ==================== */}
        <section id="avisos-content" style={{
          padding: '6rem 0',
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          borderTop: `3px solid rgba(255,255,255,0.4)`,
          borderBottom: `3px solid rgba(255,255,255,0.4)`
        }}>
          {/* Elementos decorativos de fondo */}
          <div style={{ 
            position: 'absolute', top: '8%', right: '10%', 
            fontSize: '12rem', opacity: 0.06, color: '#fff', 
            pointerEvents: 'none', transform: 'rotate(10deg)' 
          }}>📰</div>
          <div style={{ 
            position: 'absolute', bottom: '12%', left: '6%', 
            fontSize: '10rem', opacity: 0.06, color: '#fff', 
            pointerEvents: 'none', transform: 'rotate(-10deg)' 
          }}>📢</div>

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
                📢 ACTUALIDAD
              </span>
              <h2 style={{ 
                fontSize: '2.8rem', color: '#000000', marginBottom: '1rem', 
                fontWeight: 800, letterSpacing: '-0.02em',
                textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
              }}>
                Avisos y <span style={{ color: primary }}>Comunicados</span>
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
                Mantente informado sobre las últimas novedades, convocatorias y eventos de nuestra institución
              </p>
            </div>

            {/* Filtros de categorías */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              marginBottom: '3.5rem',
              animation: 'fadeInUp 0.6s ease-out 0.1s both'
            }}>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltroActivo(cat)}
                  style={{
                    padding: '0.75rem 2rem',
                    background: filtroActivo === cat 
                      ? `linear-gradient(135deg, ${primary}, ${primary}dd)` 
                      : '#ffffff',
                    color: filtroActivo === cat ? '#000' : '#000',
                    border: `3px solid ${filtroActivo === cat ? primary : '#e2e8f0'}`,
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: filtroActivo === cat ? `0 5px 20px ${primary}40` : '0 3px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (filtroActivo !== cat) {
                      e.currentTarget.style.borderColor = primary;
                      e.currentTarget.style.boxShadow = `0 5px 20px ${primary}30`;
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filtroActivo !== cat) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Contador de resultados */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2.5rem',
              color: '#334155',
              fontSize: '1rem',
              fontWeight: 500
            }}>
              {avisosFiltrados.length} {avisosFiltrados.length === 1 ? 'publicación encontrada' : 'publicaciones encontradas'}
            </div>

            {/* Grid de Avisos */}
            {avisosFiltrados.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '2.5rem'
              }}>
                {avisosFiltrados.map((aviso, idx) => {
                  const accentColor = idx % 2 === 0 ? primary : secondary;
                  
                  return (
                    <div 
                      key={`${aviso.id}-${idx}`}
                      className="aviso-card"
                      style={{
                        background: '#ffffff',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                        border: `3px solid ${accentColor}`,
                        display: 'flex',
                        flexDirection: 'column'
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
                      {/* Imagen con badge de tipo */}
                      <div style={{
                        position: 'relative',
                        height: '200px',
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                        cursor: aviso.imagen ? 'pointer' : 'default'
                      }}
                      onClick={() => aviso.imagen && setImagenModal(getImageUrl(aviso.imagen))}
                      >
                        {aviso.imagen ? (
                          <>
                            <img 
                              src={getImageUrl(aviso.imagen)} 
                              alt={aviso.titulo}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {/* Overlay con botón Abrir */}
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(0,0,0,0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            >
                              <button style={{
                                padding: '0.8rem 2rem',
                                background: '#FFD700',
                                color: '#000',
                                border: 'none',
                                borderRadius: '50px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                transform: 'scale(0.9)',
                                transition: 'transform 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                              >
                                🔍 Ver
                              </button>
                            </div>
                          </>
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            color: accentColor,
                            background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`
                          }}>
                            📄
                          </div>
                        )}
                        
                        {/* Badge de tipo flotante */}
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          padding: '0.4rem 1rem',
                          background: '#fff',
                          color: accentColor,
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                          border: `2px solid ${accentColor}`
                        }}>
                          {aviso.tipo}
                        </div>
                      </div>

                      {/* Contenido - LETRAS NEGRAS */}
                      <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        {/* Fecha */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.8rem',
                          fontSize: '0.85rem',
                          color: '#64748b',
                          fontWeight: 500
                        }}>
                          <span>📅</span>
                          <span>{formatearFecha(aviso.fecha)}</span>
                        </div>

                        {/* Título - NEGRO */}
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#000000',
                          marginBottom: '1rem',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '3.2rem'
                        }}>
                          {aviso.titulo}
                        </h3>

                        {/* Descripción - NEGRO */}
                        <div 
                          style={{
                            color: '#334155',
                            fontSize: '0.95rem',
                            lineHeight: 1.7,
                            marginBottom: '1.5rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            flexGrow: 1
                          }}
                          dangerouslySetInnerHTML={{ __html: aviso.descripcion }}
                        />

                        {/* Autor */}
                        {aviso.autor && (
                          <div style={{
                            marginBottom: '1.5rem',
                            fontSize: '0.85rem',
                            color: '#64748b',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: `${accentColor}10`,
                            borderRadius: '8px',
                            width: 'fit-content'
                          }}>
                            <span>✍️</span>
                            <span>{aviso.autor}</span>
                          </div>
                        )}

                        {/* Botón Descargar */}
                        {aviso.enlace && aviso.enlace !== '#' && (
                          <a 
                            href={aviso.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.8rem 1.5rem',
                              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                              color: '#000',
                              textDecoration: 'none',
                              borderRadius: '12px',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              marginTop: 'auto',
                              border: `2px solid ${accentColor}`,
                              transition: 'all 0.3s ease',
                              alignSelf: 'flex-start'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-3px)';
                              e.currentTarget.style.boxShadow = `0 8px 20px ${accentColor}40`;
                              e.currentTarget.style.background = accentColor === primary ? secondary : primary;
                              e.currentTarget.style.borderColor = accentColor === primary ? secondary : primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`;
                              e.currentTarget.style.borderColor = accentColor;
                            }}
                          >
                            ⬇️ Descargar
                          </a>
                        )}
                      </div>

                      {/* Barra decorativa inferior */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${primary}, ${secondary})`
                      }}></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Estado vacío */
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '24px',
                border: `2px dashed ${primary}`,
                backdropFilter: 'blur(10px)',
                maxWidth: '500px',
                margin: '0 auto',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '1.5rem' }}>📭</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>
                  No hay {filtroActivo.toLowerCase()} disponibles
                </h3>
                <p style={{ color: '#334155', fontSize: '1rem' }}>
                  Pronto publicaremos nueva información. ¡Mantente atento!
                </p>
              </div>
            )}
          </div>

          {/* ==================== MODAL DE IMAGEN ==================== */}
          {imagenModal && (
            <div 
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeInUp 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => setImagenModal(null)}
            >
              {/* Botón Cerrar */}
              <button 
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  zIndex: 10000
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                ×
              </button>

              {/* Imagen ampliada */}
              <div 
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  animation: 'zoomIn 0.3s ease'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={imagenModal} 
                  alt="Vista ampliada"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                  }}
                />
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer data={institucion} />
    </div>
  );
}