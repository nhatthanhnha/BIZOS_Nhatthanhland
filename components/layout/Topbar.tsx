"use client";

import { Bell, Search, Calendar, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar({ userEmail }: { userEmail?: string | null }) {
  const initials = (userEmail ?? "U").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white/80 px-6 backdrop-blur md:ml-60">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Tìm kiếm nhân sự, KPI, phòng ban..." className="pl-9 h-9" />
        </div>
      </div>

      <button className="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50">
        <Calendar className="h-4 w-4 text-zinc-500" />
        <span>Tháng 04/2026</span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
      </button>

      <button className="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col text-xs leading-tight">
          <span className="font-medium text-zinc-900">{userEmail ?? "Guest"}</span>
          <span className="text-zinc-500">CEO</span>
        </div>
      </div>
    </header>
  );
}
