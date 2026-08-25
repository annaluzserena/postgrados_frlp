import { useState } from "react";
import { Sidebar } from "@/shared/components/Sidebar";
import { menuItems } from "@/shared/menuConfig";
import type { User, Legajo } from "@/shared/types/types";
import ListaInscriptos from "../components/ListaInscriptos";
import { Workflow } from "../components/Workflow";

// User de ejemplo
const currentUser: User = {
  id: "u1",
  nombre: "Ana González",
  rol: "coordinador",
  email: "ana@ejemplo.com",
};
const mockLegajo: Legajo = {
  id: "l1",
  nombre: "Juan",
  apellido: "Pérez",
  dni: "30123456",
  numero_legajo: "1024",
  tipo_carrera: "Maestria",
  estado: "EN_REVISION",
  solicita_beca: false,
  tipo_beca: undefined,
   /*desde aca agrego lo que vos no tenias el el dashboar para poder visualizar la app
    despues veo bien como lo soluciono asi no hay tantos atributos */
    
  cohorte_id: "1",
  email: "juan@example.com",
  telefono_movil: "1123456789",
  domicilio: { direccion: "Calle 123",
  ciudad: "La Plata",
  provincia: "Buenos Aires",
  pais: "Argentina",},
  
  titulo_grado: "Licenciado en Sistemas",
  motivacion: "Continuar mi formación profesional",
  carrera_elegida: "Maestría en Sistemas",
  semaforo: "AMARILLO",
  semaforo_manual: false,
  fecha_inscripcion: "2025-01-15",
  fecha_activacion: "2025-01-20",
  created_at: "2025-01-15T10:00:00.000Z",
  updated_at: "2025-01-15T10:00:00.000Z",
};

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
       {currentPath === "/panel" && <Workflow legajo={mockLegajo} />}
      </main>
    </div>
  );
}

export default Dashboard;