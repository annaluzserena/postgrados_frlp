<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import TestLegajos from './TestLegajos'
import { NotificacionesPanel } from './components/NotificacionesPanel'
import './App.css'
=======

/*import WelcomeScreen from './Login/pages/WelcomeScreen';

function App() {
  return (
    <WelcomeScreen />
  );
}


>>>>>>> 65976713284f276a5e58ff2a0e13a65f7d815a05

// Importación que agregó tu compañero (rama main)
import LoginScreen from './Login/pages/Login';

function App() {
  return (
HEAD
    <>
        {/* Pantalla de login de tu compañero */}
        <LoginScreen />

        {/* Tu panel y componentes de prueba */}
        <NotificacionesPanel/>
        <TestLegajos/>      
    </>
  )
}
=======
    <LoginScreen />
  );
}*/
>>>>>>> 65976713284f276a5e58ff2a0e13a65f7d815a05


import NotificacionesScreen from './AlertasNotificaciones/pages/Alerta';

function App() {
  return (
    <NotificacionesScreen />
  );
}
export default App;