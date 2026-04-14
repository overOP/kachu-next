import Navbar from "../Navbar";

type SiteShellProps = {
  children: React.ReactNode;
  /** Use false for edge cases (e.g. embedded previews). Default: true */
  withGrain?: boolean;
};

export default function SiteShell({ children, withGrain = true }: SiteShellProps) {
  return (
    <main className={withGrain ? "grain min-h-screen" : "min-h-screen"}>
      <Navbar />
      <div className="pt-16">{children}</div>
    </main>
  );
}
