import { useState, useEffect } from 'react';
import { useCarreraData } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CursosPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [cursoModal, setCursoModal] = useState<any>(null);

  // ✅ Validación segura de URLs
  const esUrlSegura = (url: string): boolean => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const dominiosPermitidos = [
        'wa.me',
        'chat.whatsapp.com',
        'web.whatsapp.com',
        'facebook.com',
        'www.facebook.com',
        'instagram.com',
        'www.instagram.com',
        'upea.bo',
        'www.upea.bo'
      ];
      return dominiosPermitidos.some(
        dominio => urlObj.hostname === dominio || urlObj.hostname.endsWith(`.${dominio}`)
      );
    } catch {
      return false;
    }
  };

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
      if (e.key === 'Escape') setCursoModal(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #f3f4f6', borderTop: `4px solid ${primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#666', marginTop: 16 }}>Cargando cursos...</p>
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

  // ✅ FILTRAR SOLO CURSOS desde recursos.cursos
  const todosLosCursos = recursos?.cursos
    ?.filter(curso => {
      const tipoCurso = curso.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || '';
      const titulo = curso.det_titulo?.toUpperCase() || '';
      
      // ✅ Filtrar SOLO si es CURSO o DIPLOMADO (excluir SEMINARIOS)
      return (tipoCurso === 'CURSOS' || tipoCurso === 'DIPLOMADO' || titulo.includes('CURSO')) && 
             curso.det_estado === "1"; // Solo activos
    })
    .sort((a, b) => new Date(b.det_fecha_ini).getTime() - new Date(a.det_fecha_ini).getTime()) || [];

  // Filtrar por categoría (tipo de curso)
  const cursosFiltrados = filtroActivo === 'TODOS' 
    ? todosLosCursos 
    : todosLosCursos.filter(c => {
        const tipo = c.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || '';
        const titulo = c.det_titulo?.toUpperCase() || '';
        
        // Filtrar por tipo O por título que contenga el filtro
        return tipo === filtroActivo.toUpperCase() || 
               titulo.includes(filtroActivo.toUpperCase());
      });

  // Obtener categorías únicas de cursos
  const categorias = ['TODOS', ...Array.from(new Set(
    todosLosCursos
      .map(c => c.tipo_curso_otro?.tipo_conv_curso_nombre || 'CURSO')
      .filter(tipo => tipo !== 'SEMINARIOS') // Excluir seminarios
      .filter(Boolean)
  ))];

  // Formatear fecha
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
        
        /* ✅ Rotación 360° para tarjetas */
        @keyframes rotate360 { 
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .curso-card-3d {
          animation: rotate360 8s linear infinite;
          transform-style: preserve-3d;
        }
        .curso-card-3d:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) { .curso-card { padding: 1.5rem !important; } }
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

        {/* ==================== CURSOS ==================== */}
           <section id="cursos-content" style={{
  padding: '6rem 0',
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  borderTop: `3px solid rgba(255,255,255,0.4)`,
  borderBottom: `3px solid rgba(255,255,255,0.4)`
}}>
          {/* Gradientes de fondo */}
        
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Header y Filtros */}
            <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'fadeInUp 0.6s ease-out' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem' }}>
                Cursos y <span style={{ color: secondary }}>Diplomados</span>
              </h2>
              
              {/* Botones de Filtro */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginBottom: '3rem'
              }}>
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFiltroActivo(cat)}
                    style={{
                      padding: '0.75rem 2rem',
                      background: filtroActivo === cat 
                        ? `linear-gradient(135deg, ${primary}, ${primary}cc)` 
                        : 'rgba(255,255,255,0.1)',
                      color: filtroActivo === cat ? '#fff' : '#94a3b8',
                      border: `2px solid ${filtroActivo === cat ? primary : 'rgba(255,255,255,0.2)'}`,
                      borderRadius: '50px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      if (filtroActivo !== cat) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filtroActivo !== cat) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.color = '#94a3b8';
                      }
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ width: '100px', height: '3px', background: `linear-gradient(90deg, ${primary}, ${secondary})`, margin: '0 auto', borderRadius: '2px' }}></div>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '1.5rem' }}>
                {cursosFiltrados.length} {cursosFiltrados.length === 1 ? 'curso' : 'cursos'} disponibles
              </p>
            </div>

            {cursosFiltrados.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2.5rem'
              }}>
                {cursosFiltrados.map((curso, idx) => (
                  <div 
                    key={curso.iddetalle_cursos_academicos}
                    className="curso-card curso-card-3d"
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      transition: 'all 0.3s ease',
                      animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                      border: `2px solid ${idx % 2 === 0 ? primary : secondary}20`,
                      cursor: 'pointer'
                    }}
                    onClick={() => setCursoModal(curso)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = `0 15px 40px ${idx % 2 === 0 ? primary : secondary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                    }}
                  >
                    {/* Imagen */}
                    <div style={{
                      position: 'relative',
                      height: '220px',
                      overflow: 'hidden',
                      background: `linear-gradient(135deg, ${primary}15, ${secondary}15)`
                    }}>
                      {curso.det_img_portada ? (
                        <img 
                          src={getImageUrl(curso.det_img_portada)} 
                          alt={curso.det_titulo}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '4rem',
                          color: idx % 2 === 0 ? primary : secondary,
                          background: `linear-gradient(135deg, ${primary}10, ${secondary}10)`
                        }}>
                          📚
                        </div>
                      )}
                      
                      {/* Badge de tipo */}
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        padding: '0.4rem 1rem',
                        background: idx % 2 === 0 ? primary : secondary,
                        color: '#fff',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        {curso.tipo_curso_otro?.tipo_conv_curso_nombre || 'CURSO'}
                      </div>

                      {/* Modalidad */}
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        padding: '0.4rem 1rem',
                        background: 'rgba(255,255,255,0.9)',
                        color: primary,
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        {curso.det_modalidad === 'VIRTUAL' ? '💻 Virtual' : '🏢 Presencial'}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div style={{ padding: '2rem' }}>
                      {/* Fecha */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        color: '#64748b',
                        fontWeight: 500
                      }}>
                        <span>📅</span>
                        <span>{formatearFecha(curso.det_fecha_ini)}</span>
                        {curso.det_fecha_fin !== curso.det_fecha_ini && (
                          <span> - {formatearFecha(curso.det_fecha_fin)}</span>
                        )}
                      </div>

                      {/* Título */}
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        marginBottom: '1rem',
                        lineHeight: 1.4,
                        minHeight: '60px'
                      }}>
                        {curso.det_titulo}
                      </h3>

                      {/* Descripción truncada */}
                      <div 
                        style={{
                          color: '#64748b',
                          fontSize: '0.95rem',
                          lineHeight: 1.7,
                          marginBottom: '1.5rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                        dangerouslySetInnerHTML={{ __html: curso.det_descripcion }}
                      />

                      {/* Detalles adicionales */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        color: '#64748b'
                      }}>
                        {curso.det_carga_horaria > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>⏱️</span>
                            <span>{curso.det_carga_horaria} horas académicas</span>
                          </div>
                        )}
                        {curso.det_lugar_curso && curso.det_lugar_curso !== '---' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📍</span>
                            <span>{curso.det_lugar_curso}</span>
                          </div>
                        )}
                        {curso.det_costo > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: primary }}>
                            <span>💰</span>
                            <span>Bs. {curso.det_costo.toLocaleString('es-BO')}</span>
                          </div>
                        )}
                      </div>

                      {/* Botón Ver Detalles */}
                      <button 
                        style={{
                          width: '100%',
                          padding: '0.875rem 1.5rem',
                          background: `linear-gradient(135deg, ${idx % 2 === 0 ? primary : secondary}, ${idx % 2 === 0 ? primary : secondary}cc)`,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: `0 4px 12px ${idx % 2 === 0 ? primary : secondary}40`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = `0 6px 16px ${idx % 2 === 0 ? primary : secondary}60`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = `0 4px 12px ${idx % 2 === 0 ? primary : secondary}40`;
                        }}
                      >
                        Ver Detalles →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '6rem 2rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: `2px dashed ${primary}30`
              }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem', opacity: 0.3 }}>📚</div>
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.75rem' }}>
                  No hay cursos disponibles
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                  Pronto publicaremos nuevos cursos y diplomados.
                </p>
              </div>
            )}
          </div>

          {/* ==================== MODAL DE CURSO ==================== */}
          {cursoModal && (
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
                cursor: 'pointer',
                padding: '2rem',
                overflow: 'auto'
              }}
              onClick={() => setCursoModal(null)}
            >
              {/* Contenido del modal */}
              <div 
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  maxWidth: '800px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  animation: 'zoomIn 0.3s ease',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header del modal */}
                <div style={{
                  position: 'sticky',
                  top: 0,
                  background: `linear-gradient(135deg, ${primary}, ${primary}dd)`,
                  color: '#fff',
                  padding: '2rem',
                  borderRadius: '16px 16px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  zIndex: 1
                }}>
                  <div>
                    <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', fontWeight: 700 }}>
                      {cursoModal.det_titulo}
                    </h2>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
                      {cursoModal.tipo_curso_otro?.tipo_conv_curso_nombre || 'CURSO'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setCursoModal(null)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
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
                </div>

                {/* Imagen */}
                {cursoModal.det_img_portada && (
                  <div style={{
                    width: '100%',
                    height: '300px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={getImageUrl(cursoModal.det_img_portada)} 
                      alt={cursoModal.det_titulo}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Contenido */}
                <div style={{ padding: '2rem' }}>
                  {/* Información principal */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: '#f8fafc',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>📅 Fecha de Inicio</p>
                      <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{formatearFecha(cursoModal.det_fecha_ini)}</p>
                    </div>
                    {cursoModal.det_fecha_fin !== cursoModal.det_fecha_ini && (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>📅 Fecha de Fin</p>
                        <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{formatearFecha(cursoModal.det_fecha_fin)}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>⏱️ Duración</p>
                      <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{cursoModal.det_carga_horaria} horas</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>🏢 Modalidad</p>
                      <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{cursoModal.det_modalidad}</p>
                    </div>
                    {cursoModal.det_lugar_curso && cursoModal.det_lugar_curso !== '---' && (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>📍 Lugar</p>
                        <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{cursoModal.det_lugar_curso}</p>
                      </div>
                    )}
                    {cursoModal.det_costo > 0 && (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>💰 Costo</p>
                        <p style={{ fontSize: '1.1rem', color: primary, fontWeight: 700 }}>Bs. {cursoModal.det_costo.toLocaleString('es-BO')}</p>
                      </div>
                    )}
                    {cursoModal.det_cupo_max > 0 && (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>👥 Cupos</p>
                        <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{cursoModal.det_cupo_max} disponibles</p>
                      </div>
                    )}
                  </div>

                  {/* Descripción completa */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '1rem', fontWeight: 700 }}>
                      Descripción del Curso
                    </h3>
                    <div 
                      style={{
                        color: '#475569',
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        textAlign: 'justify'
                      }}
                      dangerouslySetInnerHTML={{ __html: cursoModal.det_descripcion }}
                    />
                  </div>

                  {/* WhatsApp si existe - ✅ CORREGIDO */}
                  {cursoModal.det_grupo_whatssap && (
                    <div style={{
                      padding: '1.5rem',
                      background: '#dcfce7',
                      borderRadius: '12px',
                      border: `2px solid ${primary}30`,
                      marginBottom: '2rem'
                    }}>
                      <p style={{ fontSize: '0.9rem', color: '#166534', marginBottom: '0.5rem', fontWeight: 600 }}>
                        📱 ¿Tienes consultas?
                      </p>
                      <a 
                        href={esUrlSegura(cursoModal.det_grupo_whatssap) 
                          ? (cursoModal.det_grupo_whatssap.startsWith('http') 
                              ? cursoModal.det_grupo_whatssap 
                              : `https://${cursoModal.det_grupo_whatssap}`)
                          : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!esUrlSegura(cursoModal.det_grupo_whatssap)) {
                            e.preventDefault();
                            alert('URL no válida o no permitida');
                          }
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          background: '#25D366',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,211,102,0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        💬 Contactar por WhatsApp
                      </a>
                    </div>
                  )}

                  {/* Botón de inscripción */}
                  <button 
                    style={{
                      width: '100%',
                      padding: '1.125rem 2rem',
                      background: `linear-gradient(135deg, ${primary}, ${primary}dd)`,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 6px 20px ${primary}40`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${primary}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 6px 20px ${primary}40`;
                    }}
                  >
                    Inscribirme Ahora →
                  </button>
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