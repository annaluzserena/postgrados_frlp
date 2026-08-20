import { http, HttpResponse, delay } from "msw";
import { legajosFixture } from "./data/legajos";
import type { CrearLegajoRequest, EstadoLegajo, Legajo } from "@/shared/types/legajo";

let legajos: Legajo[] = [...legajosFixture];

const LATENCIA_MS = { min: 300, max: 800 };
const randomDelay = () =>
  delay(LATENCIA_MS.min + Math.random() * (LATENCIA_MS.max - LATENCIA_MS.min));

function errorResponse(status: number, error: string, message: string, field?: string) {
  return HttpResponse.json(
    { statusCode: status, error, message, field, timestamp: new Date().toISOString() },
    { status }
  );
}

export const handlers = [
  // POST /api/v1/legajos
  http.post("/api/v1/legajos", async ({ request }) => {
    await randomDelay();
    const body = (await request.json()) as CrearLegajoRequest;

    const dniDuplicado = legajos.some((l) => l.dni === body.dni);
    if (dniDuplicado) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "Ya existe una preinscripción con este DNI para la cohorte actual",
        "dni"
      );
    }

    if (body.motivacion.length < 50) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "La motivación debe tener al menos 50 caracteres",
        "motivacion"
      );
    }

    const nuevo: Legajo = {
      id: `leg-${Date.now()}`,
      numeroLegajo: null,
      cohorteId: "c0h0rte-2026-0001",
      dni: body.dni,
      apellido: body.apellido,
      nombre: body.nombre,
      email: body.email,
      emailAlternativo: body.emailAlternativo,
      telefonoMovil: body.telefonoMovil,
      domicilio: body.domicilio,
      tituloGrado: body.tituloGrado,
      motivacion: body.motivacion,
      estado: "PENDIENTE",
      tipoCarrera: body.carreras[0] ?? null,
      solicitaBeca: body.solicitaBeca,
      tipoBeca: body.tipoBeca,
      semaforo: "VERDE",
      semaforoManual: false,
      fechaInscripcion: new Date().toISOString(),
      fechaActivacion: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    legajos = [...legajos, nuevo];

    return HttpResponse.json(nuevo, { status: 201 });
  }),

  // GET /api/v1/legajos
  http.get("/api/v1/legajos", async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const estado = url.searchParams.get("estado") as EstadoLegajo | null;
    const cohorteId = url.searchParams.get("cohorteId");

    let resultado = legajos;
    if (estado) resultado = resultado.filter((l) => l.estado === estado);
    if (cohorteId) resultado = resultado.filter((l) => l.cohorteId === cohorteId);

    return HttpResponse.json(resultado);
  }),

  // GET /api/v1/legajos/:id
  http.get("/api/v1/legajos/:id", async ({ params }) => {
    await randomDelay();
    const legajo = legajos.find((l) => l.id === params.id);
    if (!legajo) return errorResponse(404, "NOT_FOUND", "Legajo no encontrado");
    return HttpResponse.json(legajo);
  }),

  // PATCH /api/v1/legajos/:id/estado
  http.patch("/api/v1/legajos/:id/estado", async ({ params, request }) => {
    await randomDelay();
    const { estado } = (await request.json()) as { estado: EstadoLegajo };
    const legajo = legajos.find((l) => l.id === params.id);
    if (!legajo) return errorResponse(404, "NOT_FOUND", "Legajo no encontrado");

    legajo.estado = estado;
    legajo.updatedAt = new Date().toISOString();
    if (estado === "COMPLETADO" && !legajo.numeroLegajo) {
      legajo.numeroLegajo = `26-001-${String(legajos.indexOf(legajo) + 1).padStart(3, "0")}`;
    }

    return HttpResponse.json(legajo);
  }),

  // POST /api/v1/legajos/:id/documentos
  http.post("/api/v1/legajos/:id/documentos", async ({ params, request }) => {
    await randomDelay();
    const legajo = legajos.find((l) => l.id === params.id);
    if (!legajo) return errorResponse(404, "NOT_FOUND", "Legajo no encontrado");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return errorResponse(400, "VALIDATION_ERROR", "No se envió ningún archivo");

    if (file.type !== "application/pdf") {
      return errorResponse(400, "VALIDATION_ERROR", "Solo se aceptan archivos en formato PDF");
    }
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "El archivo es demasiado grande. Máximo permitido: 5MB"
      );
    }

    return HttpResponse.json(
      {
        id: `doc-${Date.now()}`,
        legajoId: legajo.id,
        tipo: formData.get("tipo"),
        nombreOriginal: file.name,
        tamanioBytes: file.size,
        fechaSubida: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
];
