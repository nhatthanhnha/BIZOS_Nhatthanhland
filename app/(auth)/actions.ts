"use server";

import { redirect } from "next/navigation";
import { createClientOrNull, hasSupabaseEnv } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/env";

function encodeError(err: string, path: string) {
  const url = new URL(path, "http://app");
  url.searchParams.set("error", err);
  return `${url.pathname}?${url.searchParams.toString()}`;
}

const DEMO_MSG =
  "Demo mode: chưa cấu hình Supabase (.env.local). Anh có thể duyệt mọi trang bằng data mẫu.";

export async function login(formData: FormData): Promise<void> {
  if (!hasSupabaseEnv() || isDemoMode()) {
    redirect("/dashboard");
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    redirect(encodeError("Vui lòng nhập email và mật khẩu.", "/login"));
  }

  let supabase;
  try {
    supabase = (await createClientOrNull())!;
  } catch (e) {
    redirect(encodeError("Không thể kết nối Supabase. Kiểm tra lại NEXT_PUBLIC_SUPABASE_URL và ANON_KEY trong .env.local.", "/login"));
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    let msg = error.message;
    if (msg === "Invalid login credentials") {
      msg = "Sai email hoặc mật khẩu. Kiểm tra lại tài khoản đã tạo trên Supabase.";
    } else if (msg.toLowerCase().includes("email not confirmed")) {
      msg = "Email chưa được xác nhận. Vào Supabase → Authentication → Users → click user → Confirm email.";
    } else if (msg.toLowerCase().includes("network")) {
      msg = "Lỗi kết nối mạng tới Supabase: " + msg;
    }
    redirect(encodeError(msg, "/login"));
  }

  if (!data.user) {
    redirect(encodeError("Đăng nhập thất bại — không nhận được user từ Supabase.", "/login"));
  }

  redirect(next || "/dashboard");
}

export async function signup(formData: FormData): Promise<void> {
  if (!hasSupabaseEnv() || isDemoMode()) {
    redirect("/dashboard");
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");

  const supabase = (await createClientOrNull())!;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect(encodeError(error.message, "/signup"));
  }

  redirect("/login?registered=1");
}

export async function logout(): Promise<void> {
  const supabase = await createClientOrNull();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export async function sendReset(formData: FormData): Promise<void> {
  if (!hasSupabaseEnv() || isDemoMode()) {
    redirect(encodeError(DEMO_MSG, "/reset-password"));
  }

  const email = String(formData.get("email") ?? "");
  const supabase = (await createClientOrNull())!;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    redirect(encodeError(error.message, "/reset-password"));
  }
  redirect("/reset-password?sent=1");
}
