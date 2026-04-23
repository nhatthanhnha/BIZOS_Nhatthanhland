import { createClientOrNull } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClientOrNull();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />
      <Topbar userEmail={user?.email ?? "demo@bizos.local"} />
      <main className="md:ml-60 p-6">{children}</main>
    </div>
  );
}
