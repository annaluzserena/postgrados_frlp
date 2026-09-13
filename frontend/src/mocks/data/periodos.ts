/**
 * src/mocks/data/periodos.ts
 *
 * fecha_abre / fecha_cierra son strings "YYYY-MM-DD" (fecha simple, sin
 * hora) — coincide con lo que devuelve un <input type="date"> nativo,
 * así el formulario del modal no necesita conversión.
 */

import type { PeriodoInscripcion } from "@/shared/types/types";

const COHORTE_2026 = "c1a2b3c4-0001-0000-0000-000000000003";

export const periodosFixture: PeriodoInscripcion[] = [
  {
    id: "periodo-001",
    cohorte_id: COHORTE_2026,
    fecha_abre: "2026-07-01",
    fecha_cierra: "2026-10-31",
  },
];

export const periodosState: PeriodoInscripcion[] = [...periodosFixture];

export function getPeriodosPorCohorte(cohorteId: string): PeriodoInscripcion[] {
  return periodosState
    .filter((p) => p.cohorte_id === cohorteId)
    .sort((a, b) => b.fecha_abre.localeCompare(a.fecha_abre)); // más reciente primero
}

export function crearPeriodo(
  cohorteId: string,
  datos: { fecha_abre: string; fecha_cierra: string | null }
): PeriodoInscripcion {
  const nuevo: PeriodoInscripcion = {
    id: `periodo-${Date.now()}`,
    cohorte_id: cohorteId,
    fecha_abre: datos.fecha_abre,
    fecha_cierra: datos.fecha_cierra,
  };
  periodosState.push(nuevo);
  return nuevo;
}

export function actualizarPeriodo(
  id: string,
  cambios: Partial<PeriodoInscripcion>
): PeriodoInscripcion | null {
  const index = periodosState.findIndex((p) => p.id === id);
  if (index === -1) return null;
  periodosState[index] = { ...periodosState[index], ...cambios };
  return periodosState[index];
}