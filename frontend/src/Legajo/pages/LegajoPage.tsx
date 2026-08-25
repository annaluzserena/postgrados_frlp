import { useState } from "react";
import DetalleLegajo from "../components/DetalleLegajo";
import "./LegajoPage.css";

import type { Alumno } from "../types/alumno";

export default function LegajoPage() {
  const alumnos: Alumno[] = [
    {
      id: "MR",
      iniciales: "MR",
      nombre: "María Rodríguez",
      carrera: "Ing. en Sistemas",
      legajoNro: "2025-0041",
      cohorte: "2025-A",
      dni: "38.451.902",
      nacimiento: "14/03/1999",
      email: "m.rodriguez@mail.com",
      telefono: "+54 9 221 555-0172",
      estadoDoc: "✓ Completa",
      fechaInscripcion: "03/02/2025",
      documentos: ["DNI ✓", "Cert. analítico ✓", "Partida de nacimiento ✓", "Foto 4×4 ✓", "Declaración jurada ✓"]
    },
    {
      id: "CL",
      iniciales: "CL",
      nombre: "Carlos López",
      carrera: "Medicina",
      legajoNro: "2025-0042",
      cohorte: "2025-A",
      dni: "35.111.222",
      nacimiento: "22/07/1995",
      email: "carlos.lopez@mail.com",
      telefono: "+54 9 221 444-8899",
      estadoDoc: "⚠ Pendiente",
      fechaInscripcion: "05/02/2025",
      documentos: ["DNI ✓", "Cert. analítico ⚠", "Partida de nacimiento ✓", "Foto 4×4 ✓", "Declaración jurada ✓"]
    },
    {
      id: "AV",
      iniciales: "AV",
      nombre: "Ana Villalba",
      carrera: "Derecho",
      legajoNro: "2025-0043",
      cohorte: "2025-A",
      dni: "40.987.123",
      nacimiento: "10/11/2000",
      email: "ana.villalba@mail.com",
      telefono: "+54 9 221 333-2211",
      estadoDoc: "⟳ En revisión",
      fechaInscripcion: "10/02/2025",
      documentos: ["DNI ✓", "Cert. analítico ✓", "Partida de nacimiento ⟳", "Foto 4×4 ✓", "Declaración jurada ✓"]
    }
  ];

  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno>(alumnos[0]);

  const handleExportPDF = () => {
    alert(`Generando PDF del legajo de ${alumnoSeleccionado.nombre}…`);
  };

  return (
    <div className="legajo-container">
      <h2 className="legajo-title">Módulo de Gestión: Legajo Digital</h2>
      
      <div className="legajo-layout">
        {/* Sidebar */}
        <div className="legajo-sidebar">
          <div className="legajo-sidebar-title">Alumnos</div>
          <div className="legajo-list">
            {alumnos.map((alum) => {
              const isActive = alumnoSeleccionado.id === alum.id;
              return (
                <div
                  key={alum.id}
                  onClick={() => setAlumnoSeleccionado(alum)}
                  className={`legajo-card ${isActive ? "active" : ""}`}
                >
                  <div className="legajo-card-icon">📄</div>
                  <div>
                    <div className="legajo-card-name">{alum.nombre}</div>
                    <div className="legajo-card-id">#{alum.legajoNro}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel Principal por Componente */}
        <DetalleLegajo alumno={alumnoSeleccionado} onExportPDF={handleExportPDF} />
      </div>
    </div>
  );
}