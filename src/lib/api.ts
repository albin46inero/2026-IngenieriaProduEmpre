import { useState, useEffect } from 'react';

// ==================== TIPOS/INTERFACES ====================
export interface ColorInstitucion {
  id_color: number;
  color_primario: string;
  color_secundario: string;
  color_terciario: string;
}

export interface InstitucionPrincipal {
  institucion_id: number;
  institucion_nombre: string;
  institucion_iniciales: string;
  institucion_nombre_iniciales: string;
  institucion_logo: string;
  institucion_historia: string;
  institucion_mision: string;
  institucion_vision: string;
  institucion_facebook: string;
  institucion_youtube: string;
  institucion_twitter: string;
  institucion_direccion: string;
  institucion_celular1: number;
  institucion_celular2: number;
  institucion_telefono1: number;
  institucion_telefono2: number;
  institucion_correo1: string;
  institucion_correo2: string;
  institucion_api_google_map: string;
  institucion_objetivos: string;
  institucion_sobre_ins: string;
  institucion_link_video_vision: string;
  colorinstitucion: ColorInstitucion[];
}

export interface Publicacion {
  publicaciones_id: number;
  publicaciones_titulo: string;
  publicaciones_imagen: string;
  publicaciones_descripcion: string;
  publicaciones_documento: string;
  publicaciones_fecha: string;
  publicaciones_autor: string;
  publicaciones_tipo: string;
}

export interface LinkExterno {
  descripcion: string;
  id_link: number;
  imagen: string;
  nombre: string;
  url_link: string;
  estado: number;
  tipo: string;
}

export interface RecursosResponse {
  upea_publicaciones: Publicacion[];
  linksExternoInterno: LinkExterno[];
  links: any[];
  convocatorias?: any[];
  upea_gaceta_universitaria?: any[];
  upea_evento?: any[];
  cursos?: any[];
  serviciosCarrera?: any[];
  ofertasAcademicas?: any[];
}

export interface Autoridad {
  id_autoridad: number;
  foto_autoridad: string;
  nombre_autoridad: string;
  cargo_autoridad: string;
  facebook_autoridad: string;
  celular_autoridad: string;
  twiter_autoridad: string;
}

export interface Portada {
  portada_id: number;
  portada_imagen: string;
  portada_titulo: string;
  portada_subtitulo: string;
}

export interface Ubicacion {
  id_ubicacion: number;
  ubicacion_imagen: string;
  ubicacion_titulo: string;
  ubicacion_descripcion: string;
  ubicacion_latitud: string;
  ubicacion_longitud: string;
  ubicacion_estado: string;
}

export interface Video {
  video_id: number;
  video_enlace: string;
  video_titulo: string;
  video_breve_descripcion: string;
  video_estado: number;
  video_tipo: string;
}

export interface ContenidoResponse {
  autoridad: Autoridad[];
  portada: Portada[];
  ubicacion: Ubicacion[];
  upea_videos: Video[];
}

export interface GacetaEventosResponse {
  convocatorias?: any[];
  upea_gaceta_universitaria?: any[];
  upea_evento?: any[];
  cursos?: any[];
  serviciosCarrera?: any[];
  ofertasAcademicas?: any[];
}

export interface CarreraData {
  institucion: InstitucionPrincipal | null;
  recursos: RecursosResponse | null;
  contenido: ContenidoResponse | null;
  loading: boolean;
  error: string | null;
}

// ==================== CONFIGURACIÓN API ====================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const INSTITUCION_ID = import.meta.env.VITE_INSTITUCION_ID;

export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

// ✅ DOMINIOS PERMITIDOS (seguridad)
const ALLOWED_DOMAINS = [
  'servicioadministrador.upea.bo',
  'apiadministrador.upea.bo',
  'archivosminio.upea.bo',
  'localhost',
  '127.0.0.1'
];

// ✅ TIMEOUT CONFIGURABLE (15 segundos)
const REQUEST_TIMEOUT = 15000;

// ✅ VALIDACIÓN DE URL SEGURA
function isValidApiUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    return ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

// ✅ HEADERS
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`,
});

// ✅ MANEJO DE RESPUESTA MEJORADO
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Intentar obtener mensaje de error del servidor
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
    
    // Log interno (no visible al usuario)
    console.error(`❌ API Error ${response.status}:`, response.url);
    
    // Mensajes genéricos para el usuario
    if (response.status === 401) throw new Error('Autenticación requerida');
    if (response.status === 403) throw new Error('Acceso denegado');
    if (response.status === 404) throw new Error('Recurso no encontrado');
    if (response.status >= 500) throw new Error('Error del servidor');
    
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json();
  } catch (parseError) {
    console.error('❌ Error parseando JSON:', parseError);
    throw new Error('Respuesta inválida del servidor');
  }
};

// ✅ FETCH CON TIMEOUT Y VALIDACIÓN
const safeFetch = async <T>(endpoint: string): Promise<T> => {
  // Validar URL
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  if (!isValidApiUrl(fullUrl)) {
    console.error('❌ URL no permitida:', fullUrl);
    throw new Error('URL de API no válida');
  }

  // Crear AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(fullUrl, {
      headers: getHeaders(),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return await handleResponse<T>(response);
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Request timeout:', fullUrl);
      throw new Error('Tiempo de espera agotado. Verifique su conexión.');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('❌ Error de red:', error);
      throw new Error('Error de conexión. Verifique su conexión a internet.');
    }
    
    throw error;
  }
};

// ==================== FUNCIONES API ====================

export const getInstitucionPrincipal = async (): Promise<InstitucionPrincipal> => {
  return safeFetch<{ Descripcion: InstitucionPrincipal }>(
    `/institucionesPrincipal/${INSTITUCION_ID}`
  ).then(data => data.Descripcion);
};

export const getRecursos = async (): Promise<RecursosResponse> => {
  try {
    const recursosPromise = safeFetch<RecursosResponse>(
      `/institucion/${INSTITUCION_ID}/recursos`
    );
    
    const gacetaEventosPromise = safeFetch<GacetaEventosResponse>(
      `/institucion/${INSTITUCION_ID}/gacetaEventos`
    ).catch((error) => {
      console.warn('⚠️ gacetaEventos no disponible:', error);
      return {} as GacetaEventosResponse;
    });

    const [recursos, gacetaEventos] = await Promise.all([
      recursosPromise,
      gacetaEventosPromise
    ]);

    return {
      ...recursos,
      convocatorias: (gacetaEventos as any)?.convocatorias || [],
      upea_gaceta_universitaria: (gacetaEventos as any)?.upea_gaceta_universitaria || [],
      upea_evento: (gacetaEventos as any)?.upea_evento || [],
      cursos: (gacetaEventos as any)?.cursos || [],
      serviciosCarrera: (gacetaEventos as any)?.serviciosCarrera || [],
      ofertasAcademicas: (gacetaEventos as any)?.ofertasAcademicas || []
    };
    
  } catch (error) {
    console.error('❌ Error fetching recursos:', error);
    return {
      upea_publicaciones: [],
      linksExternoInterno: [],
      links: [],
      convocatorias: [],
      upea_gaceta_universitaria: [],
      upea_evento: [],
      cursos: [],
      serviciosCarrera: [],
      ofertasAcademicas: []
    };
  }
};

export const getContenido = async (): Promise<ContenidoResponse> => {
  return safeFetch<ContenidoResponse>(`/institucion/${INSTITUCION_ID}/contenido`);
};

// ==================== HOOK PERSONALIZADO ====================

export const useCarreraData = () => {
  const [data, setData] = useState<CarreraData>({
    institucion: null,
    recursos: null,
    contenido: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Validar variables de entorno
    if (!API_BASE_URL || !API_TOKEN || !INSTITUCION_ID) {
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Configuración de API incompleta. Contacte al administrador." 
      }));
      return;
    }

    // AbortController para cancelar requests si el componente se desmonta
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const [institucion, recursos, contenido] = await Promise.all([
          getInstitucionPrincipal(),
          getRecursos(),
          getContenido(),
        ]);

        if (!abortController.signal.aborted) {
          setData({
            institucion,
            recursos,
            contenido,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
          }));
        }
      }
    };

    fetchData();

    // Cleanup: cancelar requests si el componente se desmonta
    return () => {
      abortController.abort();
    };
  }, []);

  return data;
};