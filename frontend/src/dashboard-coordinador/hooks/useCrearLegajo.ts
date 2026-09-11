// ─────────────────────────────────────────────
//  useCrearLegajo.ts
//  US-CORE-002: mutación que crea el legajo.
//  Incluye campos de beca y dispara la
//  notificación interna si solicita_beca = true.
// ─────────────────────────────────────────────

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { Legajo } from "@/shared/types/types";

// ── Payload que se envía al backend ──────────

export interface CrearLegajoPayload {
  // Datos personales
  nombre:          string;
  apellido:        string;
  dni:             string;
  email:           string;
  telefono_movil:  string;
  domicilio: {
    ciudad:    string;
    provincia: string;
  };

  // Académico
  titulo_grado:  string;
  tipo_carrera:  "Maestria" | "Especializacion" | "Doctorado";
  cohorte_id:    string;
  motivacion:    string;

  // US-CORE-002: beca
  solicita_beca: boolean;
  tipo_beca:     30 | 100 | null;   // null si solicita_beca = false
  // El PDF de beca se sube por separado en /legajos/:id/documentos
}

// ── Hook ─────────────────────────────────────

export function useCrearLegajo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearLegajoPayload) =>
      api.post<Legajo>("/legajos", payload),

    onSuccess: () => {
      // Invalida la lista para que se refresque
      queryClient.invalidateQueries({ queryKey: ["legajos"] });
    },
  });
}

// ── Hook para subir el PDF de beca ────────────
// US-CORE-002: el PDF es obligatorio si solicita_beca = true.
// Se sube después de crear el legajo, usando el id retornado.

export function useSubirDocumentoBeca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      legajoId,
      archivo,
    }: {
      legajoId: string;
      archivo:  File;
    }) => {
      const form = new FormData();
      form.append("archivo",  archivo);
      form.append("tipo",     "FORMULARIO_BECA");
      form.append("legajo_id", legajoId);

      // api.post detecta FormData automáticamente y omite Content-Type
      return api.post<{ id: string; url: string }>(
        `/legajos/${legajoId}/documentos`,
        form,
      );
    },

    onSuccess: (_data, { legajoId }) => {
      queryClient.invalidateQueries({ queryKey: ["documentos", legajoId] });
    },
  });
}