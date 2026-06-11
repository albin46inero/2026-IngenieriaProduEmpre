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

  // DEBUG - Ver datos crudos
  console.log('📊 Total de gacetas recibidas:', gacetas.length);
  console.log('📊 Datos crudos de gacetas:', gacetas);
  console.log('📊 Recursos completos:', recursos);

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

  // DEBUG - Ver gacetas filtradas
  console.log('🔍 Gacetas filtradas:', gacetasFiltradas.length);
  console.log('🔍 Datos filtrados:', gacetasFiltradas);

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
        .doc-card {
          transition: all 0.3s ease;
        }
        .doc-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        @media (max-width: 768px) { 
          .gaceta-grid { grid-template-columns: 1fr !important; }
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
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeInUp 0.6s ease-out' }}>
              <h2 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                color: '#1e293b', 
                fontWeight: 900, 
                marginBottom: '1rem'
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
            </div>

            {/* Panel de filtros */}
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '3rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              {/* Barra de búsqueda */}
              <div style={{ maxWidth: '700px', margin: '0 auto 1.5rem', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar por título o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem 1rem 3.5rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '50px',
                    background: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Filtros por año */}
              {añosDisponibles.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                     Filtrar por año:
                  </span>
                  <button
                    onClick={() => setYearFilter('TODOS')}
                    style={{
                      padding: '0.5rem 1.25rem',
                      background: yearFilter === 'TODOS' ? `linear-gradient(135deg, ${primary}, ${secondary})` : '#f1f5f9',
                      color: yearFilter === 'TODOS' ? '#fff' : '#475569',
                      border: 'none',
                      borderRadius: '50px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Todos
                  </button>
                  {añosDisponibles.map(year => (
                    <button
                      key={year}
                      onClick={() => setYearFilter(year)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: yearFilter === year ? `linear-gradient(135deg, ${primary}, ${secondary})` : '#f1f5f9',
                        color: yearFilter === year ? '#fff' : '#475569',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

           

            {gacetasFiltradas.length > 0 ? (
              <>
                {/* Grid de Gacetas - DISEÑO SIMPLIFICADO PARA DEBUG */}
                <div className="gaceta-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '2rem'
                }}>
                  {gacetasFiltradas.map((gaceta, idx) => {
                    console.log(`📄 [${idx}] Renderizando gaceta:`, gaceta);
                    
                    return (
                      <div 
                        key={gaceta.gaceta_id || idx}
                        className="doc-card"
                        onClick={() => setSelectedPdf(gaceta)}
                        style={{
                          background: '#fff',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          cursor: 'pointer',
                          border: '3px solid #ef4444',
                          animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`
                        }}
                      >
                        {/* Portada */}
                        <div style={{
                          height: '200px',
                          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1.5rem',
                          color: '#fff'
                        }}>
                          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📄</div>
                          <div style={{
                            background: 'rgba(255,255,255,0.25)',
                            padding: '0.35rem 1rem',
                            borderRadius: '50px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            {gaceta.gaceta_tipo || 'GACETA'}
                          </div>
                          <div style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '50px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {getYearFromDate(gaceta.gaceta_fecha)}
                          </div>
                        </div>

                        {/* Contenido */}
                        <div style={{ padding: '1.5rem' }}>
                          <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#1e293b',
                            marginBottom: '0.75rem',
                            lineHeight: 1.4,
                            minHeight: '60px'
                          }}>
                            {gaceta.gaceta_titulo || 'Sin título'}
                          </h3>

                          <div style={{
                            color: '#64748b',
                            fontSize: '0.9rem',
                            marginBottom: '1.25rem',
                            paddingBottom: '1.25rem',
                            borderBottom: '1px solid #e2e8f0'
                          }}>
                             {formatearFecha(gaceta.gaceta_fecha)}
                          </div>

                          {/* Botones */}
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPdf(gaceta);
                              }}
                              style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: `linear-gradient(135deg, ${primary}, ${primary}dd)`,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                              }}
                            >
                              Ver PDF
                            </button>
                            <a
                              href={getPdfUrl(gaceta.gaceta_documento)}
                              download
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: 'transparent',
                                color: primary,
                                border: `2px solid ${primary}`,
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              Bajar
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: '#fff',
                borderRadius: '20px'
              }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem', opacity: 0.3 }}>📭</div>
                <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.75rem' }}>
                  {searchTerm || yearFilter !== 'TODOS' ? 'No se encontraron resultados' : 'No hay gacetas disponibles'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>
                  {searchTerm || yearFilter !== 'TODOS' 
                    ? 'Intenta ajustar los filtros.' 
                    : 'Pronto publicaremos nueva documentación.'}
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
                      cursor: 'pointer'
                    }}
                  >
                     Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ==================== MODAL VISOR PDF ==================== */}
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
                padding: '1rem'
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
                  overflow: 'hidden'
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
                  color: '#fff'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                      {selectedPdf.gaceta_titulo}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', opacity: 0.9 }}>
                      {selectedPdf.gaceta_tipo} • {formatearFecha(selectedPdf.gaceta_fecha)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                        fontWeight: 600
                      }}
                    >
                       Nueva pestaña
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
                        fontWeight: 600
                      }}
                    >
                       Descargar
                    </a>
                    <button
                      onClick={() => setSelectedPdf(null)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.3rem',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Visor PDF */}
                <div style={{ flex: 1, position: 'relative', background: '#525659' }}>
                  <iframe
                    src={`${getPdfUrl(selectedPdf.gaceta_documento)}#toolbar=1&navpanes=1`}
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