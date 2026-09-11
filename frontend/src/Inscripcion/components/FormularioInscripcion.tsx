// ─────────────────────────────────────────────
//  FormularioInscripcion.tsx
//  Formulario de alta de aspirante.
//  US-CORE-002: sección de beca integrada.
//  US-CORE-001 (base): campos personales + académicos.
// ─────────────────────────────────────────────

import { useState } from "react";
import { useCohortes } from "@/dashboard-coordinador/hooks/useCohortes";
import { useCrearLegajo, useSubirDocumentoBeca } from "@/dashboard-coordinador/hooks/useCrearLegajo";
import { SeccionBeca, type BecaState } from "./SeccionBeca";
import { Spinner } from "@/shared/components/Spinner";
import { Button } from "@/shared/components/Button";
import { Send } from "lucide-react";

// ── Estado del form ───────────────────────────

interface FormState {
  nombre:         string;
  apellido:       string;
  dni:            string;
  email:          string;
  telefono_movil: string;
  ciudad:         string;
  provincia:      string;
  titulo_grado:   string;
  tipo_carrera:   "Maestria" | "Especializacion" | "Doctorado" | "";
  cohorte_id:     string;
  motivacion:     string;
  beca: BecaState;
}

type FormErrors = Partial<Record<
  keyof Omit<FormState, "beca"> | "tipo_beca" | "archivo_beca",
  string
>>;

const INITIAL: FormState = {
  nombre: "", apellido: "", dni: "", email: "",
  telefono_movil: "", ciudad: "", provincia: "",
  titulo_grado: "", tipo_carrera: "", cohorte_id: "",
  motivacion: "",
  beca: { solicita_beca: false, tipo_beca: null, archivo_beca: null },
};

// ── Validación ────────────────────────────────

function validar(form: FormState): FormErrors {
  const e: FormErrors = {};
  if (!form.nombre.trim())        e.nombre        = "El nombre es obligatorio.";
  if (!form.apellido.trim())      e.apellido      = "El apellido es obligatorio.";
  if (!/^\d{7,8}$/.test(form.dni)) e.dni          = "DNI inválido (7 u 8 dígitos).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                  e.email         = "Email inválido.";
  if (!form.titulo_grado.trim())  e.titulo_grado  = "Ingresá tu título de grado.";
  if (!form.tipo_carrera)         e.tipo_carrera  = "Seleccioná un tipo de carrera.";
  if (!form.cohorte_id)           e.cohorte_id    = "Seleccioná una cohorte.";
  if (!form.motivacion.trim())    e.motivacion    = "Escribí tu motivación.";

  // US-CORE-002: si pide beca, tipo y PDF son obligatorios
  if (form.beca.solicita_beca) {
    if (!form.beca.tipo_beca)
      e.tipo_beca    = "Seleccioná el porcentaje de beca.";
    if (!form.beca.archivo_beca)
      e.archivo_beca = "El formulario de beca en PDF es obligatorio.";
  }

  return e;
}

// ── Componente ────────────────────────────────

interface FormularioInscripcionProps {
  onExito?: () => void; // callback para volver a la lista u otro flujo
}

export function FormularioInscripcion({ onExito }: FormularioInscripcionProps) {
  const [form, setForm]     = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [enviado, setEnviado] = useState(false);

  const { data: cohortes, isLoading: loadingCohortes } = useCohortes();
  const crearLegajo   = useCrearLegajo();
  const subirBeca     = useSubirDocumentoBeca();

  const isPending = crearLegajo.isPending || subirBeca.isPending;

  // Helpers de campo
  function setField<K extends keyof Omit<FormState, "beca">>(
    key: K,
    val: FormState[K],
  ) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validar(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      // 1. Crear el legajo
      const legajo = await crearLegajo.mutateAsync({
        nombre:         form.nombre,
        apellido:       form.apellido,
        dni:            form.dni,
        email:          form.email,
        telefono_movil: form.telefono_movil,
        domicilio:      { ciudad: form.ciudad, provincia: form.provincia },
        titulo_grado:   form.titulo_grado,
        tipo_carrera:   form.tipo_carrera as "Maestria" | "Especializacion" | "Doctorado",
        cohorte_id:     form.cohorte_id,
        motivacion:     form.motivacion,
        solicita_beca:  form.beca.solicita_beca,
        tipo_beca:      form.beca.tipo_beca,
      });

      // 2. Si pide beca, subir el PDF
      //    US-CORE-002: el PDF es obligatorio → ya validado arriba
      if (form.beca.solicita_beca && form.beca.archivo_beca) {
        await subirBeca.mutateAsync({
          legajoId: legajo.id,
          archivo:  form.beca.archivo_beca,
        });
      }

      setEnviado(true);
      onExito?.();
    } catch (err) {
      console.error("Error al crear legajo:", err);
    }
  }

  // ── Pantalla de éxito ──────────────────────
  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-paper-surface p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-semaforo-verde-soft text-semaforo-verde text-2xl dark:bg-semaforo-verde-soft-dark">
          ✓
        </div>
        <div>
          <p className="text-lg font-semibold text-ink">¡Inscripción enviada!</p>
          <p className="mt-1 text-sm text-ink-secondary">
            Tu legajo fue creado en estado <strong>Pendiente</strong>.
            {form.beca.solicita_beca && " La solicitud de beca quedó registrada y será evaluada por el coordinador."}
          </p>
        </div>
        <Button variant="outline" onClick={() => { setForm(INITIAL); setEnviado(false); }}>
          Nueva inscripción
        </Button>
      </div>
    );
  }

  // ── Formulario ─────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Nueva inscripción</h2>

      {/* Error global del servidor */}
      {crearLegajo.isError && (
        <div role="alert" className="rounded-xl border border-semaforo-rojo/20 bg-semaforo-rojo-soft p-3 text-sm text-semaforo-rojo dark:bg-semaforo-rojo-soft-dark">
          {(crearLegajo.error as Error).message}
        </div>
      )}

      {/* ── Datos personales ── */}
      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Datos personales
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre" error={errors.nombre}>
            <input
              type="text" value={form.nombre} placeholder="Ej: Martín"
              onChange={e => setField("nombre", e.target.value)}
              className={errors.nombre ? "border-semaforo-rojo" : ""}
            />
          </Field>
          <Field label="Apellido" error={errors.apellido}>
            <input
              type="text" value={form.apellido} placeholder="Ej: García"
              onChange={e => setField("apellido", e.target.value)}
              className={errors.apellido ? "border-semaforo-rojo" : ""}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="DNI" error={errors.dni}>
            <input
              type="text" value={form.dni} placeholder="Sin puntos"
              inputMode="numeric" maxLength={8}
              onChange={e => setField("dni", e.target.value.replace(/\D/g, ""))}
              className={errors.dni ? "border-semaforo-rojo" : ""}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email" value={form.email} placeholder="tu@email.com"
              onChange={e => setField("email", e.target.value)}
              className={errors.email ? "border-semaforo-rojo" : ""}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Teléfono">
            <input
              type="tel" value={form.telefono_movil} placeholder="+54 9 221..."
              onChange={e => setField("telefono_movil", e.target.value)}
            />
          </Field>
          <Field label="Ciudad">
            <input
              type="text" value={form.ciudad} placeholder="La Plata"
              onChange={e => setField("ciudad", e.target.value)}
            />
          </Field>
          <Field label="Provincia">
            <input
              type="text" value={form.provincia} placeholder="Buenos Aires"
              onChange={e => setField("provincia", e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Datos académicos ── */}
      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Formación y carrera
        </legend>

        <Field label="Título de grado" error={errors.titulo_grado}>
          <input
            type="text" value={form.titulo_grado}
            placeholder="Ej: Ingeniero en Sistemas"
            onChange={e => setField("titulo_grado", e.target.value)}
            className={errors.titulo_grado ? "border-semaforo-rojo" : ""}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tipo de carrera" error={errors.tipo_carrera}>
            <select
              value={form.tipo_carrera}
              onChange={e => setField("tipo_carrera", e.target.value as FormState["tipo_carrera"])}
              className={errors.tipo_carrera ? "border-semaforo-rojo" : ""}
            >
              <option value="">Seleccioná…</option>
              <option value="Maestria">Maestría</option>
              <option value="Especializacion">Especialización</option>
              <option value="Doctorado">Doctorado</option>
            </select>
          </Field>

          <Field label="Cohorte" error={errors.cohorte_id}>
            <select
              value={form.cohorte_id}
              onChange={e => setField("cohorte_id", e.target.value)}
              disabled={loadingCohortes}
              className={errors.cohorte_id ? "border-semaforo-rojo" : ""}
            >
              <option value="">
                {loadingCohortes ? "Cargando…" : "Seleccioná…"}
              </option>
              {cohortes?.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Motivación" error={errors.motivacion}>
          <textarea
            value={form.motivacion} rows={3}
            placeholder="Contanos por qué querés cursar esta carrera…"
            onChange={e => setField("motivacion", e.target.value)}
            className={`w-full resize-none ${errors.motivacion ? "border-semaforo-rojo" : ""}`}
          />
        </Field>
      </fieldset>

      {/* ── US-CORE-002: Sección beca ── */}
      <SeccionBeca
        value={form.beca}
        onChange={beca => setForm(f => ({ ...f, beca }))}
        error={{
          tipo_beca:    errors.tipo_beca,
          archivo_beca: errors.archivo_beca,
        }}
      />

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          icon={isPending ? undefined : Send}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" /> Enviando…
            </span>
          ) : (
            "Enviar inscripción"
          )}
        </Button>
      </div>
    </form>
  );
}

// ── Wrapper de campo con label + error ────────

function Field({
  label,
  error,
  children,
}: {
  label:     string;
  error?:    string;
  children:  React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-semaforo-rojo">{error}</p>
      )}
    </div>
  );
}