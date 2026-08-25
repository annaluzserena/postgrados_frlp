import { ArrowLeft, GraduationCap } from "lucide-react";

interface WizardHeaderProps {
  onBack?: () => void;
}

export function WizardHeader({ onBack }: WizardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-line bg-paper px-5 py-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-ink-secondary transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        VOLVER
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
          <GraduationCap className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div className="text-right leading-tight">
          <p className="text-sm font-extrabold tracking-wide text-ink">FENIX</p>
          <p className="text-[10px] font-medium tracking-wide text-ink-muted">
            POSGRADO
          </p>
        </div>
      </div>
    </header>
  );
}
