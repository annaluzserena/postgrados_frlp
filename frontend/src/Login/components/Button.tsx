
interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function Button({ children, icon, onClick, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-600 active:bg-brand-700"
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );

}