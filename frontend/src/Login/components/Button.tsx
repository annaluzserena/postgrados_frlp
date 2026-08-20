import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function Button({
  children,
  icon,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="login-button"
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
}