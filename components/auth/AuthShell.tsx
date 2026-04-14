import SiteShell from "@/components/layout/SiteShell";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </SiteShell>
  );
}
