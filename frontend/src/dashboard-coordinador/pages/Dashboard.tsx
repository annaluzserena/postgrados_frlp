import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/shared/components/Sidebar";
import { menuItems } from "@/shared/menuConfig";
import ListaInscriptos from "../components/ListaInscriptos";
import DetalleLegajo from "../components/DetalleLegajo";
import Panel from "./Panel";
import { UserContext } from "@/shared/context/UserContext";
import ListaSeminarios from "../components/ListaSeminarios";
import EstudiantesEnRiesgoPage from "./EstudiantesEnRiesgoPage";
import Alerta from "@/AlertasNotificaciones/pages/Alerta";
import type { Notificacion } from "@/AlertasNotificaciones/types/notificacion.types";
import { NotificationsButton } from "@/shared/components/NotificationsButton";




export function Dashboard({ path }: { path: string }) {
  const currentUser = useContext(UserContext);
  const navigate = useNavigate();
  const [notificacion, setNotificaciones] = useState<Notificacion[]>([
  {
    id: "1",
    tipo: "BECA_SOLICITADA",
    title: "Bienvenido",
    description: "Tu sesión ha iniciado correctamente.",
    time: "ahora",
    read: false,
    prioridad: "alta",
    meta: {},
  },
]);

  const handleMarcarLeido = (id: string | number) => {
    setNotificaciones((prev) =>
      prev.map((n) => (String(n.id) === String(id) ? { ...n, read: true } : n))
    );
  };

  const handleActualizar = () => {
    // Lógica de recarga/refresh aquí
  };
  
  return (
    <div className="flex h-screen w-full bg-paper text-ink">
      <Sidebar
        user={currentUser}
        items={menuItems}
        currentPath={path}
        onNavigate={navigate}
      />
      <main className="scroll-fade flex-1 overflow-y-auto px-8 py-6 transition-colors">
        {path !== "/notificaciones" && (
          <NotificationsButton 
            notifications={notificacion} 
            onClick={() => navigate('/notificaciones')}
          />
        )}
        {path === "/panel" && <Panel />}
        {path === "/inscriptos" && <ListaInscriptos />}
        {path === "/:id" && <DetalleLegajo />}
        {path === "/seminarios" && <ListaSeminarios />}
        {path === "/riesgo" && <EstudiantesEnRiesgoPage />}
        {path === "/notificaciones" && <Alerta 
                  notificaciones={notificacion}
                  onMarcarLeido={handleMarcarLeido}
                  onActualizar={handleActualizar}/>}
    
      </main>
         
    </div>
  );
}

export default Dashboard;