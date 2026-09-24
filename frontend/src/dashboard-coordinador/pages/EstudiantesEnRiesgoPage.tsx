import EstudiantesEnRiesgo from "../components/EstudiantesEnRiesgo";
import { useEstudiantesEnRiesgo } from "../hooks/useEstudiantesEnRiesgo";

/**
 * US-C-003 — Página del dashboard de estudiantes en riesgo.
 * Conecta el hook de datos (useEstudiantesEnRiesgo) con el
 * componente de presentación (EstudiantesEnRiesgo).
 *
 * Se monta dentro de <main> en Dashboard.tsx, que ya aporta
 * scroll-fade, overflow-y-auto y el padding (px-8 py-6) — igual
 * que Alerta, ListaInscriptos y ListaSeminarios. Por eso este
 * componente no agrega ningún wrapper propio.
 */
export default function EstudiantesEnRiesgoPage() {
  const { estudiantes, isLoading, error } = useEstudiantesEnRiesgo();

  return <EstudiantesEnRiesgo estudiantes={estudiantes} isLoading={isLoading} error={error} />;
}
