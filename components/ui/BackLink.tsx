import Link from "next/link";

type BackLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function BackLink({ href, children, className = "" }: BackLinkProps) {
  return (
    <p className={`mt-8 text-center ${className}`}>
      <Link
        href={href}
        className="text-sm font-semibold text-slate-500 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-sky-400 transition-colors"
      >
        {children}
      </Link>
    </p>
  );
}
