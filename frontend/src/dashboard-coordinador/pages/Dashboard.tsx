import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/shared/components/Sidebar";
import { menuItems } from "@/shared/menuConfig";
import type { User } from "@/shared/types/types";
import ListaInscriptos from "../components/ListaInscriptos";
//import Alerta from "@/AlertasNotificaciones/pages/Alerta";
import DetalleLegajo from "../components/DetalleLegajo";
import { PeriodoInscripcionCard } from "../components/PeriodoInscripcionCard";

// User de ejemplo
const currentUser: User = {
  nombre: "Ana González",
  rol: "coordinador",
  email: "ana@ejemplo.com",
  password_hash: "",
  password_plano: "",
  activo: true
};

function Dashboard({path}: {path: string}) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-paper text-ink">
      <Sidebar
        user={currentUser}
        items={menuItems}
        currentPath={path}
        onNavigate={navigate}
      />
      <main className="scroll-fade flex-1 overflow-y-auto px-8 py-6 transition-colors">
        {path === "/panel" && <PeriodoInscripcionCard cohorteId="c1a2b3c4-0001-0000-0000-000000000003" />}
        {path === "/inscriptos" && <ListaInscriptos />}
        {path === "/:id" && <DetalleLegajo />}
      </main>
    </div>
  );
}

export default Dashboard;