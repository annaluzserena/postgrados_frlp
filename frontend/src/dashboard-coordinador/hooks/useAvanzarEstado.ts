// ─────────────────────────────────────────────
//  useAvanzarEstado.ts
//  US-C-004 (frontend): cuando el semáforo
//  cambia a ROJO, crea la notificación interna.
//  El email lo manda el backend (job diario).
//
//  Cuando el backend esté listo:
//  → descomentar el fetch en mutationFn
// ─────────────────────────────────────────────

import { useMutation, useQueryClient } from "@tanstack/react-query";
/*import { api } from "@/shared/api/client";*/
import type { EstadoLegajo, Legajo, Semaforo } from "@/shared/types/types";
import { crearNotificacionRiesgo } from "@/AlertasNotificaciones/services/notificacion.service";

// ── Tipos ─────────────────────────────────────

interface AvanzarEstadoPayload {
  legajoId: string;
  estadoActual: EstadoLegajo;
}

interface AvanzarEstadoResponse {
  legajo:          Legajo;
  semaforoAnterior: Semaforo;
}

// ── Siguiente estado en el workflow ───────────

const SIGUIENTE_ESTADO: Partial<Record<EstadoLegajo, EstadoLegajo>> = {
  BORRADOR:    "PENDIENTE",
  PENDIENTE:   "EN_REVISION",
  EN_REVISION: "COMPLETADO",
  COMPLETADO:  "ACTIVO",
  OBSERVADO:   "PENDIENTE",
};

export function siguienteEstado(actual: EstadoLegajo): EstadoLegajo | null {
  return SIGUIENTE_ESTADO[actual] ?? null;
}

// ── Hook ─────────────────────────────────────

export function useAvanzarEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AvanzarEstadoPayload): Promise<AvanzarEstadoResponse> => {
      const siguiente = siguienteEstado(payload.estadoActual);
      if (!siguiente) throw new Error("No hay estado siguiente disponible.");

      // TODO: descomentar cuando el backend esté listo
      // const legajo = await api.patch<Legajo>(
      //   `/legajos/${payload.legajoId}/estado`,
      //   { estado: siguiente },
      // );
      // return { legajo, semaforoAnterior: ??? }; // backend debe devolver semaforo anterior

      // Mock mientras no hay backend
      console.log(`[useAvanzarEstado] ${payload.estadoActual} → ${siguiente}`);
      return {
        legajo: { estado: siguiente } as Legajo,
        semaforoAnterior: "AMARILLO",
      };
    },

    onSuccess: (data, payload) => {
      // Invalida el legajo para que se refresque
      queryClient.invalidateQueries({ queryKey: ["legajos", payload.legajoId] });

      // ── US-C-004: si el semáforo cambió a ROJO → notificación interna ──
      // El email lo manda el job del backend; acá solo generamos la alerta
      // en el sistema para que el coordinador la vea en el panel.
      const { legajo, semaforoAnterior } = data;
      if (
        legajo.semaforo === "ROJO" &&
        semaforoAnterior !== "ROJO"
      ) {
        const notif = crearNotificacionRiesgo({
          alumnoId:     legajo.id,
          alumnoNombre: `${legajo.nombre} ${legajo.apellido}`,
          carrera:      legajo.tipo_carrera ?? legajo.carrera_elegida ?? "—",
          motivoRiesgo: "Cambio de semáforo detectado por el sistema",
          diasEnRojo:   0,
        });

        // TODO: POST /api/notificaciones  { ...notif }
        // Por ahora lo logueamos; cuando el backend esté se envía
        console.log("[US-C-004] Notificación de riesgo generada:", notif);
      }
    },
  });
}

// ── Hook para devolver estado ─────────────────

export function useDevolverEstado() {
  const queryClient = useQueryClient();

  const ESTADO_ANTERIOR: Partial<Record<EstadoLegajo, EstadoLegajo>> = {
    PENDIENTE:   "BORRADOR",
    EN_REVISION: "OBSERVADO",
    COMPLETADO:  "EN_REVISION",
  };

  return useMutation({
    mutationFn: async (payload: AvanzarEstadoPayload) => {
      const anterior = ESTADO_ANTERIOR[payload.estadoActual];
      if (!anterior) throw new Error("No se puede devolver desde este estado.");

      // TODO: descomentar cuando el backend esté listo
      // return api.patch<Legajo>(
      //   `/legajos/${payload.legajoId}/estado`,
      //   { estado: anterior },
      // );

      console.log(`[useDevolverEstado] ${payload.estadoActual} → ${anterior}`);
      return { estado: anterior } as Legajo;
    },

    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["legajos", payload.legajoId] });
    },
  });
}