import { createClientOrNull } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [supabase, locale] = await Promise.all([createClientOrNull(), getLocale()]);
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Sidebar locale={locale} />
      <Topbar userEmail={user?.email ?? "demo@bizos.local"} locale={locale} />
      <main className="md:ml-56 px-5 py-4 flex-1">{children}</main>
      <div className="md:ml-56">
        <Footer locale={locale} />
      </div>
    </div>
  );
}
