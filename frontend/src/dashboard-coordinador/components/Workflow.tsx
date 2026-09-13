// ─────────────────────────────────────────────
//  Workflow.tsx  (actualizado)
//  US-CORE-004: el botón "Siguiente estado"
//  queda deshabilitado si faltan documentos
//  obligatorios cuando el legajo está en
//  PENDIENTE (intentando pasar a EN_REVISION).
// ─────────────────────────────────────────────

import type { Documento, Legajo } from "@/shared/types/types";
import { Button } from "@/shared/components/Button";
import { Check, ArrowLeft, Lock } from "lucide-react";
import { useFaltanDocs } from "./SeccionDocumentos";

interface WorkflowProps {
  legajo:     Legajo;
  documentos: Documento[];   // ← nuevo prop
}

type StepStatus = "done" | "active" | "pending";

const STEP_CLASSES: Record<StepStatus, string> = {
  done:    "bg-semaforo-verde text-white",
  active:  "bg-brand-500 text-white ring-4 ring-brand-500/20",
  pending: "bg-paper-elevated text-ink-muted ring-1 ring-inset ring-line",
};

export const Workflow = ({ legajo, documentos }: WorkflowProps) => {
  // US-CORE-004: ¿faltan docs obligatorios?
  const faltanDocs = useFaltanDocs(documentos, legajo.solicita_beca);

  // Solo bloqueamos cuando el legajo está en PENDIENTE
  // (quiere pasar a EN_REVISION = "Enviar a revisión")
  const bloqueado = legajo.estado === "PENDIENTE" && faltanDocs;

  const steps: { label: string; status: StepStatus }[] = [
    {
      label: "Solicitud inicial",
      status: legajo.estado === "BORRADOR" ? "active" : "done",
    },
    {
      label: "Pendiente de revisión",
      status:
        legajo.estado === "PENDIENTE" || legajo.estado === "OBSERVADO"
          ? "active"
          : legajo.estado === "BORRADOR"
          ? "pending"
          : "done",
    },
    {
      label: "Revisión académica",
      status:
        legajo.estado === "EN_REVISION"
          ? "active"
          : legajo.estado === "BORRADOR" ||
            legajo.estado === "PENDIENTE" ||
            legajo.estado === "OBSERVADO"
          ? "pending"
          : "done",
    },
    {
      label: "Matriculación",
      status:
        legajo.estado === "COMPLETADO"
          ? "active"
          : legajo.estado === "BORRADOR" ||
            legajo.estado === "PENDIENTE" ||
            legajo.estado === "OBSERVADO" ||
            legajo.estado === "EN_REVISION"
          ? "pending"
          : "done",
    },
  ];

  const doneCount      = steps.filter(s => s.status === "done").length;
  const progressPercent = (doneCount / (steps.length - 1)) * 100;

  return (
    <div className="space-y-5">

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-xs text-ink-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-semaforo-verde" /> Completado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-500" /> En curso
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line" /> Pendiente
        </span>
      </div>

      {/* Info del legajo */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-xs text-brand-700 dark:border-brand-800/60 dark:bg-brand-900/30 dark:text-brand-200">
        📋 Workflow de{" "}
        <strong>{legajo.nombre} {legajo.apellido}</strong>{" "}
        — {legajo.numero_legajo ? `#${legajo.numero_legajo}` : "Sin N° asignado"}{" "}
        · {legajo.tipo_carrera || "Carrera no definida"}
      </div>

      {/* Pasos */}
      <div className="relative pt-2">
        <div className="absolute left-0 right-0 top-6 h-0.5 bg-line" />
        <div
          className="absolute left-0 top-6 h-0.5 bg-brand-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.label} className="flex flex-col items-center gap-2 text-center">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${STEP_CLASSES[step.status]}`}>
                {step.status === "done" ? (
                  <Check size={16} />
                ) : (
                  steps.indexOf(step) + 1
                )}
              </div>
              <span className="max-w-20 text-xs font-medium text-ink-secondary">
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-muted">
        Estado actual: <strong className="text-ink">{legajo.estado}</strong>
      </p>

      {/* ── US-CORE-004: aviso si está bloqueado ── */}
      {bloqueado && (
        <div className="flex items-start gap-2.5 rounded-xl border border-semaforo-rojo/20 bg-semaforo-rojo-soft px-4 py-3 dark:bg-semaforo-rojo-soft-dark">
          <Lock size={15} className="mt-0.5 shrink-0 text-semaforo-rojo" />
          <p className="text-xs text-semaforo-rojo">
            No podés enviar a revisión hasta completar toda la documentación obligatoria.
            Cargá los documentos faltantes y volvé a intentarlo.
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          disabled={bloqueado}
          onClick={() => console.log("Avanzar")}
          // TODO: PATCH /api/legajos/:id/estado { estado: siguiente }
        >
          {bloqueado ? (
            <span className="flex items-center gap-2">
              <Lock size={14} /> Documentación incompleta
            </span>
          ) : (
            "Siguiente estado"
          )}
        </Button>

        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={() => console.log("Devolver")}
          // TODO: PATCH /api/legajos/:id/estado { estado: anterior }
        >
          Devolver
        </Button>
      </div>
    </div>
  );
};