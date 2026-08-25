import type { Legajo } from "@/shared/types/types";

interface DetalleLegajoProps {
  alumno: Legajo;
  onExportPDF: () => void;
}

export default function DetalleLegajo({ alumno, onExportPDF }: DetalleLegajoProps) {
  const iniciales = `${alumno.nombre[0] || ""}${alumno.apellido[0] || ""}`.toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center border-b border-line pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 font-bold text-lg dark:bg-brand-950 dark:text-brand-300">
          {iniciales}
        </div>
        <div>
          <div className="text-lg font-bold text-ink">{alumno.apellido}, {alumno.nombre}</div>
          <div className="text-sm font-medium text-ink-secondary">
            {alumno.numero_legajo ? `Legajo #${alumno.numero_legajo}` : `Estado: ${alumno.estado}`}
          </div>
        </div>
        <div className="sm:ml-auto">
          <button
            onClick={onExportPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors cursor-pointer"
          >
            ⬇ Exportar PDF
          </button>
        </div>
      </div>

      {/* Datos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Título de Grado</div>
          <div className="text-sm font-medium text-ink mt-1">{alumno.titulo_grado}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tipo de Carrera</div>
          <div className="text-sm font-medium text-ink mt-1">{alumno.tipo_carrera || "No especificado"}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">DNI</div>
          <div className="text-sm font-medium text-ink mt-1 font-mono">{alumno.dni}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Ciudad / Provincia</div>
          <div className="text-sm font-medium text-ink mt-1">{alumno.domicilio.ciudad}, {alumno.domicilio.provincia}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Email</div>
          <div className="text-xs font-medium text-ink mt-1 truncate">{alumno.email}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Teléfono</div>
          <div className="text-sm font-medium text-ink mt-1 font-mono">{alumno.telefono_movil}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Estado</div>
          <div className="text-sm font-medium text-ink mt-1">{alumno.estado}</div>
        </div>
        
        {/* Semaforo */}
        <div className="rounded-xl border border-line bg-surface-alt/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Semáforo</div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-block h-3 w-3 rounded-full ${
                alumno.semaforo === "VERDE"
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : alumno.semaforo === "AMARILLO"
                  ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                  : alumno.semaforo === "ROJO"
                  ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                  : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium text-ink uppercase">
              {alumno.semaforo || "DESCONOCIDO"}
            </span>
          </div>
        </div>
      </div>

      {/* Motivacion */}
      <div className="rounded-xl border border-line bg-surface-alt/30 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">Motivación</div>
        <p className="text-sm text-ink italic">"{alumno.motivacion}"</p>
      </div>
    </div>
  );
}