export interface DatosPersonales {
  apellido: string;
  nombre: string;
  nacionalidad: string;
  documento: string;
  telefonoMovil: string;
  telefonoFijo: string;
  email: string;
  emailAlternativo: string;
}

export const DATOS_PERSONALES_INICIAL: DatosPersonales = {
  apellido: "",
  nombre: "",
  nacionalidad: "",
  documento: "",
  telefonoMovil: "",
  telefonoFijo: "",
  email: "",
  emailAlternativo: "",
};

export interface DatosAcademicos {
  carreraElegida: string;
  tituloGradoObtenido: string;
  canalDifusion: string;
  motivaciones: string;
}

export const DATOS_ACADEMICOS_INICIAL: DatosAcademicos = {
  carreraElegida: "",
  tituloGradoObtenido: "",
  canalDifusion: "",
  motivaciones: "",
};

//Datos academicos que solicitan para inscripcion de posgrado
export const CARRERAS_POSGRADO = [
  { value: "maestria-datos", label: "Maestría en Ciencia de Datos" },
  { value: "especializacion-ia", label: "Especialización en Inteligencia Artificial" },
  { value: "diplomatura-fullstack", label: "Diplomatura en Desarrollo Full Stack" },
];

export const CANALES_DIFUSION = [
  { value: "redes-sociales", label: "Redes sociales" },
  { value: "sitio-web", label: "Sitio web institucional" },
  { value: "recomendacion", label: "Recomendación de un conocido" },
  { value: "evento", label: "Evento o charla informativa" },
  { value: "otro", label: "Otro" },
];

export interface DocumentoRequerido {
  id: string;
  label: string;
  opcional?: boolean;
}

export const DOCUMENTOS_REQUERIDOS: DocumentoRequerido[] = [
  { id: "formulario-preinscripcion", label: "Formulario de preinscripción (con firma analógica)" },
  { id: "partida-nacimiento", label: "Copia de la partida de nacimiento" },
  { id: "cuit-cuil", label: "Constancia de CUIT-CUIL" },
  { id: "titulo-grado", label: "Copia del título de grado" },
  { id: "titulo-posgrado", label: "Copia del título de posgrado", opcional: true },
  { id: "dni", label: "Copia del DNI" },
];

// Mapa id -> archivo cargado (o null si no hay nada aún)
export type DatosDocumentos = Record<string, File | null>;

export const DATOS_DOCUMENTOS_INICIAL: DatosDocumentos = DOCUMENTOS_REQUERIDOS.reduce(
  (acc, doc) => ({ ...acc, [doc.id]: null }),
  {} as DatosDocumentos
);