import { useState } from 'react';

// 1. Importamos el componente base que pidió tu equipo
import { Sidebar } from './shared/components/Sidebar'; 

// 2. Importamos todos los módulos del equipo para NO perder el trabajo de nadie
import LoginScreen from './Login/pages/Login';
import LegajoPage from './Legajo/pages/LegajoPage';
import NotificacionesScreen from './AlertasNotificaciones/pages/Alerta';

// 3. Importamos tus componentes locales
import { NotificacionesPanel } from './components/NotificacionesPanel';
import TestLegajos from './TestLegajos';

function App() {
  // Estado para probar tu panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      
      {/* Barra lateral izquierda de Anna */}
      <Sidebar />

      {/* Área principal derecha */}
      <div style={{ flex: 1, position: 'relative', padding: '20px' }}>
        
        {/* 
          MÓDULOS DEL EQUIPO: 
          Descomenta (quítale las barras //) al que necesites probar. 
          Están todos a salvo aquí para no romper el trabajo de nadie.
        */}
        
        {/* <LoginScreen /> */}
        <LegajoPage />
        {/* <NotificacionesScreen /> */}


        {/* 
          TU PANEL DE PRUEBA:
          Puedes descomentar esto cuando necesites ver tu cajón de notificaciones
        */}
        {/*
        <button onClick={() => setIsPanelOpen(true)}>
          🔔 Abrir Notificaciones
        </button>
        <NotificacionesPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
        <TestLegajos />
        */}
        
      </div>
    </div>
  );
}

export default App;