export type EstadoLegajo =
  | "BORRADOR"
  | "PENDIENTE"
  | "EN_REVISION"
  | "OBSERVADO"
  | "COMPLETADO"
  | "ACTIVO"
  | "VENCIDO"
  | "RECHAZADO"
  | "BAJA"
  | "GRADUADO";

export type TipoCarrera = "Especializacion" | "Maestria" | "Doctorado";

export type Semaforo = "VERDE" | "AMARILLO" | "ROJO";

export type TipoBeca = "30" | "100";

export interface Cohorte {
  id: string;
  anio: number;
  nombre: string;
  abierta: boolean;
  fechaInicio: string | null;
}

export interface Legajo {
  id: string;
  numeroLegajo: string | null; // null hasta que se aprueba
  cohorteId: string;
  dni: string;
  apellido: string;
  nombre: string;
  email: string;
  emailAlternativo?: string;
  telefonoMovil: string;
  domicilio: {
    direccion: string;
    ciudad: string;
    provincia: string;
    pais: string;
  };
  tituloGrado: string;
  motivacion: string;
  estado: EstadoLegajo;
  tipoCarrera: TipoCarrera | null;
  solicitaBeca: boolean;
  tipoBeca?: TipoBeca;
  semaforo: Semaforo;
  semaforoManual: boolean;
  fechaInscripcion: string | null;
  fechaActivacion: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TipoDocumento =
  | "DNI"
  | "TITULO_GRADO"
  | "PARTIDA"
  | "CUIT_CUIL"
  | "FORM_INSCRIPCION"
  | "FORM_BECA"
  | "TITULO_POSGRADO";

export interface Documento {
  id: string;
  legajoId: string;
  tipo: TipoDocumento;
  nombreOriginal: string;
  tamanioBytes: number;
  fechaSubida: string;
}

// Requests

export interface CrearLegajoRequest {
  carreras: TipoCarrera[]; // max 2
  apellido: string;
  nombre: string;
  nacionalidad: string;
  dni: string;
  telefonoMovil: string;
  telefonoFijo?: string;
  email: string;
  emailAlternativo: string;
  domicilio: Legajo["domicilio"];
  tituloGrado: string;
  tituloPosgrado?: string;
  comoConocioLaOferta: string;
  motivacion: string; // min 50 caracteres
  solicitaBeca: boolean;
  tipoBeca?: TipoBeca;
}

export interface FiltrosLegajo {
  estado?: EstadoLegajo;
  cohorteId?: string;
  tipoCarrera?: TipoCarrera;
  soloConBeca?: boolean;
  page?: number;
  limit?: number;
}
