import { useState, type SyntheticEvent } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import Header from '../components/Header';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import VentanaEmergente from '../../shared/components/VentanaEmergente';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ usuario, contrasena, recordarme });
  };

  return (
    <div className="screen-shell">
      <div className="screen-card">

        <Header onBack={() => console.log('volver')} />

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-8">
          <Input
            icon={<User size={18} />}
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <Input
            icon={<Lock size={18} />}
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <Button type="submit">Ingresar</Button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowForgotModal(true);
            }}
            className="text-center text-sm font-medium text-ink-secondary transition-colors hover:text-brand-500"
          >
            ¿Olvidaste tu contraseña?
          </a>

          <Checkbox
            checked={recordarme}
            onChange={() => setRecordarme(!recordarme)}
            label="Recordarme"
          />
        </form>

        <VentanaEmergente
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
          title="Recuperar contraseña"
        >
          <p className="text-sm text-ink-secondary">
            Ingresá tu email y te enviamos un link para recuperar tu contraseña.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              icon={<Mail size={18} />}
              placeholder="Email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
            />
            <Button
              onClick={() => {
                console.log('recuperar contraseña para:', recoveryEmail);
                setShowForgotModal(false);
              }}
            >
              Enviar
            </Button>
          </div>
        </VentanaEmergente>
      </div>
    </div>
  );
}