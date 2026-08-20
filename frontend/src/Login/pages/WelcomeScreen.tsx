import { PenLine, ClipboardList } from 'lucide-react';
import Button from '../components/Button';
import Header from '../components/Header';
import './WelcomeScreen.css';
import ThemeToggle from '../components/ThemeToggle';

export default function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <Header onBack={() => console.log('volver')} />
      <h1>Bienvenido Usuario</h1>
      <Button 
      icon={<PenLine size={18} />}
      onClick={() => console.log('Nueva inscripción')}>
        Nueva inscripción
      </Button>
      <Button 
       icon={<ClipboardList size={18} />}
       onClick={() => console.log('Consultar Estado')}>
        Consultar Estado
      </Button>

     <ThemeToggle />
    </div>
  
  );
   
}