import { useState, useEffect } from 'react';
import { useCarreraData } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SeminariosPage() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [seminarioModal, setSeminarioModal] = useState<any>(null);

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
      if (e.key === 'Escape') setSeminarioModal(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #f3f4f6', borderTop: `4px solid ${primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#666', marginTop: 16 }}>Cargando seminarios...</p>
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

  // ✅ FILTRAR SOLO SEMINARIOS desde recursos.cursos
  const todosLosSeminarios = recursos?.cursos
    ?.filter(curso => {
      const tipoCurso = curso.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || '';
      const titulo = curso.det_titulo?.toUpperCase() || '';
      
      // ✅ Filtrar SOLO si es SEMINARIO o si el título contiene SEMINARIO
      // ❌ Excluir los que son "CURSOS" u otros tipos
      return (tipoCurso === 'SEMINARIOS' || titulo.includes('SEMINARIO')) && 
             curso.det_estado === "1"; // Solo activos
    })
    .sort((a, b) => new Date(b.det_fecha_ini).getTime() - new Date(a.det_fecha_ini).getTime()) || [];

  // Filtrar por categoría (tipo de seminario)
  const seminariosFiltrados = filtroActivo === 'TODOS' 
    ? todosLosSeminarios 
    : todosLosSeminarios.filter(s => {
        const tipo = s.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || '';
        const titulo = s.det_titulo?.toUpperCase() || '';
        
        // Filtrar por tipo O por título que contenga el filtro
        return tipo === filtroActivo.toUpperCase() || 
               titulo.includes(filtroActivo.toUpperCase());
      });

  // Obtener categorías únicas de seminarios (excluyendo "CURSOS")
  const categorias = ['TODOS', ...Array.from(new Set(
    todosLosSeminarios
      .map(s => {
        const tipo = s.tipo_curso_otro?.tipo_conv_curso_nombre || 'SEMINARIO';
        // Si es "CURSOS", cambiar a "SEMINARIO" para no mostrarlo como categoría
        return tipo === 'CURSOS' ? 'SEMINARIO' : tipo;
      })
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
        .seminario-card-3d {
          animation: rotate360 8s linear infinite;
          transform-style: preserve-3d;
        }
        .seminario-card-3d:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) { .seminario-card { padding: 1.5rem !important; } }
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
        {/* ==================== SEMINARIOS ==================== */}
     <section id="seminarios-content" style={{
  padding: '6rem 0',
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,  // ← CAMBIO AQUÍ
  position: 'relative',
  overflow: 'hidden',
  borderTop: `3px solid rgba(255,255,255,0.4)`,   // ← NUEVO
  borderBottom: `3px solid rgba(255,255,255,0.4)`  // ← NUEVO
}}>
          {/* Gradientes de fondo */}
        
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Header y Filtros */}
            <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'fadeInUp 0.6s ease-out' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem' }}>
                Seminarios <span style={{ color: secondary }}>Disponibles</span>
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
                {seminariosFiltrados.length} {seminariosFiltrados.length === 1 ? 'seminario' : 'seminarios'} disponibles
              </p>
            </div>

            {seminariosFiltrados.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2.5rem'
              }}>
                {seminariosFiltrados.map((seminario, idx) => (
                  <div 
                    key={seminario.iddetalle_cursos_academicos}
                    className="seminario-card seminario-card-3d"
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
                    onClick={() => setSeminarioModal(seminario)}
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
                      {seminario.det_img_portada ? (
                        <img 
                          src={getImageUrl(seminario.det_img_portada)} 
                          alt={seminario.det_titulo}
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
                          🎓
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
                        {seminario.tipo_curso_otro?.tipo_conv_curso_nombre || 'SEMINARIO'}
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
                        {seminario.det_modalidad === 'VIRTUAL' ? '💻 Virtual' : '🏢 Presencial'}
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
                        <span>{formatearFecha(seminario.det_fecha_ini)}</span>
                        {seminario.det_fecha_fin !== seminario.det_fecha_ini && (
                          <span> - {formatearFecha(seminario.det_fecha_fin)}</span>
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
                        {seminario.det_titulo}
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
                        dangerouslySetInnerHTML={{ __html: seminario.det_descripcion }}
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
                        {seminario.det_carga_horaria > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>⏱️</span>
                            <span>{seminario.det_carga_horaria} horas académicas</span>
                          </div>
                        )}
                        {seminario.det_lugar_curso && seminario.det_lugar_curso !== '---' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📍</span>
                            <span>{seminario.det_lugar_curso}</span>
                          </div>
                        )}
                        {seminario.det_costo > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: primary }}>
                            <span>💰</span>
                            <span>Bs. {seminario.det_costo.toLocaleString('es-BO')}</span>
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
                  No hay seminarios disponibles
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                  Pronto publicaremos nuevos seminarios y cursos.
                </p>
              </div>
            )}
          </div>

          {/* ==================== MODAL DE SEMINARIO ==================== */}
          {seminarioModal && (
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
              onClick={() => setSeminarioModal(null)}
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
                      {seminarioModal.det_titulo}
                    </h2>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
                      {seminarioModal.tipo_curso_otro?.tipo_conv_curso_nombre || 'SEMINARIO'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSeminarioModal(null)}
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
                {seminarioModal.det_img_portada && (
                  <div style={{
                    width: '100%',
                    height: '300px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={getImageUrl(seminarioModal.det_img_portada)} 
                      alt={seminarioModal.det_titulo}
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
                      <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{formatearFecha(seminarioModal.det_fecha_ini)}</p>
                    </div>
                    {seminarioModal.det_fecha_fin !== seminarioModal.det_fecha_ini && (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>📅 Fecha de Fin</p>
                        <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{formatearFecha(seminarioModal.det_fecha_fin)}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>⏱️ Duración</p>
                      <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{seminarioModal.det_carga_horaria} horas</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>🏢 Modalidad</p>
                      <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{seminarioModal.det_modalidad}</p>
                    </div>
                    {seminarioModal.det_lugar_curso && seminarioModal.det_lugar_curso !== '---' && (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>📍 Lugar</p>
                        <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{seminarioModal.det_lugar_curso}</p>
                      </div>
                    )}
                    {seminarioModal.det_costo > 0 && (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>💰 Costo</p>
                        <p style={{ fontSize: '1.1rem', color: primary, fontWeight: 700 }}>Bs. {seminarioModal.det_costo.toLocaleString('es-BO')}</p>
                      </div>
                    )}
                    {seminarioModal.det_cupo_max > 0 && (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>👥 Cupos</p>
                        <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{seminarioModal.det_cupo_max} disponibles</p>
                      </div>
                    )}
                  </div>

                  {/* Descripción completa */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '1rem', fontWeight: 700 }}>
                      Descripción del Seminario
                    </h3>
                    <div 
                      style={{
                        color: '#475569',
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        textAlign: 'justify'
                      }}
                      dangerouslySetInnerHTML={{ __html: seminarioModal.det_descripcion }}
                    />
                  </div>

                  {/* WhatsApp si existe */}
                  {seminarioModal.det_grupo_whatssap && (
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
                        href={seminarioModal.det_grupo_whatssap.startsWith('http') ? seminarioModal.det_grupo_whatssap : `https://${seminarioModal.det_grupo_whatssap}`}
                        target="_blank"
                        rel="noopener noreferrer"
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