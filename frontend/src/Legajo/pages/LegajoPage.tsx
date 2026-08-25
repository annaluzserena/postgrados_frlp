import { useState, useEffect } from "react";
import DetalleLegajo from "../components/DetalleLegajo";
import type { Legajo } from "@/shared/types/types";

export default function LegajoPage() {
  const [legajos, setLegajos] = useState<Legajo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Legajo | null>(null);

  useEffect(() => {
    fetch("/api/v1/legajos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos de la API:", data);
        // Si API devuelve un objeto paginado con la clave 'legajos'
        const lista = data.legajos ? data.legajos : (Array.isArray(data) ? data : []);
        setLegajos(lista);
        if (lista.length > 0) {
          setAlumnoSeleccionado(lista[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar los legajos:", err);
        setLoading(false);
      });
  }, []);

  const handleExportPDF = () => {
    if (!alumnoSeleccionado) return;
    alert(`Generando PDF del legajo de ${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido}…`);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-paper text-ink">
        <p className="text-sm font-medium animate-pulse">Cargando legajos...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-6 bg-paper text-ink">
      <h1 className="mb-6 text-xl font-bold tracking-tight">
        Legajo Digital
      </h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 h-full overflow-hidden">
        
        {/* Listado alumnos (columna izquierda) */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-hidden">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            Alumnos ({legajos.length})
          </h2>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2 scroll-fade">
            {legajos.length === 0 ? (
              <p className="text-xs text-ink-muted p-2">No se encontraron legajos disponibles.</p>
            ) : (
              legajos.map((legajo) => {
                const isActive = alumnoSeleccionado?.id === legajo.id;
                const iniciales = `${legajo.nombre?.[0] || ""}${legajo.apellido?.[0] || ""}`.toUpperCase();

                return (
                  <div
                    key={legajo.id}
                    onClick={() => setAlumnoSeleccionado(legajo)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                      isActive 
                        ? "border-brand-500 bg-surface-alt shadow-sm" 
                        : "border-line bg-surface hover:bg-surface-alt/50"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-bold dark:bg-brand-950 dark:text-brand-300">
                      {iniciales || "LP"}
                    </div>
                    <div>
                      <div className="font-semibold text-ink">{legajo.apellido}, {legajo.nombre}</div>
                      <div className="text-xs text-ink-secondary">
                        {legajo.numero_legajo ? `#${legajo.numero_legajo}` : `Estado: ${legajo.estado}`}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detalle alumno (columna derecha) */}
        <div className="lg:col-span-8 flex flex-col overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-card scroll-fade">
          {alumnoSeleccionado ? (
            <DetalleLegajo alumno={alumnoSeleccionado} onExportPDF={handleExportPDF} />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-secondary">
              Selecciona un legajo para ver los detalles.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}