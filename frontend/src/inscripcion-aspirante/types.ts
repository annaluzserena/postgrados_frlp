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
