"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-30 md:border-r md:border-zinc-200 md:bg-white">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-zinc-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
          B
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-zinc-900">BIZOS</span>
          <span className="text-[10px] text-zinc-500 -mt-0.5">Business Operating System</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white">
        <div className="text-xs opacity-80 mb-1">Hiệu suất công ty</div>
        <div className="text-2xl font-bold">87%</div>
        <div className="text-[11px] opacity-80 mt-1">Vượt mục tiêu tháng này</div>
      </div>
    </aside>
  );
}
