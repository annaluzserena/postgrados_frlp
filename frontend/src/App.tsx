import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import TestLegajos from './TestLegajos'
import { NotificacionesPanel } from './components/NotificacionesPanel'
import './App.css'

// Importación que agregó tu compañero (rama main)
import LoginScreen from './Login/pages/Login';

function App() {
  return (
    <>
        {/* Pantalla de login de tu compañero */}
        <LoginScreen />

        {/* Tu panel y componentes de prueba */}
        <NotificacionesPanel/>
        <TestLegajos/>      
    </>
  )
}

export default App;