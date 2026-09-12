import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { DocumentoConEstado } from "@/shared/types/types";

export function useDocumentos(id: string) {
    return useQuery({
        queryKey: ["documentos", id],
        queryFn: () => api.get<DocumentoConEstado[]>(`/legajos/${id}/documentos`),
    })
}