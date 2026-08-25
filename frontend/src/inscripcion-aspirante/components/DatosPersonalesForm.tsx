import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/shared/components/Button";
import type { DatosPersonales } from "../types";

interface DatosPersonalesFormProps {
  initialData: DatosPersonales;
  isSubmitting?: boolean;
  onNext: (data: DatosPersonales) => void;
}

type Errors = Partial<Record<keyof DatosPersonales, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS: Array<{
  field: keyof DatosPersonales;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}> = [
  { field: "apellido", label: "Apellido", placeholder: "Pérez", required: true },
  { field: "nombre", label: "Nombre", placeholder: "María Laura", required: true },
  { field: "nacionalidad", label: "Nacionalidad", placeholder: "Argentina", required: true },
  { field: "documento", label: "DNI o Pasaporte", placeholder: "38.451.982", required: true },
  {
    field: "telefonoMovil",
    label: "Teléfono móvil",
    placeholder: "+54 9 221 555-1234",
    type: "tel",
    required: true,
  },
  { field: "telefonoFijo", label: "Teléfono fijo", placeholder: "0221 452-6789", type: "tel" },
  {
    field: "email",
    label: "Correo electrónico",
    placeholder: "mlperez@gmail.com",
    type: "email",
    required: true,
  },
  {
    field: "emailAlternativo",
    label: "Correo electrónico alternativo",
    placeholder: "maria.perez@trabajo.com",
    type: "email",
  },
];

export function DatosPersonalesForm({
  initialData,
  isSubmitting,
  onNext,
}: DatosPersonalesFormProps) {
  const [data, setData] = useState<DatosPersonales>(initialData);
  const [errors, setErrors] = useState<Errors>({});

  const handleChange =
    (field: keyof DatosPersonales) => (e: ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!data.apellido.trim()) next.apellido = "Ingresá el apellido.";
    if (!data.nombre.trim()) next.nombre = "Ingresá el nombre.";
    if (!data.nacionalidad.trim()) next.nacionalidad = "Ingresá la nacionalidad.";
    if (!data.documento.trim()) next.documento = "Ingresá el DNI o pasaporte.";
    if (!data.telefonoMovil.trim())
      next.telefonoMovil = "Ingresá un teléfono de contacto.";
    if (!data.email.trim()) next.email = "Ingresá un correo electrónico.";
    else if (!EMAIL_RE.test(data.email))
      next.email = "El correo no tiene un formato válido.";
    if (data.emailAlternativo && !EMAIL_RE.test(data.emailAlternativo)) {
      next.emailAlternativo = "El correo alternativo no tiene un formato válido.";
    }
    return next;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onNext(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 px-5 pb-8">
      {FIELDS.map(({ field, label, placeholder, type = "text", required }) => (
        <div key={field} className="flex flex-col gap-1.5">
          <label htmlFor={field}>
            {label}
            {required && <span className="ml-0.5 text-semaforo-rojo">*</span>}
          </label>
          <input
            id={field}
            name={field}
            type={type}
            value={data[field]}
            onChange={handleChange(field)}
            placeholder={placeholder}
            aria-invalid={Boolean(errors[field])}
            aria-describedby={errors[field] ? `${field}-error` : undefined}
            className={errors[field] ? "border-semaforo-rojo focus:ring-semaforo-rojo" : ""}
          />
          {errors[field] && (
            <p id={`${field}-error`} className="text-xs font-medium text-semaforo-rojo">
              {errors[field]}
            </p>
          )}
        </div>
      ))}

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="mt-2 w-full">
        Continuar
      </Button>
    </form>
  );
}
