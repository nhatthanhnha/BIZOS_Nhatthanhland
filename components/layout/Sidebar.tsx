"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { t as rawT, type Locale } from "@/lib/i18n/dict";
import { cn } from "@/lib/utils";

export function Sidebar({ locale = "vi" }: { locale?: Locale }) {
  const pathname = usePathname();
  const t = (key: Parameters<typeof rawT>[1]) => rawT(locale, key);

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-30 md:bg-white md:ring-1 md:ring-zinc-100">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-zinc-100">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">
          B
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-zinc-900">BIZOS</span>
          <span className="text-[9px] text-zinc-500 -mt-0.5">{t("brand.tagline")}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 p-3 text-white">
        <div className="text-[10px] opacity-80 mb-0.5">{t("sidebar.perf")}</div>
        <div className="text-xl font-bold leading-tight">87%</div>
        <div className="text-[10px] opacity-80 mt-0.5 leading-tight">{t("sidebar.perfHint")}</div>
      </div>
    </aside>
  );
}
