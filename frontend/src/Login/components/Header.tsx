import { ArrowLeft } from 'lucide-react';
import './Header.css';
import FenixLogo from '../../assets/LogoFenix.png';
import ThemeToggle from '../../shared/components/ThemeToggle';

interface HeaderProps {
  onBack?: () => void;
}

export default function Header({ onBack }: HeaderProps) {
  return (
    <header className="login-header">
      <div className="header-top">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={16} />
          Salir 
        </button>
  <ThemeToggle />

      </div>

      <div className="line-logo-wrapper">
        <div className="accent-line" />
        <div className="logo-slot">
          <img src={FenixLogo} alt="Fénix Posgrado" className="logo-img" />
        </div>
      </div>
    </header>
  );
}

