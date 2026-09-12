import { ETIQUETA_TIPO } from "@/shared/types/types";
import { useRef, useState } from "react";
import Input from "@/Login/components/Input";
import { Button } from "@/shared/components/Button";
import { Spinner } from "@/shared/components/Spinner";
import { Paperclip, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAdjuntarDocumento, useConsultaEstado } from "../hooks/useEstados";
import type { DocumentoConEstado, EstadoLegajo, TipoDocumento } from "@/shared/types/types";
 
const TAMANIO_MAX_BYTES = 5 * 1024 * 1024;

const MENSAJE_ESTADO: Record<EstadoLegajo, string> = {
  BORRADOR: "Todavía no enviaste tu inscripción para revisión.",
  PENDIENTE: "Tu inscripción está pendiente de revisión.",
  EN_REVISION: "Estamos revisando tu inscripción.",
  OBSERVADO: "Tu inscripción tiene observaciones. Revisá los documentos abajo.",
  COMPLETADO: "Tu documentación está completa.",
  ACTIVO: "¡Estás activo en la cohorte! Tu trayectoria está al día.",
  VENCIDO: "Tu inscripción venció. Contactá a la coordinación.",
  RECHAZADO: "Tu inscripción fue rechazada. Contactá a la coordinación para más información.",
  BAJA: "Tu inscripción fue dada de baja.",
  GRADUADO: "¡Te graduaste! Felicitaciones.",
};

function documentosRequeridos(solicitaBeca: boolean): TipoDocumento[] {
  const base: TipoDocumento[] = ["DNI", "TITULO_GRADO", "PARTIDA", "CUIT_CUIL", "FORM_INSCRIPCION"];
  return solicitaBeca ? [...base, "FORM_BECA"] : base;
}
 
export function ConsultarEstado() {
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [consultado, setConsultado] = useState(false);
 
  const { data: legajo, isLoading, isError } = useConsultaEstado({ dni, email }, consultado);
 
  function handleBuscar(e: React.SubmitEvent) {
    e.preventDefault();
    setConsultado(true);
  }
 
  function handleNuevaConsulta() {
    setConsultado(false);
  }
 
  if (!consultado || (isError && !isLoading)) {
    return (
      <div className="mx-auto max-w-md p-6">
        <h1 className="mb-1 text-lg font-semibold text-ink">Consultar estado de inscripción</h1>
        <p className="mb-6 text-sm text-ink-secondary">
          Ingresá el DNI y el email que usaste al inscribirte.
        </p>
 
        <form onSubmit={handleBuscar} className="space-y-4">
          <Input
            label="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
            inputMode="numeric"
            placeholder="Sin puntos"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={
              isError
                ? "No encontramos una inscripción con esos datos. Revisá el DNI y el email."
                : undefined
            }
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Consultar
          </Button>
        </form>
      </div>
    );
  }
 
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-6 text-ink-secondary">
        <Spinner size="sm" /> Buscando tu inscripción…
      </div>
    );
  }
 
  if (!legajo) return null;
 
  const requeridos = documentosRequeridos(legajo.solicita_beca);
  const subidosPorTipo = new Map(legajo.documentos.map((d: DocumentoConEstado) => [d.tipo, d]));
 
  const faltantes = requeridos.filter((tipo) => !subidosPorTipo.has(tipo));
  const observados = legajo.documentos.filter((d: DocumentoConEstado) => d.estado === "OBSERVADO");
  const sinPendientes = faltantes.length === 0 && observados.length === 0;
 
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink">
            Hola, {legajo.nombre} {legajo.apellido}
          </h1>
          {legajo.numero_legajo && (
            <p className="text-sm text-ink-secondary">Legajo N.º {legajo.numero_legajo}</p>
          )}
        </div>
        <button onClick={handleNuevaConsulta} className="text-sm font-medium text-brand-600 hover:underline">
          Consultar otro DNI
        </button>
      </div>
 
      <div className="rounded-xl border border-line bg-paper-surface p-4">
        <p className="text-sm text-ink">{MENSAJE_ESTADO[legajo.estado as EstadoLegajo]}</p>
      </div>
 
      {sinPendientes ? (
        <div className="flex items-center gap-2 rounded-xl bg-semaforo-verde-soft p-4 text-sm text-semaforo-verde dark:bg-semaforo-verde-soft-dark">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          Toda tu documentación está al día. No tenés nada pendiente de adjuntar.
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-ink">Documentos pendientes</h2>
 
          {observados.map((doc: DocumentoConEstado) => (
            <DocumentoPendienteItem
              key={doc.id}
              tipo={doc.tipo}
              legajoId={legajo.id}
              motivo={doc.motivo_observacion}
              variante="observado"
            />
          ))}
 
          {faltantes.map((tipo) => (
            <DocumentoPendienteItem key={tipo} tipo={tipo} legajoId={legajo.id} variante="faltante" />
          ))}
        </div>
      )}
    </div>
  );
}
 
interface DocumentoPendienteItemProps {
  tipo: TipoDocumento;
  legajoId: string;
  motivo?: string;
  variante: "faltante" | "observado";
}
 
function DocumentoPendienteItem({ tipo, legajoId, motivo, variante }: DocumentoPendienteItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const adjuntar = useAdjuntarDocumento(legajoId);
 
  function handleSeleccionArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
 
    if (file.type !== "application/pdf") {
      setErrorArchivo("Solo se aceptan archivos PDF.");
      return;
    }
    if (file.size > TAMANIO_MAX_BYTES) {
      setErrorArchivo("El archivo supera los 5MB permitidos.");
      return;
    }
 
    setErrorArchivo(null);
    adjuntar.mutate({ file, tipo });
    e.target.value = ""; // permite volver a elegir el mismo archivo si hace falta
  }
 
  const esObservado = variante === "observado";
 
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${
        esObservado
          ? "border-semaforo-amarillo/30 bg-semaforo-amarillo-soft dark:bg-semaforo-amarillo-soft-dark"
          : "border-line bg-paper-surface"
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{ETIQUETA_TIPO[tipo]}</p>
        {esObservado ? (
          <p className="mt-1 flex items-start gap-1 text-xs text-semaforo-amarillo">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {motivo ?? "El coordinador pidió que vuelvas a subir este documento."}
          </p>
        ) : (
          <p className="mt-1 text-xs text-ink-muted">Todavía no lo subiste.</p>
        )}
        {errorArchivo && <p className="mt-1 text-xs text-semaforo-rojo">{errorArchivo}</p>}
        {adjuntar.isSuccess && <p className="mt-1 text-xs text-semaforo-verde">¡Listo! Lo recibimos.</p>}
      </div>
 
      <div className="shrink-0">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleSeleccionArchivo}
        />
        <Button
          variant="outline"
          icon={Paperclip}
          isLoading={adjuntar.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {esObservado ? "Volver a subir" : "Adjuntar"}
        </Button>
      </div>
    </div>
  );
}