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
    <div className="flex h-screen w-full bg-paper-surface overflow-hidden">
      
      {/* Sidebar compartido con sus props requeridas */}
      <Sidebar 
        user={currentUser}
        items={menuItems}
        currentPath={currentPath}
        onNavigate={(href) => setCurrentPath(href)}
      />

      {/* Área principal derecha con estilos de Tailwind en común */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-zinc-900">
        {currentPath === '/legajos' ? (
          <LegajoPage />
        ) : (
          <div className="text-ink dark:text-white p-4">
            <h2 className="text-xl font-bold">Bienvenido al sistema</h2>
            <p>Selecciona una opción en el menú lateral.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;