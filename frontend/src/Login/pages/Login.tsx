import { useState, type SyntheticEvent } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import Header from '../components/Header';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import './Login.css';
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
    <div className="login-screen">
      <Header onBack={() => console.log('volver')} />
    
      <form onSubmit={handleSubmit} className="login-form">
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

        <a href="#" className="forgot-link"
         onClick={(e) => {
         e.preventDefault();
         setShowForgotModal(true);
    }}
        >
          ¿Olvidaste tu contraseña?
        </a>

        <Checkbox
          checked={recordarme}
          onChange={() => setRecordarme(!recordarme)}
          label="Recordar"
        />
      </form>

      <VentanaEmergente
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Recuperar contraseña"
      >
        <p>Ingresá tu email y te enviamos un link para recuperar tu contraseña.</p>
        <div className="modal-form">
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
      </VentanaEmergente >
    </div>
  );
}