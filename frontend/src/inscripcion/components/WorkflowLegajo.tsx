import React, { useState } from 'react';
import type { Legajo, EstadoLegajo } from '@/shared/types/types';
import { api } from '@/shared/api/client';

interface WorkflowLegajoProps {
  legajo: Legajo;
}

export const WorkflowLegajo = ({ legajo }: WorkflowLegajoProps) => {
  return (
    <>
      <div id="tab-workflow" className="tab-panel">
        <div className="workflow-wrap">
          
          {/* Leyenda de colores */}
          <div className="wf-legend">
            <div className="wf-legend-item">
              <div className="wf-dot" style={{ background: 'var(--green)' }}></div> Completado
            </div>
            <div className="wf-legend-item">
              <div className="wf-dot" style={{ background: 'var(--accent)' }}></div> En curso
            </div>
            <div className="wf-legend-item">
              <div className="wf-dot" style={{ background: 'var(--border)' }}></div> Pendiente
            </div>
          </div>

          {/* Encabezado del alumno DINÁMICO */}
          <div style={{ background: 'var(--accent-light)', border: '1px solid #b3d4ee', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: 'var(--accent)' }}>
            📋 Workflow de <strong>{legajo.nombre} {legajo.apellido}</strong> — {legajo.numero_legajo ? `#${legajo.numero_legajo}` : 'Sin N° asignado'} · {legajo.tipo_carrera || 'Carrera no definida'}
          </div>

          {/* Línea de tiempo (Track) */}
          <div className="workflow-track">
            <div className="wf-line-bg"></div>
            <div className="wf-line-fill" style={{ width: 'calc(75% - 18px)' }}></div>
            
            <div className="wf-step">
              <div className="wf-node done">✓</div>
              <div className="wf-label">Solicitud</div>
            </div>
            <div className="wf-step">
              <div className="wf-node done">✓</div>
              <div className="wf-label">Documentos</div>
            </div>
            <div className="wf-step">
              <div className="wf-node done">✓</div>
              <div className="wf-label">Validación</div>
            </div>
            <div className="wf-step">
              <div className="wf-node active">4</div>
              <div className="wf-label">Revisión académica</div>
            </div>
            <div className="wf-step">
              <div className="wf-node pending">5</div>
              <div className="wf-label">Matriculación</div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '20px' }}>
            Estado actual: <strong>{legajo.estado}</strong>
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
            <button className="btn primary" onClick={() => console.log('Avanzar')}>
              Avanzar de Estado
            </button>
            <button className="btn" onClick={() => console.log('Devolver')}>
              ← Devolver
            </button>
          </div>

        </div>
      </div>
    </>
  );
};