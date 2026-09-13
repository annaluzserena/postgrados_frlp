import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLegajo } from "../hooks/useLegajos";
import { useDocumentos } from "../hooks/useDocumentos";
import { Spinner } from "@/shared/components/Spinner";
import { Button } from "@/shared/components/Button";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { Workflow } from "./Workflow";
import { ObservarDocumentoModal } from "./ObservarDocumentoModal";
import {
  type TipoDocumento,
  ETIQUETA_TIPO,
  type DocumentoConEstado,
} from "@/shared/types/types";

export default function DetalleLegajo() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  if (!id) navigate("/inscriptos", { relative: "route" });
  const {
    data: legajo,
    isLoading: isLoadingLegajo,
    isError: isErrorLegajo,
    error: errorLegajo,
  } = useLegajo(id || " ");
  const {
    data: documentos,
    isLoading: isLoadingDocumentos,
    isError: isErrorDocumentos,
    error: errorDocumentos,
  } = useDocumentos(id || " ");
  const iniciales =
    `${legajo?.nombre[0] || ""}${legajo?.apellido[0] || ""}`.toUpperCase();
  const [docSeleccionado, setDocSeleccionado] =
    useState<DocumentoConEstado | null>(null);

  if (isLoadingLegajo || isLoadingDocumentos) {
    return (
      <div className="flex items-center gap-2 p-6 text-ink-secondary">
        <Spinner size="sm" /> Cargando…
      </div>
    );
  }

  if (isErrorLegajo || isErrorDocumentos) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-semaforo-rojo/20 bg-semaforo-rojo-soft p-4 text-sm text-semaforo-rojo dark:bg-semaforo-rojo-soft-dark"
      >
        {isErrorLegajo &&
          `No se pudo cargar el legajo: ${(errorLegajo as Error).message}`}
        <br />
        {isErrorDocumentos &&
          `No se pudieron cargar los documentos: ${(errorDocumentos as Error).message}`}
      </div>
    );
  }

  return (
    <>
      <Link to="/inscriptos">
        <Button variant="ghost" icon={ArrowLeft}>
          Volver
        </Button>
      </Link>
      <div className="flex flex-col gap-6">
        {/* Cabecera */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center border-b border-line pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 font-bold text-lg dark:bg-brand-950 dark:text-brand-300">
            {iniciales}
          </div>
          <div>
            <div className="text-lg font-bold text-ink">
              {legajo?.apellido}, {legajo?.nombre}
            </div>
            <div className="text-sm font-medium text-ink-secondary">
              {legajo?.numero_legajo
                ? `Legajo #${legajo?.numero_legajo}`
                : `Estado: ${legajo?.estado.replaceAll("_", " ")}`}
            </div>
          </div>
          <div className="sm:ml-auto">
            <Button icon={Download} variant="outline">
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Datos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Título de Grado
            </div>
            <div className="text-sm font-medium text-ink mt-1">
              {legajo?.titulo_grado}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Tipo de Carrera
            </div>
            <div className="text-sm font-medium text-ink mt-1">
              {legajo?.tipo_carrera || "No especificado"}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              DNI
            </div>
            <div className="text-sm font-medium text-ink mt-1 font-mono">
              {legajo?.dni}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Ciudad / Provincia
            </div>
            <div className="text-sm font-medium text-ink mt-1">
              {legajo?.domicilio.ciudad}, {legajo?.domicilio.provincia}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Email
            </div>
            <div className="text-xs font-medium text-ink mt-1 truncate">
              {legajo?.email}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Teléfono
            </div>
            <div className="text-sm font-medium text-ink mt-1 font-mono">
              {legajo?.telefono_movil}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Estado
            </div>
            <div className="text-sm font-medium text-ink mt-1">
              {legajo?.estado.replaceAll("_", " ")}
            </div>
          </div>

          {/* Semaforo */}
          <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Semáforo
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-block h-3 w-3 rounded-full ${
                  legajo?.semaforo === "VERDE"
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : legajo?.semaforo === "AMARILLO"
                      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      : legajo?.semaforo === "ROJO"
                        ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                        : "bg-gray-400"
                }`}
              />
              <span className="text-sm font-medium text-ink uppercase">
                {legajo?.semaforo || "DESCONOCIDO"}
              </span>
            </div>
          </div>
        </div>

        {/* Motivacion */}
        <div className="rounded-xl border border-line bg-surface-alt/30 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
            Motivación
          </div>
          <p className="text-sm text-ink italic">"{legajo?.motivacion}"</p>
        </div>

        {/* Documentos */}
        <div className="rounded-xl border border-line bg-surface-alt/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Documentos
          </p>

          <div className="flex flex-col divide-y divide-line">
            {(Object.keys(ETIQUETA_TIPO) as TipoDocumento[]).map((t) => {
              const docsDeEseTipo =
                documentos?.filter((d) => d.tipo === t) ?? [];
              const doc =
                docsDeEseTipo.find((d) => d.estado !== "FALTANTE") ??
                docsDeEseTipo[0];
              const noAplica = t === "FORM_BECA" && !legajo?.solicita_beca;

              return (
                <div
                  key={t}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">
                      {ETIQUETA_TIPO[t]}
                    </p>

                    {doc ? (
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-semaforo-verde-soft dark:bg-semaforo-verde-soft-dark px-2 py-0.5 text-xs font-medium text-semaforo-verde">
                        <span className="h-1.5 w-1.5 rounded-full bg-semaforo-verde" />
                        Subido
                      </span>
                    ) : noAplica ? (
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium text-ink-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                        No aplica
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-semaforo-rojo-soft dark:bg-semaforo-rojo-soft-dark px-2 py-0.5 text-xs font-medium text-semaforo-rojo">
                        <span className="h-1.5 w-1.5 rounded-full bg-semaforo-rojo" />
                        No subido
                      </span>
                    )}
                  </div>

                  {doc && (
                    <Button
                      variant="outline"
                      icon={Eye}
                      className="shrink-0"
                      onClick={() => setDocSeleccionado(doc)}
                    >
                      Visualizar
                    </Button>
                  )}
                </div>
              );
            })}
            <ObservarDocumentoModal
              doc={docSeleccionado}
              legajoId={legajo!.id}
              onClose={() => setDocSeleccionado(null)}
            />
          </div>
        </div>
        {legajo && <Workflow legajo={legajo} />}
      </div>
    </>
  );
}
