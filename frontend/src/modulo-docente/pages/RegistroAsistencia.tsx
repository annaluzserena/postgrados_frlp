import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TablaAsistencia } from "../components/TablaAsistencia";
import type { Alumno, Clase, PorcentajeAsistencia } from "../../shared/types/types.ts";
import { calcularPorcentaje } from "../../shared/types/types.ts";

// TODO: reemplazar por el seminario real seleccionado (contexto, ruta, o prop)
const SEMINARIO_ID = "seminario-demo";

async function fetchAlumnos(): Promise<Alumno[]> {
  const res = await fetch(`/api/v1/seminarios/${SEMINARIO_ID}/alumnos`);
  if (!res.ok) throw new Error("No se pudieron cargar los alumnos.");
  return res.json();
}

async function fetchClases(): Promise<Clase[]> {
  const res = await fetch(`/api/v1/seminarios/${SEMINARIO_ID}/clases`);
  if (!res.ok) throw new Error("No se pudieron cargar las clases.");
  return res.json();
}

async function crearClase(fecha: string): Promise<Clase> {
  const res = await fetch(`/api/v1/seminarios/${SEMINARIO_ID}/clases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fecha }),
  });
  if (!res.ok) throw new Error("No se pudo crear la clase.");
  return res.json();
}

async function actualizarAsistencia(
  claseId: string,
  alumnoId: string,
  presente: boolean
): Promise<Clase> {
  const res = await fetch(`/api/v1/clases/${claseId}/asistencia`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alumnoId, presente }),
  });
  if (!res.ok) throw new Error("No se pudo guardar la asistencia.");
  return res.json();
}

export function RegistroAsistencia() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: alumnos = [], isLoading: loadingAlumnos } = useQuery({
    queryKey: ["alumnos", SEMINARIO_ID],
    queryFn: fetchAlumnos,
  });

  const { data: clases = [], isLoading: loadingClases } = useQuery({
    queryKey: ["clases", SEMINARIO_ID],
    queryFn: fetchClases,
  });

  const crearClaseMutation = useMutation({
    mutationFn: crearClase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clases", SEMINARIO_ID] });
    },
    onError: () => setError("No se pudo crear la clase. Intentá nuevamente."),
  });

  const asistenciaMutation = useMutation({
    mutationFn: ({
      claseId,
      alumnoId,
      presente,
    }: {
      claseId: string;
      alumnoId: string;
      presente: boolean;
    }) => actualizarAsistencia(claseId, alumnoId, presente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clases", SEMINARIO_ID] });
    },
    onError: () => setError("No se pudo guardar el cambio. Intentá nuevamente."),
  });

  const handleNuevaClase = () => {
    const hoy = new Date().toISOString().slice(0, 10);
    setError(null);
    crearClaseMutation.mutate(hoy);
  };

  const handleToggleAsistencia = (
    claseId: string,
    alumnoId: string,
    presenteActual: boolean
  ) => {
    setError(null);
    asistenciaMutation.mutate({
      claseId,
      alumnoId,
      presente: !presenteActual,
    });
  };

  // Calcula el porcentaje de cada alumno en tiempo real:
  // (clases presente / total clases dictadas) * 100
  const porcentajes: PorcentajeAsistencia[] = useMemo(() => {
    const totalClases = clases.length;
    return alumnos.map((alumno) => {
      const clasesPresente = clases.filter((clase) =>
        clase.asistencias.some((a) => a.alumnoId === alumno.id && a.presente)
      ).length;
      return {
        alumnoId: alumno.id,
        clasesPresente,
        totalClases,
        porcentaje: calcularPorcentaje(clasesPresente, totalClases),
      };
    });
  }, [alumnos, clases]);

  if (loadingAlumnos || loadingClases) {
    return (
      <div className="px-5 py-10 text-center text-sm text-ink-muted">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-5 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink">Registro de asistencia</h1>
        <button
          type="button"
          onClick={handleNuevaClase}
          disabled={crearClaseMutation.isPending}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          {crearClaseMutation.isPending ? "Creando..." : "+ Nueva clase"}
        </button>
      </div>

      {error && (
        <p className="text-sm font-medium text-semaforo-rojo">{error}</p>
      )}

      <TablaAsistencia
        alumnos={alumnos}
        clases={clases}
        porcentajes={porcentajes}
        onToggleAsistencia={handleToggleAsistencia}
        disabled={asistenciaMutation.isPending}
      />
    </div>
  );
}

export default RegistroAsistencia;