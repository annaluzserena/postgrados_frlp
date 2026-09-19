import { useState } from "react";
import { Sidebar } from "@/shared/components/Sidebar";
import { menuItems } from "@/shared/menuConfig";
import type { User } from "@/shared/types/types";
import ListaInscriptos from "../components/ListaInscriptos";
import Alerta from "@/AlertasNotificaciones/pages/Alerta";
import { FormularioInscripcion } from "@/Inscripcion/components/FormularioInscripcion";
import { NotificationsButton } from "@/shared/components/NotificationsButton";
import {
  crearNotificacionBeca,
  crearNotificacionDocFaltante,
  crearNotificacionRiesgo,
  crearNotificacionDocenteInactivo,
} from "@/AlertasNotificaciones/services/notificacion.service";
import type { Notificacion } from "@/AlertasNotificaciones/types/notificacion.types";

const currentUser: User = {
  nombre: "Ana González",
  rol: "coordinador",
  email: "ana@ejemplo.com",
  password_hash: "",
  password_plano: "",
  activo: true,
};

// Mock compartido — cuando haya backend viene de la API
const mockNotificaciones: Notificacion[] = [
  crearNotificacionBeca({
    aspiranteId: "asp-1",
    aspiranteNombre: "Carlos Ruiz",
    carrera: "Especialización en Ciberseguridad",
    porcentajeBeca: 100,
    cohorte: "2025",
  }, new Date(Date.now() - 5 * 3_600_000)),

  crearNotificacionDocFaltante({
    legajoId: "leg-2",
    alumnoNombre: "María López",
    documentosFaltantes: ["DNI", "Analítico de grado"],
    diasRestantes: 3,
  }, new Date(Date.now() - 2 * 3_600_000)),

  crearNotificacionRiesgo({
    alumnoId: "alu-3",
    alumnoNombre: "Pedro Martínez",
    carrera: "Maestría en Gestión Tecnológica",
    motivoRiesgo: "Sin avance en tesis hace 62 días",
    diasEnRojo: 8,
  }, new Date(Date.now() - 30 * 60_000)),

  crearNotificacionDocenteInactivo({
    docenteId: "doc-4",
    docenteNombre: "Ing. Fernández",
    seminario: "Seminario de Redes Avanzadas",
    diasSinCargar: 17,
    alumnosSinRegistro: 12,
  }, new Date(Date.now() - 10 * 60_000)),
];

function Dashboard() {
  const [currentPath, setCurrentPath] = useState("/panel");
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(mockNotificaciones);

  // El botón de la campana navega a /notificaciones
  const handleCampana = () => setCurrentPath("/notificaciones");

  // Cuando Alerta marca como leído, actualizamos el estado compartido
  const handleMarcarLeido = (id: string) =>
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="flex h-screen w-full bg-paper text-ink">
      <Sidebar
        user={currentUser}
        items={menuItems}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-end border-b border-line bg-paper-surface px-6 py-3">
          <NotificationsButton
            notifications={notificaciones}
            onClick={handleCampana}
          />
        </header>

        {/* Contenido principal */}
        <main className="scroll-fade flex-1 overflow-y-auto px-8 py-6 transition-colors">
          {currentPath === "/panel" && (
            <Alerta
              notificaciones={notificaciones}
              onMarcarLeido={handleMarcarLeido}
              onActualizar={setNotificaciones}
            />
          )}
          {currentPath === "/notificaciones" && (
            <Alerta
              notificaciones={notificaciones}
              onMarcarLeido={handleMarcarLeido}
              onActualizar={setNotificaciones}
            />
          )}
          {currentPath === "/inscriptos" && <ListaInscriptos />}
          {currentPath === "/inscripcion" && (
            <FormularioInscripcion onExito={() => setCurrentPath("/inscriptos")} />
          )}
        </main>

      </div>
    </div>
  );
}

export default Dashboard;