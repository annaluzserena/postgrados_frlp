import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { FiltrosLegajo, Legajo, LegajosPaginados, EstadoLegajo } from "@/shared/types/types";

function buildQueryString(filtros: FiltrosLegajo): string {
  const params = new URLSearchParams();
  if (filtros.estado) params.set("estado", filtros.estado);
  if (filtros.cohorte_id) params.set("cohorte_id", filtros.cohorte_id);
  if (filtros.tipo_carrera) params.set("tipo_carrera", filtros.tipo_carrera);
  if (filtros.solo_con_beca) params.set("solo_con_beca", "true");
  params.set("page", String(filtros.page ?? 1));
  params.set("limit", String(filtros.limit ?? 10));
  return params.toString();
}

export function useLegajos(filtros: FiltrosLegajo = {}) {
  return useQuery({
    queryKey: ["legajos", filtros],
    queryFn: () => api.get<LegajosPaginados>(`/legajos?${buildQueryString(filtros)}`),
    placeholderData: keepPreviousData,
  });
}

// Para el detalle de un legajo puntual (GET /api/v1/legajos/:id)
export function useLegajo(id: string) {
  return useQuery({
    queryKey: ["legajos", id],
    queryFn: () => api.get<Legajo>(`/legajos/${id}`),
    enabled: Boolean(id),
  });
}

// Patch del estado de un legajo (PATCH /api/v1/legajos/:id)
interface propsPatch {
  id: string,
  estado: EstadoLegajo,
}
export function useActualizarEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: propsPatch) =>
      api.patch<Legajo>(`/legajos/${id}/estado`, { estado }),

    onSuccess: (legajoActualizado, { id }) => {
      queryClient.setQueryData(["legajos", id], legajoActualizado);

      queryClient.invalidateQueries({
        queryKey: ["legajos"],
        exact: false,
        predicate: (query) => typeof query.queryKey[1] === "object",
      });
    },
  });
}