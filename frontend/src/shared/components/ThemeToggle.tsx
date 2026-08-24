import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      aria-label="Cambiar tema"
      className="flex items-center gap-1.5 rounded-full border border-line bg-paper-surface px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-secondary transition-colors hover:bg-paper-elevated"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>MODO {isDark ? 'CLARO' : 'OSCURO'}</span>
    </button>
  );
}