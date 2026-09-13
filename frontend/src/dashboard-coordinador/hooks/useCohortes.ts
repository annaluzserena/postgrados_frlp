import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 
import { api } from "@/shared/api/client";
import type { Cohorte, PeriodoInscripcion } from "@/shared/types/types";

// Todos los cohortes
export function useCohortes() {
    return useQuery({
        queryKey: ["cohortes"],
        queryFn: () => api.get<Cohorte[]>(`/cohortes`)
    })
};

// Un solo cohorte con id
export function useCohorte(id: string) {
    return useQuery({
        queryKey: ["cohortes", id],
        queryFn: () => api.get<Cohorte>(`/cohortes/${id}`),
        enabled: Boolean(id)
    })
};

export function usePeriodosInscripcion(cohorteId: string) {
  return useQuery({
    queryKey: ["periodos", cohorteId],
    queryFn: () => api.get<PeriodoInscripcion[]>(`/cohortes/${cohorteId}/periodos`),
    enabled: Boolean(cohorteId),
  });
}
 
export function useCrearPeriodo(cohorteId: string) {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (datos: { fecha_abre: string; fecha_cierra: string | null }) =>
      api.post<PeriodoInscripcion>(`/cohortes/${cohorteId}/periodos`, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodos", cohorteId] });
    },
  });
}
 
export function useCerrarPeriodo(cohorteId: string) {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (periodoId: string) =>
      api.patch<PeriodoInscripcion>(`/periodos/${periodoId}`, {
        fecha_cierra: new Date().toISOString().slice(0, 10), // hoy, formato YYYY-MM-DD
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodos", cohorteId] });
    },
  });
}
 