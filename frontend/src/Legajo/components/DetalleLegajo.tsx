import type { Alumno } from "../types/alumno";

interface DetalleLegajoProps {
  alumno: Alumno;
  onExportPDF: () => void;
}

export default function DetalleLegajo({ alumno, onExportPDF }: DetalleLegajoProps) {
  return (
    <div className="legajo-main">
      <div className="legajo-header">
        <div className="legajo-avatar">{alumno.iniciales}</div>
        <div>
          <div className="legajo-fullname">{alumno.nombre}</div>
          <div className="legajo-nro">Legajo #{alumno.legajoNro}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button className="legajo-btn-pdf" onClick={onExportPDF}>
            ⬇ Exportar PDF
          </button>
        </div>
      </div>

      <div className="legajo-grid">
        <div className="field-box">
          <div className="field-label">Carrera</div>
          <div className="field-value">{alumno.carrera}</div>
        </div>
        <div className="field-box">
          <div className="field-label">Cohorte</div>
          <div className="field-value mono">{alumno.cohorte}</div>
        </div>
        <div className="field-box">
          <div className="field-label">DNI</div>
          <div className="field-value mono">{alumno.dni}</div>
        </div>
        <div className="field-box">
          <div className="field-label">Fecha de nacimiento</div>
          <div className="field-value mono">{alumno.nacimiento}</div>
        </div>
        <div className="field-box">
          <div className="field-label">Email</div>
          <div className="field-value" style={{ fontSize: "13px" }}>{alumno.email}</div>
        </div>
        <div className="field-box">
          <div className="field-label">Teléfono</div>
          <div className="field-value mono">{alumno.telefono}</div>
        </div>
        <div className="field-box">
          <div className="field-label">Estado documentación</div>
          <div className="field-value">{alumno.estadoDoc}</div>
        </div>
        <div className="field-box">
          <div className="field-label">Fecha de inscripción</div>
          <div className="field-value mono">{alumno.fechaInscripcion}</div>
        </div>
      </div>

      <div className="chips-container">
        {alumno.documentos.map((doc, index) => {
          // Determinamos la clase según el símbolo que contiene el texto
          let colorClass = "yellow"; // por defecto
          if (doc.includes("✓")) {
            colorClass = "green";
          } else if (doc.includes("⟳")) {
            colorClass = "yellow";
          } else if (doc.includes("⚠")) {
            colorClass = "red";
          }

          return (
            <span key={index} className={`chip ${colorClass}`}>
              {doc}
            </span>
          );
        })}
      </div>
    </div>
  );
}