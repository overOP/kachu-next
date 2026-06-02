type AuthPrimaryButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function AuthPrimaryButton({
  children,
  type = "submit",
  disabled = false,
  onClick,
}: AuthPrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-sky-600 dark:hover:bg-sky-500 transition-colors shadow-lg shadow-emerald-600/20 dark:shadow-sky-900/30"
    >
      {children}
    </button>
  );
}
