import { createClientOrNull } from "@/lib/supabase/server";
import * as demo from "./demo";

// Khi chưa cấu hình Supabase, trả demo dataset để UI vẫn render được.
// Khi có Supabase, query thật + fallback demo nếu lỗi/không có data.

async function safeFetch<T>(
  query: (sb: NonNullable<Awaited<ReturnType<typeof createClientOrNull>>>) => Promise<{ data: unknown }>,
  fallback: T,
): Promise<T> {
  try {
    const sb = await createClientOrNull();
    if (!sb) return fallback;
    const { data } = await query(sb);
    if (!data || (Array.isArray(data) && data.length === 0)) return fallback;
    return data as T;
  } catch {
    return fallback;
  }
}

export async function fetchEmployees() {
  return safeFetch((sb) => sb.from("employees").select("*").order("full_name"), demo.demoEmployees);
}

export async function fetchDepartments() {
  return safeFetch((sb) => sb.from("departments").select("*").order("name"), demo.demoDepartments);
}

export async function fetchKpis() {
  return safeFetch((sb) => sb.from("kpis").select("*"), demo.demoKpis);
}

export async function fetchKpiActuals(period = "2026-04") {
  return safeFetch((sb) => sb.from("kpi_actuals").select("*").eq("period", period), demo.demoKpiActuals);
}

export async function fetchKpiTargets(period = "2026-04") {
  return safeFetch((sb) => sb.from("kpi_targets").select("*").eq("period", period), demo.demoKpiTargets);
}

export async function fetchTasks() {
  return safeFetch((sb) => sb.from("tasks").select("*").order("due_date"), demo.demoTasks);
}

export async function fetchPayroll() {
  return safeFetch((sb) => sb.from("payroll_entries").select("*"), demo.demoPayroll);
}

export async function fetchProjects() {
  return safeFetch((sb) => sb.from("projects").select("*"), demo.demoProjects);
}

export async function fetchAccounting() {
  return safeFetch(
    (sb) => sb.from("accounting_entries").select("*").order("entry_date", { ascending: false }),
    demo.demoAccounting,
  );
}

export async function fetchAlerts() {
  return safeFetch(
    (sb) =>
      sb.from("alerts").select("*").is("resolved_at", null).order("created_at", { ascending: false }),
    demo.demoAlerts,
  );
}

export async function fetchApprovals() {
  return safeFetch(
    (sb) => sb.from("approvals").select("*").order("created_at", { ascending: false }),
    demo.demoApprovals,
  );
}

export async function fetchObjectives() {
  return safeFetch((sb) => sb.from("objectives").select("*"), demo.demoObjectives);
}

export async function fetchKeyResults() {
  return safeFetch((sb) => sb.from("key_results").select("*"), demo.demoKeyResults);
}

export async function fetchRequisitions() {
  return safeFetch((sb) => sb.from("job_requisitions").select("*"), demo.demoRequisitions);
}

export async function fetchSops() {
  return safeFetch((sb) => sb.from("sop_documents").select("*"), demo.demoSops);
}

export async function fetchAuditLogs() {
  return safeFetch(
    (sb) => sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
    demo.demoAuditLogs,
  );
}

export { demo };
