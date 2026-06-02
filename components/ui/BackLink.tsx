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
        className="inline-flex min-h-11 items-center justify-center rounded-md px-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-sky-300 transition-colors"
      >
        {children}
      </Link>
    </p>
  );
}
