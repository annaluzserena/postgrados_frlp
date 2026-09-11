import { useState } from "react";
import { Sidebar } from "@/shared/components/Sidebar";
import { menuItems } from "@/shared/menuConfig";
import type { User } from "@/shared/types/types";
import ListaInscriptos from "../components/ListaInscriptos";
import Alerta from "@/AlertasNotificaciones/pages/Alerta"
import { FormularioInscripcion } from "@/Inscripcion/components/FormularioInscripcion";

// User de ejemplo
const currentUser: User = ({
  nombre: "Ana González",
  rol: "coordinador",
  email: "ana@ejemplo.com",
  password_hash: "",
  password_plano: "",
  activo: true,
});

function Dashboard() {
  const [currentPath, setCurrentPath] = useState("/panel");

  return (
    <div className="flex h-screen w-full bg-paper text-ink">
      <Sidebar
        user={currentUser}
        items={menuItems}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      />
      <main className="scroll-fade flex-1 overflow-y-auto px-8 py-6 transition-colors">
        {currentPath === "/inscriptos" && <ListaInscriptos />}
        {currentPath === "/noticias" && <Alerta />}
        {currentPath === "/inscripcion" && (
  <FormularioInscripcion onExito={() => setCurrentPath("/inscriptos")} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;