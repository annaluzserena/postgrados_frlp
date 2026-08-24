import { Check } from 'lucide-react';
import './Checkbox.css';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="login-checkbox">
      <div 
        className={`checkbox ${checked ? 'checked' : ''}`}
        onClick={onChange}
      >
        {checked && <Check size={16} />}
      </div>
      <span>{label}</span>
    </label>
  );
}