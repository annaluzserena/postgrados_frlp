import { ArrowLeft } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onBack?: () => void;
}

export default function Header({ onBack }: HeaderProps) {
  return (
    <header className="login-header">
      <div className="header-top">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={16} />
          Volver
        </button>

        <div className="logo-slot">
          {/* <img src={fenixLogo} alt="Fénix Posgrado" className="logo-img" /> */}
          <span className="logo-text">FENIX</span>
          <span className="logo-subtitle">POSGRADO</span>
        </div>
      </div>

      <div className="accent-line" />
    </header>
  );
}