import { useState, useEffect, useMemo } from 'react';
import { InstitucionPrincipal } from '../lib/api';

interface HeaderProps {
   data: InstitucionPrincipal | null;
}

// =============================================
// CONFIGURACIÓN - VARIABLES DE ENTORNO OBLIGATORIAS
// =============================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SERVICIO_URL = import.meta.env.VITE_SERVICIO_URL;

// =============================================
// UTILIDAD: Construir URL del logo
// =============================================
const buildLogoUrl = (logoPath: string | null | undefined): string => {
  if (!logoPath || !API_BASE_URL) return '';
  const cleanPath = logoPath.trim();
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) return cleanPath;
  if (cleanPath.startsWith('/storage/')) return `${API_BASE_URL}${cleanPath}`;
  return `${API_BASE_URL}/storage/imagenes/logos/${cleanPath}`;
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
export default function Header({ data }: HeaderProps) {
  if (!data) return null;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
        setOpenMobileSubMenu(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Colores dinámicos
  const colors = useMemo(() => {
    const colores = data.colorinstitucion?.[0] || {};
    return {
      primary: colores.color_primario || '#349433',
      secondary: colores.color_secundario || '#00B9D1',
      tertiary: colores.color_terciario || '#00B9D1'
    }
  }, [data.colorinstitucion]);

  // URL del logo
  const logoUrl = useMemo(() => buildLogoUrl(data.institucion_logo), [data.institucion_logo]);

  // Handlers
  const handleMouseEnter = (menu: string) => setActiveDropdown(menu);
  const handleMouseLeave = () => setActiveDropdown(null);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenMobileSubMenu(null);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMobileSubMenu(null);
  };
  
  const toggleMobileSubMenu = (menuId: string) => {
    setOpenMobileSubMenu(openMobileSubMenu === menuId ? null : menuId);
  };

  // ✅ Scroll suave a sección con navegación inteligente
  const scrollToSection = (href: string) => {
    closeMobileMenu();
    
    // Si es un hash (#seccion)
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        // Calcular offset del header fijo
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Si no existe la sección en la página actual
        // Navegar a home con el hash
        window.location.href = `/${href}`;
      }
    }
  };

  // Menú items
  const menuItems = [
    {
      id: 'institucion',
      label: 'LA INSTITUCIÓN',
      links: [
        { href: '#historia', label: 'Historia' },
        { href: '#mision-vision', label: 'Misión y Visión' },
        { href: '#perfil', label: 'Perfil Profesional' },
        { href: '#autoridades', label: 'Autoridades' },
      ]
    },
    {
      id: 'convocatorias',
      label: 'CONVOCATORIAS',
      links: [
        { href: '#avisos', label: 'Avisos' },
        { href: '#comunicados', label: 'Comunicados' },
        { href: '#gaceta', label: 'Gaceta' },
      ]
    },
    {
      id: 'cursos',
      label: 'CURSOS',
      links: [
        { href: '#seminarios', label: 'Seminarios' },
        { href: '#cursos', label: 'Cursos' },
      ]
    },
    {
      id: 'mas',
      label: 'MÁS',
      links: [
        { href: '#servicios', label: 'Servicios' },
        { href: '#ofertas-academicas', label: 'Ofertas Académicas' },
        { href: '#publicaciones', label: 'Publicaciones' },
        { href: '#eventos', label: 'Eventos' },
        { href: '#videos', label: 'Videos' },
      ]
    }
  ];

  return (
    <>
      {/* Estilos CSS globales */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 1000px; } }
        @keyframes slideUp { from { opacity: 1; max-height: 1000px; } to { opacity: 0; max-height: 0; } }
        
        .header-solid { transition: all 0.3s ease; }
        .header-solid.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        .nav-link-hover:hover { background: rgba(255,255,255,0.15) !important; transform: translateY(-2px); }
        .dropdown-item-hover:hover { background: rgba(255,255,255,0.1) !important; padding-left: 1.5rem !important; color: ${colors.secondary} !important; }
        .btn-login-hover:hover { transform: translateY(-3px) !important; box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important; }
        
        .hamburger-line { transition: all 0.3s ease; }
        .hamburger-active .hamburger-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger-active .hamburger-line:nth-child(2) { opacity: 0; }
        .hamburger-active .hamburger-line:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        
        .square-font {
          font-family: 'Courier New', monospace, 'Segoe UI', sans-serif;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        /* ✅ MENÚ MÓVIL - CORREGIDO */
        .mobile-nav-container {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          backdrop-filter: blur(20px);
          padding: 0;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          z-index: 999;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.4s ease, opacity 0.3s ease, padding 0.3s ease;
        }
        
        .mobile-nav-container.open {
          display: block;
          max-height: 100vh;
          opacity: 1;
          padding: 1.5rem 2rem;
          overflow-y: auto;
        }
        
        .mobile-toggle-btn {
          display: none !important;
        }
        
        .mobile-submenu {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
          margin: 0;
        }
        
        .mobile-submenu.open {
          max-height: 500px;
          opacity: 1;
          margin: 0.5rem 0 0;
        }
        
        .submenu-arrow {
          transition: transform 0.3s ease;
          display: inline-block;
        }
        
        .submenu-arrow.rotated {
          transform: rotate(180deg);
        }
        
        @media (max-width: 1024px) { 
          .desktop-nav { display: none !important; } 
          .mobile-toggle-btn { display: flex !important; } 
        }
        @media (min-width: 1025px) { 
          .mobile-toggle-btn { display: none !important; } 
          .mobile-nav-container { display: none !important; } 
        }
      `}</style>

      {/* Header */}
      <header 
        className={`header-solid ${scrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          backdropFilter: 'blur(10px)',
          borderBottom: `2px solid rgba(255,255,255,0.2)`,
          padding: scrolled ? '0.75rem 0' : '1rem 0',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '70px'
        }}>
          
          {/* LOGO Y NOMBRE */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            animation: 'fadeIn 0.5s ease',
            marginRight: 'auto'
          }}>
            {logoUrl && (
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                border: `2px solid ${colors.secondary}`
              }}>
                <img 
                  src={logoUrl} 
                  alt={data.institucion_nombre}
                  style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                  loading="eager"
                />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                lineHeight: 1.2,
                textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                letterSpacing: '0.5px'
              }}>
                {data.institucion_nombre}
              </h1>
              <span style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                UPEA
              </span>
            </div>
          </div>

          {/* MENÚ DESKTOP */}
          <nav className="desktop-nav" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginLeft: 'auto'
          }}>
            <ul style={{ 
              display: 'flex', 
              listStyle: 'none', 
              margin: 0, 
              padding: 0, 
              gap: '0.25rem', 
              alignItems: 'center' 
            }}>
              <li style={{ position: 'relative' }}>
                <a 
                  href="#inicio" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('#inicio'); }}
                  className="nav-link-hover square-font" 
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    letterSpacing: '1.5px'
                  }}
                >
                  INICIO
                </a>
              </li>
              
              {menuItems.map((item) => (
                <li 
                  key={item.id}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button 
                    className="nav-link-hover square-font"
                    style={{
                      color: '#fff',
                      background: 'transparent',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.2s ease',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      letterSpacing: '1.5px'
                    }}
                  >
                    {item.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" style={{
                      transition: 'transform 0.2s ease',
                      transform: activeDropdown === item.id ? 'rotate(180deg)' : 'rotate(0)'
                    }}>
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </button>
                  
                  {/* Dropdown Desktop */}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '240px',
                    background: `rgba(0,0,0,0.95)`,
                    backdropFilter: 'blur(15px)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    padding: '0.5rem 0',
                    marginTop: '0.5rem',
                    opacity: activeDropdown === item.id ? 1 : 0,
                    visibility: activeDropdown === item.id ? 'visible' : 'hidden',
                    transform: activeDropdown === item.id ? 'translateY(0)' : 'translateY(-10px)',
                    transition: 'all 0.2s ease',
                    borderTop: `3px solid ${colors.secondary}`,
                    zIndex: 1001
                  }}>
                    {item.links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                        className="dropdown-item-hover"
                        style={{
                          display: 'block',
                          padding: '0.75rem 1.25rem',
                          color: '#fff',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
              
              {/* BOTÓN LOGIN DESKTOP */}
              <li>
                <a 
                  href={SERVICIO_URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-login-hover square-font"
                  style={{
                    background: colors.secondary,
                    color: '#000',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    marginLeft: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    letterSpacing: '1.5px',
                    border: `2px solid rgba(255,255,255,0.3)`
                  }}
                >
                  🔐 INICIAR SESIÓN
                </a>
              </li>
            </ul>
          </nav>

          {/* ✅ BOTÓN HAMBURGUESA */}
          <button 
            className="mobile-toggle-btn"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              flexDirection: 'column',
              gap: '4px',
              width: '30px',
              zIndex: 1002
            }}
          >
            <span className={`hamburger-line ${mobileMenuOpen ? 'hamburger-active' : ''}`} style={{
              width: '100%',
              height: '3px',
              background: '#fff',
              borderRadius: '2px',
              display: 'block'
            }}></span>
            <span className={`hamburger-line ${mobileMenuOpen ? 'hamburger-active' : ''}`} style={{
              width: '100%',
              height: '3px',
              background: '#fff',
              borderRadius: '2px',
              display: 'block'
            }}></span>
            <span className={`hamburger-line ${mobileMenuOpen ? 'hamburger-active' : ''}`} style={{
              width: '100%',
              height: '3px',
              background: '#fff',
              borderRadius: '2px',
              display: 'block'
            }}></span>
          </button>
        </div>

        {/* ✅ MENÚ MÓVIL COMPLETAMENTE FUNCIONAL */}
        <div 
          className={`mobile-nav-container ${mobileMenuOpen ? 'open' : ''}`}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* INICIO */}
            <li>
              <a 
                href="#inicio" 
                onClick={(e) => { e.preventDefault(); scrollToSection('#inicio'); }}
                className="square-font"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '0.875rem 0',
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  letterSpacing: '1.5px'
                }}
              >
                🏠 INICIO
              </a>
            </li>
            
            {/* ITEMS DEL MENÚ CON SUBMENÚS */}
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => toggleMobileSubMenu(item.id)}
                  className="square-font"
                  style={{
                    color: '#fff',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.875rem 0',
                    width: '100%',
                    textAlign: 'left',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    letterSpacing: '1.5px'
                  }}
                  aria-expanded={openMobileSubMenu === item.id}
                >
                  {item.label}
                  <span className={`submenu-arrow ${openMobileSubMenu === item.id ? 'rotated' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {/* Submenú desplegable */}
                <div className={`mobile-submenu ${openMobileSubMenu === item.id ? 'open' : ''}`}>
                  <ul style={{ listStyle: 'none', padding: '0 0 0 1.5rem', margin: '0.5rem 0 0' }}>
                    {item.links.map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.href}
                          onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                          style={{
                            color: 'rgba(255,255,255,0.95)',
                            textDecoration: 'none',
                            padding: '0.65rem 0',
                            display: 'block',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease',
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.secondary;
                            e.currentTarget.style.paddingLeft = '0.5rem';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.95)';
                            e.currentTarget.style.paddingLeft = '0';
                          }}
                        >
                          • {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            
            {/* BOTÓN LOGIN MÓVIL */}
            <li style={{ paddingTop: '1rem' }}>
              <a 
                href={SERVICIO_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="square-font"
                style={{
                  background: colors.secondary,
                  color: '#000',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  display: 'block',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  letterSpacing: '1.5px'
                }}
              >
              INICIAR SESIÓN
              </a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}