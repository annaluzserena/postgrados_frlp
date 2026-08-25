import { useState } from 'react';
import { Sidebar } from './shared/components/Sidebar'; 
import LegajoPage from './Legajo/pages/LegajoPage';
import type { MenuItem, User } from './shared/types/types';
import { FileText, Home } from 'lucide-react'; // O los iconos que usen para el menú

function App() {
  // Ruta actual simulada para que el Sidebar sepa dónde estás parado
  const [currentPath, setCurrentPath] = useState('/legajos');

  // Mock temporal del usuario activo (ajustalo según los types de tu shared)
  const currentUser: User = {
    id: '1',
    nombre: 'Coordinador Fénix',
    email: 'admin@utn.edu.ar',
    rol: 'coordinador', // o el rol que manejen en types
  };

  // Ítems de prueba para el menú lateral que exige el Sidebar
  const menuItems: MenuItem[] = [
    {
      id: '1',
      label: 'Inicio',
      href: '/dashboard',
      icon: Home,
    },
    {
      id: '2',
      label: 'Legajos',
      href: '/legajos',
      icon: FileText,
      roles: ['coordinador', 'admin'], // visible según rol
    },
  ];

  return (
    <LoginScreen />
  );
}


import NotificacionesScreen from './AlertasNotificaciones/pages/Alerta';

function App() {
  return (
    <NotificacionesScreen />
  );
}
export default App;*/

import  Dashboard from './dashboard-coordinador/pages/Dashboard';

function App() {  
   return (
    <Dashboard />
  );
}
export default App;