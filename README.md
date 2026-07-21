# Ingeniería en Producción Empresarial – UPEA

Plataforma web institucional desarrollada para la **Carrera de Ingeniería en Producción Empresarial** de la Universidad Pública de El Alto (UPEA). Sitio moderno, responsive y auditado bajo estándares de seguridad, diseñado para difundir información académica, historia institucional, publicaciones, eventos, videos, autoridades, cursos, seminarios, convocatorias, avisos, comunicados, ofertas académicas, perfil profesional y contacto institucional.

Desarrollado con **React + TypeScript + Vite**, con consumo de API REST institucional y almacenamiento de assets en MinIO.

---

## ️ Tecnologías Utilizadas

 Categoría  Herramientas 
 **Build Tool**  Vite 
 **Framework**  React 18/19 
 **Lenguaje**  TypeScript 
 **Enrutamiento**  React Router DOM 
 **Estilos**  CSS + CSS Variables dinámicas 
 **Animaciones**  CSS Animations / Letter Animations 
 **Control**  Git & GitHub 
 **Almacenamiento**  MinIO (`archivosminio.upea.bo`) 
 **Backend/API**  REST API institucional (`apiadministrador.upea.bo`) 
 **Seguridad**  Validación de URLs, `rel="noopener noreferrer"`, Sanitización XSS 

---

##  Características Principales

###  Diseño Dinámico
- **Colores institucionales** consumidos en tiempo real desde la API (`colorinstitucion`)
- Variables CSS dinámicas (`--color-primario`, `--color-secundario`, `--color-terciario`)
- Tema adaptable y escalable

###  100% Responsive
- Adaptado para móviles, tablets y escritorio
- Menú hamburguesa animado para dispositivos móviles
- Grid layouts con CSS moderno

###  Seguridad Implementada
- **Validación estricta de URLs** con whitelist de dominios
- **Sanitización de contenido HTML** contra XSS
- **Enlaces externos seguros** con `rel="noopener noreferrer"`
- **Manejo de errores sin exposición** de información sensible

###  Multimedia Integrada
- **Slider de portadas** con auto-rotación
- **Reproductores de video** YouTube embebidos
- **Mapas interactivos** de Google Maps con coordenadas GPS
- **Imágenes optimizadas** con lazy loading y formatos WebP

###  Navegación Avanzada
- **Routing SPA** con React Router DOM (navegación sin recargar la página)
- **Rutas especializadas**: autoridades, avisos, comunicados, cursos, eventos, gaceta, historia, misión, ofertas académicas, perfil profesional, publicaciones, seminarios, servicios, videos
- **Scroll suave** a secciones con anclas
- **Header y Footer** institucionales

###  Rendimiento Optimizado
- **Code-splitting** automático de Vite
- **Lazy loading** de componentes y rutas
- **Carga prioritaria** en imágenes del hero (LCP)
- **Optimización de imágenes** con formatos AVIF y WebP
- **Build optimizado** en carpeta `dist/`

---

##  Lo que hace 

- Renderiza una interfaz SPA (Single Page Application) con **React + TypeScript + Vite**
- Consume **4 endpoints REST** de la API administrativa UPEA
- Aplica **temas dinámicos** con colores desde `colorinstitucion` API
- Implementa **routing por páginas** (`/autoridades`, `/avisos`, `/comunicados`, `/cursos`, `/eventos`, `/gaceta`, `/historia`, `/mision`, `/ofertas-academicas`, `/perfil-profesional`, `/publicaciones`, `/seminarios`, `/servicios`, `/videos`)
- Visualiza **PDFs** mediante enlaces con `target="_blank"` y `rel="noopener noreferrer"`
- Integra **iframes de YouTube** y **Google Maps**
- Procesa y muestra **imágenes desde MinIO** (`archivosminio.upea.bo`)
- Gestiona estados con **React Hooks** (`useState`, `useEffect`, `useRef`)
- Aplica **animaciones con CSS** (letter-animate, animaciones personalizadas)
- Genera **build optimizado** con `npm run build`

---

##  Estructura del Proyecto

```text
public/                 # Assets estático
src/
app/                # Aplicación principal
components/     # Componentes reutilizables
Footer.tsx      # Footer institucional
Header.tsx      # Header con navegación
lib/            # Librerías y servicios
api.ts          # Servicio de consumo de API
pages/          # Páginas principales
AutoridadesPage.tsx
AvisosPage.tsx
ComunicadosPage.tsx
CursosPage.tsx
EventosPage.tsx
GacetaPage.tsx
HistoriaPage.tsx
MisionPage.tsx
OfertasAcademicasPage.tsx
PerfilProfesionalPage.tsx
PublicacionesPage.tsx
SeminariosPage.tsx
ServiciosPage.tsx
VideosPage.tsx
globals.css     # Estilos globales
layout.tsx      # Layout principal
page.tsx        # Página principal (Home)
pages/              # Páginas adicionales (si aplica)
AvisosPage.tsx
ComunicadosPage.tsx
CursosPage.tsx
EventosPage.tsx
GacetaPage.tsx
HistoriaPage.tsx
MisionPage.tsx
OfertasAcademicasPage.tsx
PerfilProfesionalPage.tsx
PublicacionesPage.tsx
SeminariosPage.tsx
ServiciosPage.tsx
VideosPage.tsx
App.css             # Estilos de App
index.css           # Estilos globales
main.tsx            # Punto de entrada de Vite
.env                    # Variables de entorno
.env.copy               # Template de variables de entorno
.gitignore
index.html              # HTML principal
package.json
tsconfig.json           # Configuración de TypeScript
tsconfig.node.json      # Configuración de TypeScript para Node
vite.config.ts          # Configuración de Vite
README.md

```
## Variables de Entorno
``` 
```
# API UPEA - ingenieria de produccion y empresarial
VITE_API_BASE_URL
VITE_API_TOKEN
VITE_INSTITUCION_ID
VITE_UPLOADS_URL
VITE_SERVICIO_URL

## Endpoints Principales

GET /institucionesPrincipal/{28}
GET /institucion/{28}/recursos
GET /institucion/{28}/contenido
GET /institucion/{28}/gacetaEventos

## Probar Endpoints

# 1. Institución Principal
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucionesPrincipal/{XX}" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"

# 2. Recursos Institucionales
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{XX}/recursos" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"

# 3. Contenido Dinámico
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{XX}/contenido" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"

# 4. Gacetas y Eventos
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{XX}/gacetaEventos" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"

## Instalacion y Ejecucion

# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/2026-IngenieriaProduccionEmpresarial.git
cd 2026-IngenieriaProduccionEmpresarial

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
# Copiar las variables de entorno descritas arriba
#  Reemplazar VITE_ID_INSTITUCION y VITE_ID_CARRERA con los IDs reales

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:5173 (o el puerto que indique Vite)

# Build optimizado para producción
npm run build

##  Notas Operativas

### Solución de Problemas Comunes

- **"Error al cargar datos"**: Verificar conexión a internet y que la API de la UPEA esté respondiendo
- **Imágenes no se visualizan**: Verificar que la URL comience con `https://archivosminio.upea.bo` y que la variable `VITE_MINIO_BASE_URL` esté bien configurada
- **Los datos no corresponden a la carrera esperada**: Verificar que las variables `VITE_ID_INSTITUCION` y `VITE_ID_CARRERA` en `.env` estén correctas
- **Ruta no encontrada**: Revisar que la ruta esté correctamente definida en el router de React
- **Puerto 5173 ocupado**: Vite asignará automáticamente otro puerto, o puedes usar `npm run dev -- --port 3000`
- **Variables de entorno no cargan**: Reiniciar el servidor de desarrollo (`Ctrl + C` y luego `npm run dev`) después de crear o modificar el archivo `.env`
- **El HTML se muestra como texto plano**: Asegúrate de usar `dangerouslySetInnerHTML` en React para renderizar contenido HTML crudo de la API
- **Errores de TypeScript**: Verificar que los tipos estén correctamente definidos en `src/lib/api.ts`
- **Animaciones no funcionan**: Verificar que las clases CSS (letter-animate, etc.) estén definidas en `globals.css` o `App.css`

### Buenas Prácticas

- **Nunca subas el archivo `.env` a GitHub**. Ya está incluido en `.gitignore`.
- Usa `dangerouslySetInnerHTML` con precaución y sanitiza el contenido HTML que viene de la API para prevenir XSS
- Para cambios de colores institucionales, modifica directamente en el panel administrativo de la API; el frontend lo reflejará automáticamente al recargar
- Mantén las dependencias actualizadas ejecutando `npm audit` periódicamente
- Usa TypeScript para mantener la consistencia del código y evitar errores en tiempo de compilación
- Centraliza el consumo de API en `src/lib/api.ts`
- Usa componentes reutilizables en `src/app/components/` (Header, Footer) para mantener el código DRY
- Implementa manejo de errores adecuado en todas las peticiones HTTP
- Genera builds optimizados con `npm run build` antes de desplegar a producción
- Usa las animaciones CSS personalizadas (letter-animate) para mejorar la experiencia de usuario

---

## Recomendación Final

Se recomienda mantener este repositorio con las siguientes responsabilidades:

- Frontend **React + TypeScript + Vite** exclusivo para visualización de datos institucionales
- **Nada de lógica de negocio compleja** en el cliente (validaciones simples sí, reglas de negocio no)
- **Nada de almacenamiento local sensible** (evitar `localStorage` para datos de usuarios, usarlo solo para preferencias de UI)
- Todo el consumo de datos debe ser vía **API REST** a través de servicios centralizados en `src/lib/api.ts`
- **Builds optimizados** en la carpeta `dist/` para despliegue en producción
- Seguridad implementada en frontend (validación de URLs, sanitización de HTML, enlaces seguros)
- Mantener la estructura de carpetas modular y escalable
- Usar componentes reutilizables en `src/app/components/`
- Implementar rutas dinámicas para detalles de cursos, eventos, publicaciones, etc.
- Auditorías visuales periódicas para garantizar que los enlaces a redes sociales y documentos externos abran en pestañas nuevas de forma segura (`rel="noopener noreferrer"`)
- Mantener actualizados los assets en `public/` (imágenes institucionales, logos)
- **Verificar los IDs de institución y carrera** correctos antes de hacer deploy a producción
- Usar **TypeScript** para mantener la tipificación fuerte y evitar errores en tiempo de ejecución
- Implementar **lazy loading** en componentes pesados para mejorar el rendimiento inicial
- Optimizar imágenes en `public/` para reducir el tamaño del build final
- Mantener las animaciones CSS organizadas en `globals.css` o `App.css`