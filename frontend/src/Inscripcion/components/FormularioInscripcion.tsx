// ─────────────────────────────────────────────
// FormularioInscripcion.tsx
//
// Formulario de alta de aspirante.
//
// US-CORE-001: campos personales + académicos
// US-CORE-002: solicitud de beca integrada
// US-CORE-004: base para control documental
// ─────────────────────────────────────────────

import { useState } from "react";
import {AlertCircle,CheckCircle2, FileCheck2,Send} from "lucide-react";
import { useCohortes } from "@/dashboard-coordinador/hooks/useCohortes";
import {  useCrearLegajo, useSubirDocumentoBeca } from "@/dashboard-coordinador/hooks/useCrearLegajo";
import { SeccionBeca, type BecaState} from "./SeccionBeca";
import { Spinner } from "@/shared/components/Spinner";
import { Button } from "@/shared/components/Button";


interface FormState {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono_movil: string;
  ciudad: string;
  provincia: string;
  titulo_grado: string;
  tipo_carrera:
    | "Maestria"
    | "Especializacion"
    | "Doctorado"
    | "";
  cohorte_id: string;
  motivacion: string;
  beca: BecaState;
}

type FormErrors = Partial<
  Record<
    keyof Omit<FormState, "beca"> |
      "tipo_beca" |
      "archivo_beca",
    string
  >
>;

// ─────────────────────────────────────────────
// Estado inicial
// ─────────────────────────────────────────────

const INITIAL: FormState = {
  nombre: "",
  apellido: "",
  dni: "",
  email: "",
  telefono_movil: "",
  ciudad: "",
  provincia: "",
  titulo_grado: "",
  tipo_carrera: "",
  cohorte_id: "",
  motivacion: "",
  beca: {
    solicita_beca: false,
    tipo_beca: null,
    archivo_beca: null,
  },
};

// ─────────────────────────────────────────────
// Validación
// ─────────────────────────────────────────────

function validar(form: FormState): FormErrors {
  const e: FormErrors = {};

  if (!form.nombre.trim()) {
    e.nombre = "El nombre es obligatorio.";
  }

  if (!form.apellido.trim()) {
    e.apellido = "El apellido es obligatorio.";
  }

  if (!/^\d{7,8}$/.test(form.dni)) {
    e.dni = "DNI inválido (7 u 8 dígitos).";
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  ) {
    e.email = "Email inválido.";
  }

  if (!form.titulo_grado.trim()) {
    e.titulo_grado =
      "Ingresá tu título de grado.";
  }

  if (!form.tipo_carrera) {
    e.tipo_carrera =
      "Seleccioná un tipo de carrera.";
  }

  if (!form.cohorte_id) {
    e.cohorte_id =
      "Seleccioná una cohorte.";
  }

  if (!form.motivacion.trim()) {
    e.motivacion =
      "Escribí tu motivación.";
  }

  // ─────────────────────────────────────────
  // US-CORE-002
  // Si solicita beca:
  // tipo + PDF son obligatorios
  // ─────────────────────────────────────────

  if (form.beca.solicita_beca) {
    if (!form.beca.tipo_beca) {
      e.tipo_beca =
        "Seleccioná el porcentaje de beca.";
    }

    if (!form.beca.archivo_beca) {
      e.archivo_beca =
        "El formulario de beca en PDF es obligatorio.";
    }
  }

  return e;
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface FormularioInscripcionProps {
  onExito?: () => void;
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

export function FormularioInscripcion({
  onExito,
}: FormularioInscripcionProps) {
  const [form, setForm] =
    useState<FormState>(INITIAL);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [enviado, setEnviado] =
    useState(false);

  const {
    data: cohortes,
    isLoading: loadingCohortes,
  } = useCohortes();

  const crearLegajo =
    useCrearLegajo();

  const subirBeca =
    useSubirDocumentoBeca();

  const isPending =
    crearLegajo.isPending ||
    subirBeca.isPending;

  // ─────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────

  function setField<
    K extends keyof Omit<FormState, "beca">
  >(
    key: K,
    val: FormState[K]
  ) {
    setForm((f) => ({
      ...f,
      [key]: val,
    }));

    setErrors((e) => ({
      ...e,
      [key]: undefined,
    }));
  }

  // ─────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const errs = validar(form);

    if (Object.keys(errs).length) {
      setErrors(errs);

      // Llevar al usuario hacia el primer error
      window.setTimeout(() => {
        const firstError =
          document.querySelector(
            ".border-semaforo-rojo"
          );

        firstError?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);

      return;
    }

    try {
      // ─────────────────────────────────────
      // 1. Crear legajo
      // ─────────────────────────────────────

      const legajo =
        await crearLegajo.mutateAsync({
          nombre: form.nombre,
          apellido: form.apellido,
          dni: form.dni,
          email: form.email,
          telefono_movil:
            form.telefono_movil,

          domicilio: {
            ciudad: form.ciudad,
            provincia: form.provincia,
          },

          titulo_grado:
            form.titulo_grado,

          tipo_carrera:
            form.tipo_carrera as
              | "Maestria"
              | "Especializacion"
              | "Doctorado",

          cohorte_id:
            form.cohorte_id,

          motivacion:
            form.motivacion,

          solicita_beca:
            form.beca.solicita_beca,

          tipo_beca:
            form.beca.tipo_beca,
        });

      // ─────────────────────────────────────
      // 2. Subir PDF de beca
      // ─────────────────────────────────────

      if (
        form.beca.solicita_beca &&
        form.beca.archivo_beca
      ) {
        await subirBeca.mutateAsync({
          legajoId: legajo.id,
          archivo:
            form.beca.archivo_beca,
        });
      }

      setEnviado(true);

      onExito?.();

    } catch (err) {
      console.error(
        "Error al crear legajo:",
        err
      );
    }
  }

  // ─────────────────────────────────────────
  // Pantalla de éxito
  // ─────────────────────────────────────────

  if (enviado) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-line bg-paper-surface shadow-sm">

          <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-semaforo-verde-soft dark:bg-semaforo-verde-soft-dark">
              <CheckCircle2
                size={32}
                className="text-semaforo-verde"
              />
            </div>

            <p className="mt-5 text-xl font-bold text-ink">
              ¡Inscripción enviada!
            </p>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
              Tu legajo fue creado correctamente
              y quedó registrado en estado{" "}
              <strong className="text-ink">
                Pendiente
              </strong>.
            </p>

            {form.beca.solicita_beca && (
              <div className="mt-5 flex max-w-md items-start gap-3 rounded-xl border border-brand-500/15 bg-brand-500/5 px-4 py-3 text-left">
                <FileCheck2
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-500"
                />

                <p className="text-xs leading-relaxed text-ink-secondary">
                  Tu solicitud de beca también
                  quedó registrada y será evaluada
                  por el coordinador.
                </p>
              </div>
            )}

            <Button
              variant="outline"
              className="mt-7"
              onClick={() => {
                setForm(INITIAL);
                setErrors({});
                setEnviado(false);
              }}
            >
              Nueva inscripción
            </Button>

          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Formulario
  // ─────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-6xl space-y-6"
    >

      {/* ─────────────────────────────────────
          HEADER
      ────────────────────────────────────── */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
    
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">
            Nueva inscripción
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-secondary">
            Completá tus datos personales y
            académicos para iniciar tu inscripción
            en el programa de posgrado.
          </p>
        </div>

        <div className="shrink-0 rounded-full border border-line bg-paper-surface px-3 py-1.5 text-xs text-ink-muted">
          <span className="text-semaforo-rojo">
            *
          </span>{" "}
          Campos obligatorios
        </div>

      </div>

      {/* ─────────────────────────────────────
          ERROR GLOBAL
      ────────────────────────────────────── */}

      {crearLegajo.isError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-semaforo-rojo/20 bg-semaforo-rojo-soft p-4 text-sm text-semaforo-rojo dark:bg-semaforo-rojo-soft-dark"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              No pudimos completar la inscripción
            </p>

            <p className="mt-1 text-xs">
              {(crearLegajo.error as Error).message}
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────
          PASO 1 — DATOS PERSONALES
      ────────────────────────────────────── */}

      <fieldset className="rounded-2xl border border-line bg-paper-surface p-5 shadow-sm sm:p-6">

        <legend className="sr-only">
          Datos personales
        </legend>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">
            Paso 1
          </p>

          <h3 className="mt-1 text-base font-semibold text-ink">
            Datos personales
          </h3>

          <p className="mt-1 text-xs text-ink-muted">
            Información básica para identificar al
            aspirante.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <Field
            label="Nombre"
            required
            error={errors.nombre}
          >
            <input
              type="text"
              value={form.nombre}
              placeholder="Ej: Martín"
              onChange={(e) =>
                setField(
                  "nombre",
                  e.target.value
                )
              }
              className={
                errors.nombre
                  ? "border-semaforo-rojo"
                  : ""
              }
            />
          </Field>

          <Field
            label="Apellido"
            required
            error={errors.apellido}
          >
            <input
              type="text"
              value={form.apellido}
              placeholder="Ej: García"
              onChange={(e) =>
                setField(
                  "apellido",
                  e.target.value
                )
              }
              className={
                errors.apellido
                  ? "border-semaforo-rojo"
                  : ""
              }
            />
          </Field>

        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <Field
            label="DNI"
            required
            error={errors.dni}
          >
            <input
              type="text"
              value={form.dni}
              placeholder="Sin puntos"
              inputMode="numeric"
              maxLength={8}
              onChange={(e) =>
                setField(
                  "dni",
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              className={
                errors.dni
                  ? "border-semaforo-rojo"
                  : ""
              }
            />
          </Field>

          <Field
            label="Email"
            required
            error={errors.email}
          >
            <input
              type="email"
              value={form.email}
              placeholder="tu@email.com"
              onChange={(e) =>
                setField(
                  "email",
                  e.target.value
                )
              }
              className={
                errors.email
                  ? "border-semaforo-rojo"
                  : ""
              }
            />
          </Field>

        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Ciudad">
            <input
              type="text"
              value={form.ciudad}
              placeholder="La Plata"
              onChange={(e) =>
                setField(
                  "ciudad",
                  e.target.value
                )
              }
            />
          </Field>

        <Field label="Provincia">
            <input
              type="text"
              value={form.provincia}
              placeholder="Buenos Aires"
              onChange={(e) =>
                setField(
                  "provincia",
                  e.target.value
                )
              }
            />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <Field label="Teléfono">
            <input
              type="tel"
              value={form.telefono_movil}
              placeholder="+54 9 221..."
              onChange={(e) =>
                setField(
                  "telefono_movil",
                  e.target.value
                )
              }
            />
          </Field>
        </div>

      </fieldset>

      {/* ─────────────────────────────────────
          PASO 2 — FORMACIÓN
      ────────────────────────────────────── */}

      <fieldset className="rounded-2xl border border-line bg-paper-surface p-5 shadow-sm sm:p-6">

        <legend className="sr-only">
          Formación y carrera
        </legend>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">
            Paso 2
          </p>

          <h3 className="mt-1 text-base font-semibold text-ink">
            Formación y carrera
          </h3>

          <p className="mt-1 text-xs text-ink-muted">
            Indicá la carrera y la cohorte a la que
            querés inscribirte.
          </p>
        </div>

        <Field
          label="Título de grado"
          required
          error={errors.titulo_grado}
        >
          <input
            type="text"
            value={form.titulo_grado}
            placeholder="Ej: Ingeniero en Sistemas"
            onChange={(e) =>
              setField(
                "titulo_grado",
                e.target.value
              )
            }
            className={
              errors.titulo_grado
                ? "border-semaforo-rojo"
                : ""
            }
          />
        </Field>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <Field
            label="Tipo de carrera"
            required
            error={errors.tipo_carrera}
          >
            <select
              value={form.tipo_carrera}
              onChange={(e) =>
                setField(
                  "tipo_carrera",
                  e.target.value as FormState["tipo_carrera"]
                )
              }
              className={
                errors.tipo_carrera
                  ? "border-semaforo-rojo"
                  : ""
              }
            >
              <option value="">
                Seleccioná…
              </option>

              <option value="Maestria">
                Maestría
              </option>

              <option value="Especializacion">
                Especialización
              </option>

              <option value="Doctorado">
                Doctorado
              </option>
            </select>
          </Field>

          <Field
            label="Cohorte"
            required
            error={errors.cohorte_id}
          >
            <select
              value={form.cohorte_id}
              onChange={(e) =>
                setField(
                  "cohorte_id",
                  e.target.value
                )
              }
              disabled={loadingCohortes}
              className={
                errors.cohorte_id
                  ? "border-semaforo-rojo"
                  : ""
              }
            >
              <option value="">
                {loadingCohortes
                  ? "Cargando…"
                  : "Seleccioná…"}
              </option>

              {cohortes?.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.nombre}
                </option>
              ))}
            </select>
          </Field>

        </div>

        <div className="mt-4">
          <Field
            label="Motivación"
            required
            error={errors.motivacion}
          >
            <textarea
              value={form.motivacion}
              rows={4}
              placeholder="Contanos por qué querés cursar esta carrera…"
              onChange={(e) =>
                setField(
                  "motivacion",
                  e.target.value
                )
              }
              className={`w-full resize-none ${
                errors.motivacion
                  ? "border-semaforo-rojo"
                  : ""
              }`}
            />
          </Field>
        </div>

      </fieldset>

      {/* ─────────────────────────────────────
          PASO 3 — BECA
      ────────────────────────────────────── */}

      <div>
        <SeccionBeca
          value={form.beca}
          onChange={(beca) => {
            setForm((f) => ({
              ...f,
              beca,
            }));

            setErrors((e) => ({
              ...e,
              tipo_beca: undefined,
              archivo_beca: undefined,
            }));
          }}
          error={{
            tipo_beca:
              errors.tipo_beca,
            archivo_beca:
              errors.archivo_beca,
          }}
        />
      </div>

      {/* ─────────────────────────────────────
          FOOTER / SUBMIT
      ────────────────────────────────────── */}

      <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-2 text-xs text-ink-muted">
          <CheckCircle2
            size={15}
            className="mt-0.5 shrink-0 text-brand-500"
          />

          <p>
            Revisá los datos antes de enviar la
            inscripción.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          icon={
            isPending
              ? undefined
              : Send
          }
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              Enviando…
            </span>
          ) : (
            "Enviar inscripción"
          )}
        </Button>

      </div>

    </form>
  );
}

// ─────────────────────────────────────────────
// Wrapper de campo
// ─────────────────────────────────────────────

function Field({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">

      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}

        {required && (
          <span className="ml-1 text-semaforo-rojo">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <div className="flex items-start gap-1.5 text-xs text-semaforo-rojo">
          <AlertCircle
            size={13}
            className="mt-0.5 shrink-0"
          />

          <p>{error}</p>
        </div>
      )}

    </div>
  );
}