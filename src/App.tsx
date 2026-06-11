import { useCarreraData } from './lib/api';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';

function App() {
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  
  // Estado para el carrusel de noticias/publicaciones
  const [newsSlide, setNewsSlide] = useState(0);

  // 🎨 Colores dinámicos desde la institución
  const colors: any = institucion?.colorinstitucion?.[0] || {};
  const primary = colors.color_primario || '#349433';
  const secondary = colors.color_secundario || '#00B9D1';
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🎨 Helper para variantes de color dinámico
  const getColorVariants = (baseColor: string) => ({
    light: `${baseColor}15`,
    medium: `${baseColor}40`,
    strong: `${baseColor}cc`,
    solid: baseColor
  });
  
  const primaryColors = getColorVariants(primary);
  const secondaryColors = getColorVariants(secondary);

  useEffect(() => {
    if (!contenido?.portada || contenido.portada.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= contenido.portada!.length - 1) return 0;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [contenido?.portada]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ width: '50px', height: '50px', border: `4px solid ${primaryColors.light}`, borderTop: `4px solid ${primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginLeft: '1rem', color: '#aaa' }}>Cargando...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: '#aaa' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 2rem', background: primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '1rem' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Helper para URLs de imágenes
  const getImageUrl = (filename: string | null | undefined): string => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${filename}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)`,
      color: '#f8fafc',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      overflowX: 'hidden'
    }}>
      <Header data={institucion} />
      
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
{/* ==================== 📖 SOBRE NOSOTROS ==================== */}
<section id="sobre-nosotros" style={{
  padding: '6rem 0',
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
  position: 'relative', 
  overflow: 'hidden',
  borderTop: `3px solid rgba(255,255,255,0.3)`, 
  borderBottom: `3px solid rgba(255,255,255,0.3)`
}}>
  {/* Elementos decorativos */}
  <div style={{ 
    position: 'absolute', 
    top: '10%', 
    right: '5%', 
    fontSize: '18rem', 
    opacity: 0.08, 
    color: '#fff', 
    pointerEvents: 'none', 
    zIndex: 0 
  }}>🏭</div>
  <div style={{ 
    position: 'absolute', 
    bottom: '10%', 
    left: '5%', 
    fontSize: '14rem', 
    opacity: 0.08, 
    color: '#fff', 
    pointerEvents: 'none', 
    zIndex: 0 
  }}>⚙️</div>

  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: '320px', 
          height: '320px', 
          borderRadius: '50%', 
          overflow: 'hidden', 
          boxShadow: '0 25px 70px rgba(0,0,0,0.3)', 
          border: '8px solid rgba(255,255,255,0.9)', 
          background: '#fff', 
          position: 'relative' 
        }}>
          {institucion?.institucion_logo ? (
            <img 
              src={institucion.institucion_logo?.startsWith('http') 
                ? institucion.institucion_logo 
                : `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${institucion.institucion_logo}`}
              alt={institucion.institucion_nombre} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                padding: '25px', 
                background: `linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)` 
              }} 
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: `linear-gradient(135deg, ${primary}, ${secondary})`, 
              fontSize: '6rem'
            }}>
              🎓
            </div>
          )}
        </div>
      </div>

      {/* Contenido de texto - LETRAS NEGRAS */}
      <div>
        <h2 style={{ 
          fontSize: '2.6rem', 
          color: '#000000', 
          marginBottom: '1.8rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em',
          textShadow: '1px 1px 2px rgba(255,255,255,0.5)'
        }}>
          Sobre Nosotros
        </h2>
        
        <div style={{ 
          fontSize: '1.05rem', 
          color: '#1a1a1a', 
          lineHeight: '1.85', 
          marginBottom: '2.2rem', 
          textAlign: 'justify',
          background: 'rgba(255,255,255,0.6)',
          padding: '1.5rem',
          borderRadius: '12px',
          borderLeft: `4px solid ${primary}`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          fontWeight: '400'
        }}
          dangerouslySetInnerHTML={{ 
            __html: institucion?.institucion_historia || 
            'La Carrera de Ingeniería en Producción Empresarial de la Universidad Pública de El Alto (UPEA) ha sido un pilar en la formación de profesionales competentes para el desarrollo del país.' 
          }} 
        />
        
        <a 
          href="#historia" 
          style={{ 
            display: 'inline-block', 
            padding: '1rem 2.5rem', 
            background: primary, 
            color: '#000000', 
            textDecoration: 'none', 
            borderRadius: '50px', 
            fontWeight: 700, 
            fontSize: '1rem', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)', 
            transition: 'all 0.3s ease',
            border: `2px solid ${primary}`
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'translateY(-4px)'; 
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.3)';
            e.currentTarget.style.background = secondary;
            e.currentTarget.style.borderColor = secondary;
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'translateY(0)'; 
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
            e.currentTarget.style.background = primary;
            e.currentTarget.style.borderColor = primary;
          }}
        >
          Leer más →
        </a>
      </div>
    </div>
  </div>
  
  <style>{`
    @keyframes float { 
      0%, 100% { transform: translateY(0); } 
      50% { transform: translateY(-12px); } 
    }
  `}</style>
</section>
      {/* ==================== 👥 AUTORIDADES ==================== */}
<section id="autoridades" style={{
  padding: '6rem 0',
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
  position: 'relative', 
  overflow: 'hidden',
  borderTop: `3px solid rgba(255,255,255,0.4)`,
  borderBottom: `3px solid rgba(255,255,255,0.4)`
}}>
  {/* Elementos decorativos de fondo */}
  <div style={{ 
    position: 'absolute', 
    top: '5%', 
    left: '10%', 
    width: '200px', 
    height: '200px', 
    border: `3px solid rgba(255,255,255,0.15)`, 
    borderRadius: '50%',
    pointerEvents: 'none' 
  }}></div>
  <div style={{ 
    position: 'absolute', 
    bottom: '10%', 
    right: '15%', 
    width: '150px', 
    height: '150px', 
    border: `3px solid rgba(255,255,255,0.15)`, 
    borderRadius: '50%',
    pointerEvents: 'none' 
  }}></div>
  <div style={{ 
    position: 'absolute', 
    top: '50%', 
    left: '5%', 
    fontSize: '10rem', 
    opacity: 0.06, 
    color: '#fff', 
    pointerEvents: 'none',
    transform: 'rotate(-15deg)'
  }}>👔</div>

  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
    
    {/* Encabezado de sección */}
    <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
      <span style={{ 
        display: 'inline-block', 
        padding: '0.5rem 1.8rem', 
        background: 'rgba(255,255,255,0.2)', 
        color: '#000', 
        borderRadius: '50px', 
        fontSize: '0.85rem', 
        fontWeight: 700, 
        marginBottom: '1rem',
        border: `1px solid rgba(255,255,255,0.4)`,
        backdropFilter: 'blur(8px)'
      }}>
        👥 NUESTRO EQUIPO
      </span>
      <h2 style={{ 
        fontSize: '2.8rem', 
        color: '#000000', 
        marginBottom: '1rem', 
        fontWeight: 800, 
        letterSpacing: '-0.02em',
        textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
      }}>
        Autoridades
      </h2>
      <div style={{ 
        width: '100px', 
        height: '5px', 
        background: `linear-gradient(90deg, #000, ${primary}, ${secondary}, #000)`, 
        margin: '0 auto 1.5rem', 
        borderRadius: '3px' 
      }}></div>
      <p style={{ 
        fontSize: '1.15rem', 
        color: '#1a1a1a', 
        maxWidth: '650px', 
        margin: '0 auto',
        fontWeight: 400,
        lineHeight: 1.7
      }}>
        Conoce a las autoridades que lideran nuestra institución con compromiso y excelencia
      </p>
    </div>

    {/* Grid de tarjetas de autoridades */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '2.5rem', 
      marginBottom: '3rem' 
    }}>
      {contenido?.autoridad?.map((autoridad: any, index) => {
        const fotoUrl = autoridad?.foto_autoridad 
          ? String(autoridad.foto_autoridad).startsWith('http') 
            ? autoridad.foto_autoridad 
            : `https://archivosminio.upea.bo/archivospaginasnode/imagenes/autoridades/${autoridad.foto_autoridad}` 
          : '';
        
        // Colores rotativos para variedad visual
        const accentColor = index % 2 === 0 ? primary : secondary;
        
        return (
          <div 
            key={autoridad.id_autoridad} 
            style={{
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)', 
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              cursor: 'pointer', 
              position: 'relative', 
              background: '#ffffff',
              border: `3px solid ${accentColor}`,
              transform: 'translateY(0)'
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
            {/* Foto de la autoridad */}
            <div style={{ 
              position: 'relative', 
              height: '360px', 
              overflow: 'hidden', 
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)` 
            }}>
              {fotoUrl ? (
                <>
                  <img 
                    src={fotoUrl} 
                    alt={autoridad.nombre_autoridad} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'top center',
                      transition: 'transform 0.4s ease'
                    }} 
                  />
                  {/* Overlay degradado en la foto */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    height: '60%', 
                    background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)` 
                  }}></div>
                </>
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)` 
                }}>
                  <span style={{ fontSize: '8rem', opacity: 0.3 }}>👤</span>
                </div>
              )}
              
              {/* Badge de posición flotante */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                padding: '0.4rem 1rem',
                background: '#fff',
                color: accentColor,
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: `2px solid ${accentColor}`
              }}>
                #{index + 1}
              </div>
            </div>

            {/* Información de la autoridad */}
            <div style={{ 
              padding: '2rem 1.8rem', 
              textAlign: 'center', 
              background: '#fff',
              position: 'relative'
            }}>
              {/* Línea decorativa superior */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                borderRadius: '2px'
              }}></div>

              <h3 style={{ 
                fontSize: '1.35rem', 
                fontWeight: 800, 
                color: '#000000', 
                margin: '1.2rem 0 0.5rem', 
                lineHeight: 1.3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {autoridad.nombre_autoridad}
              </h3>
              
              <p style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: accentColor, 
                margin: '0 0 1.5rem', 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                background: `${accentColor}15`,
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                display: 'inline-block'
              }}>
                {autoridad.cargo_autoridad}
              </p>
              
              {/* Redes sociales */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                {autoridad.facebook_autoridad && autoridad.facebook_autoridad !== 'qweqwe' && (
                  <a 
                    href={`https://facebook.com/${autoridad.facebook_autoridad}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '12px', 
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#000', 
                      textDecoration: 'none', 
                      transition: 'all 0.3s ease', 
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      boxShadow: `0 4px 12px ${accentColor}40`,
                      border: `2px solid ${accentColor}`
                    }} 
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)';
                      e.currentTarget.style.background = accentColor === primary ? secondary : primary;
                    }} 
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'scale(1) rotate(0)';
                      e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`;
                    }}
                  >
                    f
                  </a>
                )}
                {autoridad.celular_autoridad && autoridad.celular_autoridad !== '234' && (
                  <a 
                    href={`https://wa.me/${autoridad.celular_autoridad}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '12px', 
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#000', 
                      textDecoration: 'none', 
                      transition: 'all 0.3s ease', 
                      fontSize: '1.4rem',
                      boxShadow: `0 4px 12px ${accentColor}40`,
                      border: `2px solid ${accentColor}`
                    }} 
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)';
                      e.currentTarget.style.background = accentColor === primary ? secondary : primary;
                    }} 
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'scale(1) rotate(0)';
                      e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`;
                    }}
                  >
                    💬
                  </a>
                )}
              </div>
            </div>

            {/* Barra decorativa inferior */}
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: '5px', 
              background: `linear-gradient(90deg, ${primary}, ${secondary})` 
            }}></div>
          </div>
        );
      })}
    </div>

    {/* Estado vacío */}
    {!contenido?.autoridad?.length && (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem', 
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

     

     {/* ==================== 📰 NOTICIAS Y PUBLICACIONES ==================== */}
<section id="noticias" style={{
  padding: '6rem 0',
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
  position: 'relative', 
  overflow: 'hidden',
  borderTop: `3px solid rgba(255,255,255,0.4)`,
  borderBottom: `3px solid rgba(255,255,255,0.4)`
}}>
  {/* Elementos decorativos de fondo */}
  <div style={{ 
    position: 'absolute', 
    top: '10%', 
    right: '8%', 
    fontSize: '12rem', 
    opacity: 0.06, 
    color: '#fff', 
    pointerEvents: 'none',
    transform: 'rotate(15deg)'
  }}>📰</div>
  <div style={{ 
    position: 'absolute', 
    bottom: '15%', 
    left: '5%', 
    fontSize: '10rem', 
    opacity: 0.06, 
    color: '#fff', 
    pointerEvents: 'none',
    transform: 'rotate(-10deg)'
  }}>📢</div>

  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
    
    {/* Encabezado de sección */}
    <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
      <span style={{ 
        display: 'inline-block', 
        padding: '0.5rem 1.8rem', 
        background: 'rgba(255,255,255,0.2)', 
        color: '#000', 
        borderRadius: '50px', 
        fontSize: '0.85rem', 
        fontWeight: 700, 
        marginBottom: '1rem',
        border: `1px solid rgba(255,255,255,0.4)`,
        backdropFilter: 'blur(8px)'
      }}>
        📢 ACTUALIDAD
      </span>
      <h2 style={{ 
        fontSize: '2.8rem', 
        color: '#000000', 
        marginBottom: '1rem', 
        fontWeight: 800, 
        letterSpacing: '-0.02em',
        textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
      }}>
        Noticias y Publicaciones
      </h2>
      <div style={{ 
        width: '100px', 
        height: '5px', 
        background: `linear-gradient(90deg, #000, ${primary}, ${secondary}, #000)`, 
        margin: '0 auto 1.5rem', 
        borderRadius: '3px' 
      }}></div>
      <p style={{ 
        fontSize: '1.15rem', 
        color: '#1a1a1a', 
        maxWidth: '650px', 
        margin: '0 auto',
        fontWeight: 400,
        lineHeight: 1.7
      }}>
        Mantente informado sobre las últimas novedades, convocatorias y eventos de nuestra institución
      </p>
    </div>

    {/* 📦 GRID DE PUBLICACIONES - TODAS VISIBLES */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
      gap: '2.5rem',
      marginBottom: '3rem'
    }}>
      {recursos?.upea_publicaciones?.map((publicacion: any, index) => {
        // URL de imagen segura
        const imageUrl = publicacion?.publicaciones_imagen 
          ? publicacion.publicaciones_imagen.startsWith('http')
            ? publicacion.publicaciones_imagen
            : `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${publicacion.publicaciones_imagen}`
          : '';
        
        // URL de documento
        const docUrl = publicacion?.publicaciones_documento 
          ? publicacion.publicaciones_documento.startsWith('http')
            ? publicacion.publicaciones_documento
            : `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${publicacion.publicaciones_documento}`
          : '';

        // Color alternado para variedad visual
        const accentColor = index % 2 === 0 ? primary : secondary;
        
        // Formatear fecha
        const fechaFormateada = publicacion?.publicaciones_fecha 
          ? new Date(publicacion.publicaciones_fecha).toLocaleDateString('es-BO', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })
          : '';

        return (
          <article 
            key={publicacion.id_publicacion || index}
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#ffffff',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: `3px solid ${accentColor}`,
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = `0 30px 80px ${accentColor}40`;
              e.currentTarget.style.borderColor = accentColor === primary ? secondary : primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = accentColor;
            }}
          >
            {/* Badge de tipo y fecha */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              right: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              zIndex: 5,
              pointerEvents: 'none'
            }}>
              <span style={{
                padding: '0.35rem 1rem',
                background: '#fff',
                color: accentColor,
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                border: `2px solid ${accentColor}`
              }}>
                {publicacion.publicaciones_tipo || 'NOTICIA'}
              </span>
              {fechaFormateada && (
                <span style={{
                  padding: '0.35rem 1rem',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)'
                }}>
                  {fechaFormateada}
                </span>
              )}
            </div>

            {/* Imagen de la publicación */}
            <div style={{
              position: 'relative',
              height: '220px',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`
            }}>
              {imageUrl ? (
                <img 
                  src={imageUrl}
                  alt={publicacion.publicaciones_titulo || 'Publicación'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`
                }}>
                  <span style={{ fontSize: '5rem', opacity: 0.3 }}>📄</span>
                </div>
              )}
              {/* Overlay inferior para legibilidad */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
              }}></div>
            </div>

            {/* Contenido de texto */}
            <div style={{
              padding: '1.8rem',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              background: '#fff'
            }}>
              {/* Título */}
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#000000',
                margin: '0 0 1rem',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '3.2rem'
              }}>
                {publicacion.publicaciones_titulo || 'Sin título'}
              </h3>

              {/* Descripción */}
              <p style={{
                fontSize: '0.95rem',
                color: '#334155',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flexGrow: 1
              }}>
                {publicacion.publicaciones_descripcion 
                  ? publicacion.publicaciones_descripcion.replace(/<[^>]*>/g, '').substring(0, 180) + '...'
                  : 'Consulta los detalles de esta publicación en el documento adjunto.'}
              </p>

              {/* Botones de acción */}
              <div style={{
                display: 'flex',
                gap: '0.8rem',
                flexWrap: 'wrap',
                marginTop: 'auto'
              }}>
                {/* Botón Abrir/Ver */}
                {(imageUrl || docUrl) && (
                  <a 
                    href={imageUrl || docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                      color: '#000',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      border: `2px solid ${accentColor}`,
                      transition: 'all 0.3s ease',
                      minWidth: '120px'
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
                    👁️ Ver
                  </a>
                )}

                {/* Botón Descargar */}
                {docUrl && (
                  <a 
                    href={docUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      background: '#fff',
                      color: accentColor,
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      border: `2px solid ${accentColor}`,
                      transition: 'all 0.3s ease',
                      minWidth: '120px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = `0 8px 20px ${accentColor}40`;
                      e.currentTarget.style.background = accentColor;
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.color = accentColor;
                    }}
                  >
                    ⬇️ Descargar
                  </a>
                )}
              </div>
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
          </article>
        );
      })}
    </div>

    {/* Estado vacío */}
    {!recursos?.upea_publicaciones?.length && (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem', 
        color: '#000', 
        background: 'rgba(255,255,255,0.7)', 
        borderRadius: '20px', 
        border: `2px dashed ${primary}`,
        backdropFilter: 'blur(10px)',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📭</span>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#000' }}>
          Sin publicaciones disponibles
        </h3>
        <p style={{ color: '#333', fontSize: '1rem' }}>
          Pronto publicaremos nuevas noticias, convocatorias y actualizaciones institucionales.
        </p>
      </div>
    )}

    {/* Botón "Ver más" opcional */}
   {!recursos?.upea_publicaciones?.length &&  (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          style={{
            padding: '1rem 3rem',
            background: '#fff',
            color: primary,
            border: `3px solid ${primary}`,
            borderRadius: '50px',
            fontSize: '1.05rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = primary;
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 10px 30px ${primary}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = primary;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
          }}
        >
          Ver todas las publicaciones →
        </button>
      </div>
    )}
  </div>
</section>      
{/* ==================== 🔗 EXPLORA NUESTRA INSTITUCIÓN ==================== */}
<section id="explorar" style={{
  padding: '6rem 0',
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
  position: 'relative', 
  overflow: 'hidden',
  borderTop: `3px solid rgba(255,255,255,0.4)`,
  borderBottom: `3px solid rgba(255,255,255,0.4)`
}}>
  {/* Elementos decorativos de fondo */}
  <div style={{ 
    position: 'absolute', 
    top: '8%', 
    right: '10%', 
    fontSize: '14rem', 
    opacity: 0.06, 
    color: '#fff', 
    pointerEvents: 'none',
    transform: 'rotate(12deg)'
  }}>🔗</div>
  <div style={{ 
    position: 'absolute', 
    bottom: '12%', 
    left: '6%', 
    fontSize: '11rem', 
    opacity: 0.06, 
    color: '#fff', 
    pointerEvents: 'none',
    transform: 'rotate(-8deg)'
  }}>📚</div>

  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
    
    {/* Encabezado de sección */}
    <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
      <span style={{ 
        display: 'inline-block', 
        padding: '0.5rem 1.8rem', 
        background: 'rgba(255,255,255,0.2)', 
        color: '#000', 
        borderRadius: '50px', 
        fontSize: '0.85rem', 
        fontWeight: 700, 
        marginBottom: '1rem',
        border: `1px solid rgba(255,255,255,0.4)`,
        backdropFilter: 'blur(8px)'
      }}>
        🔗 ENLACES DE INTERÉS
      </span>
      <h2 style={{ 
        fontSize: '2.8rem', 
        color: '#000000', 
        marginBottom: '1rem', 
        fontWeight: 800, 
        letterSpacing: '-0.02em',
        textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
      }}>
        Explora Nuestra Institución
      </h2>
      <div style={{ 
        width: '100px', 
        height: '5px', 
        background: `linear-gradient(90deg, #000, ${primary}, ${secondary}, #000)`, 
        margin: '0 auto 1.5rem', 
        borderRadius: '3px' 
      }}></div>
      <p style={{ 
        fontSize: '1.15rem', 
        color: '#1a1a1a', 
        maxWidth: '650px', 
        margin: '0 auto',
        fontWeight: 400,
        lineHeight: 1.7
      }}>
        Accede a nuestros recursos, plataformas y servicios institucionales
      </p>
    </div>

    {/* Grid de tarjetas de enlaces */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '2.5rem', 
      marginBottom: '3.5rem' 
    }}>
      {recursos?.linksExternoInterno?.filter(link => link.estado === 1).map((link, index) => {
        const imageUrl = link.imagen?.startsWith('http') 
          ? link.imagen 
          : `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${link.imagen}`;
        
        // Color alternado para variedad visual
        const accentColor = index % 2 === 0 ? primary : secondary;
        
        return (
          <a 
            key={link.id_link || index} 
            href={link.url_link || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              cursor: 'pointer',
              position: 'relative',
              minHeight: '400px',
              background: '#ffffff',
              border: `3px solid ${accentColor}`,
              textDecoration: 'none',
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
            {/* Imagen o icono de fondo con overlay */}
            <div style={{
              position: 'relative',
              height: '180px',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`
            }}>
              {link.imagen ? (
                <>
                  <img 
                    src={imageUrl} 
                    alt={link.nombre} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${accentColor}80, ${accentColor}60)`,
                    opacity: 0.7
                  }}></div>
                </>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`
                }}>
                  <span style={{ fontSize: '6rem', opacity: 0.4 }}>🔗</span>
                </div>
              )}
              
              {/* Badge de tipo flotante */}
              {link.tipo && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.35rem 1rem',
                  background: '#fff',
                  color: accentColor,
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                  border: `2px solid ${accentColor}`
                }}>
                  {link.tipo}
                </div>
              )}
            </div>

            {/* Contenido de texto */}
            <div style={{
              padding: '2rem 1.8rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              flexGrow: 1,
              background: '#fff'
            }}>
              {/* Icono circular */}
              <div style={{
                width: '80px',
                height: '80px',
                marginBottom: '1.5rem',
                background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: `3px solid ${accentColor}`,
                boxShadow: `0 5px 15px ${accentColor}30`
              }}>
                {link.imagen ? (
                  <img 
                    src={imageUrl} 
                    alt={link.nombre} 
                    style={{ 
                      width: '70%', 
                      height: '70%', 
                      objectFit: 'contain' 
                    }} 
                  />
                ) : (
                  <span style={{ fontSize: '2.5rem' }}>🔗</span>
                )}
              </div>

              {/* Título */}
              <h3 style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#000000',
                margin: '0 0 0.8rem',
                lineHeight: 1.35,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {link.nombre}
              </h3>

              {/* Descripción */}
              <p style={{
                fontSize: '0.95rem',
                color: '#334155',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '270px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {link.descripcion || 'Accede a este recurso institucional'}
              </p>

              {/* Botón de acceso */}
              <span style={{
                padding: '0.9rem 2.2rem',
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                color: '#000',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: `0 5px 15px ${accentColor}40`,
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                border: `2px solid ${accentColor}`,
                marginTop: 'auto'
              }}>
                Acceder 
                <span style={{ 
                  transition: 'transform 0.3s ease',
                  display: 'inline-block'
                }}>→</span>
              </span>
            </div>

            {/* Barra decorativa inferior */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: `linear-gradient(90deg, ${primary}, ${secondary})`
            }}></div>
          </a>
        );
      })}
    </div>

    {/* Estado vacío */}
    {!recursos?.linksExternoInterno?.length && (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem', 
        color: '#000', 
        background: 'rgba(255,255,255,0.7)', 
        borderRadius: '20px', 
        border: `2px dashed ${primary}`,
        backdropFilter: 'blur(10px)',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🔗</span>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#000' }}>
          Sin enlaces disponibles
        </h3>
        <p style={{ color: '#333', fontSize: '1rem' }}>
          Pronto agregaremos enlaces de interés y recursos institucionales.
        </p>
      </div>
    )}
  </div>
</section>

     
      <Footer data={institucion} />
    </div>
  );
}

export default App;