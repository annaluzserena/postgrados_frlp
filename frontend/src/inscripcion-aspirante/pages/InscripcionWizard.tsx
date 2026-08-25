import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { WizardHeader } from "../components/WizardHeader";
import { Stepper, type Step } from "../components/Stepper";
import { DatosPersonalesForm } from "../components/DatosPersonalesForm";
import { DATOS_PERSONALES_INICIAL, type DatosPersonales } from "../types";

const STEPS: Step[] = [
  { id: "personales", label: "Personales" },
  { id: "academicos", label: "Académicos" },
  { id: "documentos", label: "Documentos" },
  { id: "confirmar", label: "Confirmar" },
];

const STEP_TITLES: Record<string, string> = {
  personales: "Datos Personales",
  academicos: "Datos Académicos",
  documentos: "Documentación",
  confirmar: "Confirmar Inscripción",
};

// TODO: reemplazar por la URL real del backend cuando esté disponible.
// Ej: `${import.meta.env.VITE_API_URL}/inscripciones`
const INSCRIPCION_ENDPOINT = "/api/inscripciones";

interface InscripcionPayload {
  datosPersonales: DatosPersonales;
}

async function postInscripcion(payload: InscripcionPayload) {
  const response = await fetch(INSCRIPCION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.message ?? "No se pudo enviar la inscripción. Intentá nuevamente."
    );
  }

  return response.json();
}

export function InscripcionWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [datosPersonales, setDatosPersonales] = useState<DatosPersonales>(
    DATOS_PERSONALES_INICIAL
  );

  const mutation = useMutation({
    mutationFn: postInscripcion,
    onSuccess: () => {
      setCurrentStep((step) => Math.min(step + 1, STEPS.length - 1));
    },
  });

  // Paso 1: por ahora envía directo al guardar. Cuando estén los pasos
  // 2-4, esto debería solo avanzar de paso y el POST se dispara recién
  // en "Confirmar", con el payload acumulado de todos los pasos.
  const handleNextPersonales = (data: DatosPersonales) => {
    setDatosPersonales(data);
    mutation.mutate({ datosPersonales: data });
  };

  const activeStep = STEPS[currentStep];

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper text-ink">
      <WizardHeader onBack={() => window.history.back()} />
      <Stepper steps={STEPS} currentStep={currentStep} />

      <main className="flex-1">
        <h1 className="px-5 pb-4 text-lg font-bold text-ink">
          Paso {currentStep + 1}: {STEP_TITLES[activeStep.id]}
        </h1>

        {currentStep === 0 && (
          <DatosPersonalesForm
            initialData={datosPersonales}
            isSubmitting={mutation.isPending}
            onNext={handleNextPersonales}
          />
        )}

        {currentStep > 0 && (
          <div className="px-5 py-10 text-center text-sm text-ink-muted">
            Este paso todavía no está implementado.
          </div>
        )}

        {mutation.isError && (
          <p className="px-5 pb-4 text-sm font-medium text-semaforo-rojo">
            {(mutation.error as Error).message}
          </p>
        )}
      </main>
    </div>
  );
}

export default InscripcionWizard;
