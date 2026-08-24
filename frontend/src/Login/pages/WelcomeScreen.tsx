import { PenLine, ClipboardList } from 'lucide-react';
import Button from '../components/Button';
import Header from '../components/Header';

export default function WelcomeScreen() {
  return (
    <div className="screen-shell">
      <div className="screen-card">
        <Header onBack={() => console.log('volver')} />

        <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-2">
          <h1 className="text-center">Bienvenido Usuario</h1>

          <Button
            icon={<PenLine size={18} />}
            onClick={() => console.log('Nueva inscripción')}
          >
            Nueva inscripción
          </Button>

          <Button
            icon={<ClipboardList size={18} />}
            onClick={() => console.log('Consultar Estado')}
          >
            Consultar Estado
          </Button>
        </div>
      </div>
    </div>
  );
}