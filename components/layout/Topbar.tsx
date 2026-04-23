"use client";

import { Bell, Search, Calendar, ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { t as rawT, type Locale } from "@/lib/i18n/dict";

export function Topbar({
  userEmail,
  locale = "vi",
}: {
  userEmail?: string | null;
  locale?: Locale;
}) {
  const initials = (userEmail ?? "U").slice(0, 1).toUpperCase();
  const t = (k: Parameters<typeof rawT>[1]) => rawT(locale, k);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 bg-white/85 px-5 backdrop-blur ring-1 ring-zinc-100 md:ml-56">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <Input placeholder={t("topbar.search")} className="pl-8 h-8 text-[13px]" />
        </div>
      </div>

      <button className="hidden sm:flex items-center gap-1.5 rounded-lg bg-zinc-50 px-2.5 py-1 text-[12px] text-zinc-700 hover:bg-zinc-100">
        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
        <span>{t("topbar.period")}</span>
        <ChevronDown className="h-3 w-3 text-zinc-400" />
      </button>

      <Link
        href="/guide"
        className="hidden sm:flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        {t("topbar.guide")}
      </Link>

      <LocaleSwitcher locale={locale} />

      <button className="relative rounded-md p-1.5 text-zinc-500 hover:bg-zinc-50">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[12px] font-semibold text-white">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col text-[11px] leading-tight">
          <span className="font-semibold text-zinc-900">{userEmail ?? "Guest"}</span>
          <span className="text-zinc-500">CEO</span>
        </div>
      </div>
    </header>
  );
}
