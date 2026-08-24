import { ArrowLeft } from 'lucide-react';
import LogoFenix from '../../assets/LogoFenix.png'; 
import ThemeToggle from '../../shared/components/ThemeToggle';

interface HeaderProps {
  onBack?: () => void;
}

export default function Header({ onBack }: HeaderProps) {
  return (
    <header className="flex flex-col items-center px-6 pt-6 pb-4">
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded-full border border-line bg-paper-surface px-3 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-paper-elevated"
        >
          <ArrowLeft size={16} />
          Salir
        </button>

        <ThemeToggle />
      </div>

      <div className="mt-4 flex w-full flex-col items-center">
        <img src={LogoFenix} alt="" className="h-20 w-auto object-contain" />
        <div className="relative flex w-full items-center justify-center">
     </div>
      </div>
    </header>
  );
}