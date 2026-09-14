// ─────────────────────────────────────────────
//  Alerta.tsx  (reemplaza al existente)
//  Usa el tipo extendido + acciones por tipo
// ─────────────────────────────────────────────

import { useState } from 'react';
import { NotificationsButton } from '@/shared/components/NotificationsButton';
import { NotificacionCard } from '../components/NotificacionCard';
import type { Notificacion } from '../types/notificacion.types';
import {
  crearNotificacionBeca,
  crearNotificacionDocFaltante,
  crearNotificacionRiesgo,
  crearNotificacionDocenteInactivo,
} from '../services/notificacion.service';

// ── Mock con los 4 tipos nuevos ───────────────
// Reemplazar por fetch a la API cuando el backend esté listo.

const mockNotificaciones: Notificacion[] = [
  // US-CORE-002
  crearNotificacionBeca({
    aspiranteId: 'asp-1',
    aspiranteNombre: 'Carlos Ruiz',
    carrera: 'Especialización en Ciberseguridad',
    porcentajeBeca: 100,
    cohorte: '2025',
  }, new Date(Date.now() - 5 * 3_600_000)),

  // US-CORE-004
  crearNotificacionDocFaltante({
    legajoId: 'leg-2',
    alumnoNombre: 'María López',
    documentosFaltantes: ['DNI', 'Analítico de grado'],
    diasRestantes: 3,
  }, new Date(Date.now() - 2 * 3_600_000)),

  // US-C-004
  crearNotificacionRiesgo({
    alumnoId: 'alu-3',
    alumnoNombre: 'Pedro Martínez',
    carrera: 'Maestría en Gestión Tecnológica',
    motivoRiesgo: 'Sin avance en tesis hace 62 días',
    diasEnRojo: 8,
  }, new Date(Date.now() - 30 * 60_000)),

  // US-D-004
  crearNotificacionDocenteInactivo({
    docenteId: 'doc-4',
    docenteNombre: 'Ing. Fernández',
    seminario: 'Seminario de Redes Avanzadas',
    diasSinCargar: 17,
    alumnosSinRegistro: 12,
  }, new Date(Date.now() - 10 * 60_000)),
];

// ─────────────────────────────────────────────

export default function Alerta() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(mockNotificaciones);

  // ── Acciones comunes ──────────────────────
  const marcarLeido = (id: string) =>
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const eliminar = (id: string) =>
    setNotificaciones(prev => prev.filter(n => n.id !== id));

  // US-CORE-002: aprobar beca
  const handleAprobarBeca = (id: string) => {
    console.log('[CORE-002] Beca aprobada:', id);
    // TODO: PATCH /api/becas/:id  { estado: 'aprobada' }
    marcarLeido(id);
  };

  // US-CORE-002 / genérico: rechazar
  const handleRechazar = (id: string) => {
    console.log('[CORE-002] Rechazado:', id);
    // TODO: PATCH /api/becas/:id  { estado: 'rechazada' }
    eliminar(id);
  };

  // Delegar (cualquier tipo)
  const handleDelegar = (id: string) => {
    console.log('Delegado:', id);
    // TODO: POST /api/notificaciones/:id/delegar
    marcarLeido(id);
  };

  // US-CORE-004: ir al legajo
  const handleVerLegajo = (id: string) => {
    const notif = notificaciones.find(n => n.id === id);
    if (!notif) return;
    const meta = notif.meta as { legajoId?: string };
    console.log('[CORE-004] Ver legajo:', meta.legajoId);
    // TODO: router.push(`/legajos/${meta.legajoId}`)
    marcarLeido(id);
  };

  // US-C-004: ir al alumno
  const handleVerAlumno = (id: string) => {
    const notif = notificaciones.find(n => n.id === id);
    if (!notif) return;
    const meta = notif.meta as { alumnoId?: string };
    console.log('[C-004] Ver alumno:', meta.alumnoId);
    // TODO: router.push(`/alumnos/${meta.alumnoId}`)
    marcarLeido(id);
  };

  // US-D-004: notificar docente manualmente
  const handleNotificarDocente = (id: string) => {
    const notif = notificaciones.find(n => n.id === id);
    if (!notif) return;
    const meta = notif.meta as { docenteId?: string; docenteNombre?: string };
    console.log('[D-004] Notificando docente:', meta.docenteId);
    // TODO: POST /api/docentes/:id/recordatorio
    marcarLeido(id);
  };

  // ── Render ────────────────────────────────
  const sinLeer = notificaciones.filter(n => !n.read).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notificaciones</h1>
          {sinLeer > 0 && (
            <p className="mt-0.5 text-sm text-ink-secondary">
              {sinLeer} sin leer
            </p>
          )}
        </div>
        <NotificationsButton notifications={notificaciones} />
      </div>

      {notificaciones.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper-surface p-10 text-center text-ink-muted">
          No hay notificaciones
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notificaciones.map(n => (
            <NotificacionCard
              key={n.id}
              notificacion={n}
              onAprobar={handleAprobarBeca}
              onRechazar={handleRechazar}
              onDelegar={handleDelegar}
              onMarcarLeido={marcarLeido}
              onVerLegajo={handleVerLegajo}
              onVerAlumno={handleVerAlumno}
              onNotificarDocente={handleNotificarDocente}
            />
          ))}
        </div>
      )}
    </div>
  );
}