import { useState, useEffect } from 'react';
import { useCarreraData } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GacetaPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPdf, setSelectedPdf] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<number | 'TODOS'>('TODOS');

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

  // ✅ Helper para URLs - CORREGIDO para evitar Mixed Content
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://')) return path.replace('http://', 'https://');
    if (path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  const getPdfUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://')) return path.replace('http://', 'https://');
    if (path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas/${path}`;
  };

  // ✅ Filtrar y ordenar gacetas
  const gacetas = (recursos?.upea_gaceta_universitaria || [])
    .filter(gac => gac.gaceta_documento)
    .sort((a, b) => new Date(b.gaceta_fecha).getTime() - new Date(a.gaceta_fecha).getTime());

  // Obtener años únicos
  const añosDisponibles = Array.from(new Set(
    gacetas.map(g => new Date(g.gaceta_fecha).getFullYear())
  )).sort((a, b) => b - a);

  // Filtrar por búsqueda y año
  const gacetasFiltradas = gacetas.filter(gac => {
    const coincideBusqueda = 
      gac.gaceta_titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gac.gaceta_tipo?.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideAño = yearFilter === 'TODOS' || new Date(gac.gaceta_fecha).getFullYear() === yearFilter;
    return coincideBusqueda && coincideAño;
  });

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getYearFromDate = (fecha: string) => new Date(fecha).getFullYear();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .doc-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .doc-card:hover {
          transform: translateY(-12px) scale(1.02);
        }
        .doc-card:hover .doc-cover {
          transform: rotateY(-15deg) scale(1.05);
        }
        .doc-cover {
          transition: transform 0.5s ease;
          transform-style: preserve-3d;
        }
        .year-pill {
          transition: all 0.3s ease;
        }
        .year-pill:hover {
          transform: translateY(-2px);
        }
        @media (max-width: 768px) { 
          .gaceta-grid { grid-template-columns: 1fr !important; }
          .gaceta-search { width: 100% !important; }
          .years-container { justify-content: flex-start !important; }
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
        </section>

        {/* ==================== 📚 BIBLIOTECA DE GACETAS ==================== */}
        <section id="gacetas-content" style={{
          padding: '6rem 0',
          background: `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decoración de fondo */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            fontSize: '20rem',
            opacity: 0.03,
            color: primary,
            pointerEvents: 'none'
          }}>📚</div>
          <div style={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            fontSize: '15rem',
            opacity: 0.03,
            color: secondary,
            pointerEvents: 'none'
          }}>📄</div>

          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeInUp 0.6s ease-out' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1.5rem',
                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                color: '#fff',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                boxShadow: `0 4px 15px ${primary}40`
              }}>
                📚 Archivo Institucional
              </span>
              <h2 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                color: '#1e293b', 
                fontWeight: 900, 
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
                lineHeight: 1.2
              }}>
                Gacetas <span style={{ 
                  background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Universitarias</span>
              </h2>
              <div style={{ 
                width: '100px', 
                height: '4px', 
                background: `linear-gradient(90deg, ${primary}, ${secondary})`, 
                margin: '0 auto 1.5rem', 
                borderRadius: '2px' 
              }}></div>
              <p style={{ color: '#64748b', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
                Consulta el archivo oficial de publicaciones institucionales
              </p>
            </div>

            {/* Panel de filtros */}
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '3rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              {/* Barra de búsqueda */}
              <div style={{ 
                maxWidth: '700px', 
                margin: '0 auto 1.5rem',
                position: 'relative'
              }}>
                <input
                  type="text"
                  placeholder="Buscar por título o tipo de gaceta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="gaceta-search"
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem 1rem 3.5rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '50px',
                    background: '#f8fafc',
                    color: '#1e293b',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primary;
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${primary}15`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  opacity: 0.5
                }}>🔍</span>
              </div>

              {/* Filtros por año */}
              {añosDisponibles.length > 0 && (
                <div className="years-container" style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: '#64748b', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    marginRight: '0.5rem'
                  }}>
                    📅 Filtrar por año:
                  </span>
                  <button
                    onClick={() => setYearFilter('TODOS')}
                    className="year-pill"
                    style={{
                      padding: '0.5rem 1.25rem',
                      background: yearFilter === 'TODOS' 
                        ? `linear-gradient(135deg, ${primary}, ${secondary})`
                        : '#f1f5f9',
                      color: yearFilter === 'TODOS' ? '#fff' : '#475569',
                      border: 'none',
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: yearFilter === 'TODOS' ? `0 4px 12px ${primary}40` : 'none'
                    }}
                  >
                    Todos
                  </button>
                  {añosDisponibles.map(year => (
                    <button
                      key={year}
                      onClick={() => setYearFilter(year)}
                      className="year-pill"
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: yearFilter === year 
                          ? `linear-gradient(135deg, ${primary}, ${secondary})`
                          : '#f1f5f9',
                        color: yearFilter === year ? '#fff' : '#475569',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: yearFilter === year ? `0 4px 12px ${primary}40` : 'none'
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: primary, lineHeight: 1 }}>
                  {gacetas.length}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  Total de Gacetas
                </div>
              </div>
              <div style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: secondary, lineHeight: 1 }}>
                  {añosDisponibles.length}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  Años con Registros
                </div>
              </div>
              <div style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFD700', lineHeight: 1 }}>
                  {gacetasFiltradas.length}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  Resultados Actuales
                </div>
              </div>
            </div>

            {gacetasFiltradas.length > 0 ? (
              <>
                {/* Grid de Gacetas tipo Documentos */}
                <div className="gaceta-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '2rem'
                }}>
                  {gacetasFiltradas.map((gaceta, idx) => (
                    <div 
                      key={gaceta.gaceta_id}
                      className="doc-card"
                      style={{
                        background: '#fff',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        animation: `slideUp 0.5s ease-out ${idx * 0.05}s both`,
                        border: '1px solid rgba(0,0,0,0.05)',
                        perspective: '1000px'
                      }}
                      onClick={() => setSelectedPdf(gaceta)}
                    >
                      {/* Portada del documento */}
                      <div 
                        className="doc-cover"
                        style={{
                          height: '200px',
                          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1.5rem',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Decoración de fondo */}
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '150px',
                          height: '150px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '50%'
                        }}></div>
                        <div style={{
                          position: 'absolute',
                          bottom: '-30px',
                          left: '-30px',
                          width: '120px',
                          height: '120px',
                          background: 'rgba(255,255,255,0.08)',
                          borderRadius: '50%'
                        }}></div>

                        {/* Logo */}
                        {institucion?.institucion_logo && (
                          <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#fff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.75rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            position: 'relative',
                            zIndex: 1
                          }}>
                            <img 
                              src={getImageUrl(institucion.institucion_logo)}
                              alt="Logo"
                              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                            />
                          </div>
                        )}

                        {/* Tipo de documento */}
                        <div style={{
                          background: 'rgba(255,255,255,0.25)',
                          backdropFilter: 'blur(10px)',
                          padding: '0.35rem 1rem',
                          borderRadius: '50px',
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          position: 'relative',
                          zIndex: 1,
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                          {gaceta.gaceta_tipo || 'GACETA'}
                        </div>

                        {/* Icono PDF grande */}
                        <div style={{
                          position: 'absolute',
                          bottom: '1rem',
                          right: '1rem',
                          fontSize: '3rem',
                          opacity: 0.3,
                          color: '#fff'
                        }}>
                          📄
                        </div>

                        {/* Año destacado */}
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          background: 'rgba(0,0,0,0.3)',
                          backdropFilter: 'blur(10px)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '50px',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          {getYearFromDate(gaceta.gaceta_fecha)}
                        </div>
                      </div>

                      {/* Contenido */}
                      <div style={{ padding: '1.5rem' }}>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#1e293b',
                          marginBottom: '0.75rem',
                          lineHeight: 1.4,
                          minHeight: '56px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {gaceta.gaceta_titulo}
                        </h3>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#64748b',
                          fontSize: '0.85rem',
                          marginBottom: '1.25rem',
                          paddingBottom: '1.25rem',
                          borderBottom: '1px solid #e2e8f0'
                        }}>
                          <span>📅</span>
                          <span style={{ fontWeight: 500 }}>
                            {formatearFecha(gaceta.gaceta_fecha)}
                          </span>
                        </div>

                        {/* Botones de acción */}
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem'
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPdf(gaceta);
                            }}
                            style={{
                              flex: 1,
                              padding: '0.65rem',
                              background: `linear-gradient(135deg, ${primary}, ${primary}dd)`,
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              boxShadow: `0 2px 8px ${primary}30`
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = `0 4px 12px ${primary}50`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = `0 2px 8px ${primary}30`;
                            }}
                          >
                            👁️ Ver
                          </button>
                          <a
                            href={getPdfUrl(gaceta.gaceta_documento)}
                            download
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              flex: 1,
                              padding: '0.65rem',
                              background: 'transparent',
                              color: primary,
                              border: `2px solid ${primary}`,
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `${primary}10`;
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            ⬇️ Bajar
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  fontSize: '5rem', 
                  marginBottom: '1.5rem', 
                  opacity: 0.3,
                  animation: 'float 3s ease-in-out infinite'
                }}>📭</div>
                <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.75rem', fontWeight: 700 }}>
                  {searchTerm || yearFilter !== 'TODOS' ? 'No se encontraron resultados' : 'No hay gacetas disponibles'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                  {searchTerm || yearFilter !== 'TODOS' 
                    ? 'Intenta ajustar los filtros o términos de búsqueda.' 
                    : 'Pronto publicaremos nueva documentación oficial.'}
                </p>
                {(searchTerm || yearFilter !== 'TODOS') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setYearFilter('TODOS');
                    }}
                    style={{
                      marginTop: '1.5rem',
                      padding: '0.75rem 2rem',
                      background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: `0 4px 15px ${primary}40`
                    }}
                  >
                    🔄 Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ==================== MODAL VISOR PDF PROFESIONAL ==================== */}
          {selectedPdf && (
            <div 
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.3s ease'
              }}
              onClick={() => setSelectedPdf(null)}
            >
              <div 
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  width: '100%',
                  maxWidth: '1100px',
                  height: '92vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  animation: 'slideUp 0.4s ease',
                  boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header del Modal */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                  color: '#fff',
                  flexShrink: 0,
                  gap: '1rem'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    flex: 1,
                    minWidth: 0
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      flexShrink: 0
                    }}>
                      📄
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {selectedPdf.gaceta_titulo}
                      </h3>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.75rem', 
                        opacity: 0.9 
                      }}>
                        {selectedPdf.gaceta_tipo} • {formatearFecha(selectedPdf.gaceta_fecha)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <a
                      href={getPdfUrl(selectedPdf.gaceta_documento)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    >
                      🔗 Nueva pestaña
                    </a>
                    <a
                      href={getPdfUrl(selectedPdf.gaceta_documento)}
                      download
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    >
                      ⬇️ Descargar
                    </a>
                    <button
                      onClick={() => setSelectedPdf(null)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: '#fff',
                        fontSize: '1.3rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.transform = 'rotate(90deg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.transform = 'rotate(0deg)';
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Visor PDF */}
                <div style={{ flex: 1, position: 'relative', background: '#525659' }}>
                  <iframe
                    src={`${getPdfUrl(selectedPdf.gaceta_documento)}#toolbar=1&navpanes=1&scrollbar=1`}
                    title="Visor de PDF"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer data={institucion} />
    </div>
  );
}