type AuthPrimaryButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
};

export default function AuthPrimaryButton({ children, type = "submit" }: AuthPrimaryButtonProps) {
  return (
    <button
      type={type}
      className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-sky-600 dark:hover:bg-sky-500 transition-colors shadow-lg shadow-emerald-600/20 dark:shadow-sky-900/30"
    >
      {children}
    </button>
  );
}
