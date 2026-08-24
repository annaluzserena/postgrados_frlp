import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setIsDark(!isDark)}
      aria-label="Cambiar tema"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span>
        MODO {isDark ? 'CLARO ': 'OSCURO '}
      </span>
    </button>
  );
}