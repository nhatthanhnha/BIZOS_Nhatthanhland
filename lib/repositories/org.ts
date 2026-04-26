import * as demo from "@/lib/queries/demo";
import { writeAuditLog } from "@/lib/repositories/audit";
import { getAuthenticatedUser, getDbClientOrThrow, getUserContext, withDemoFallback } from "@/lib/repositories/shared";
import { hasSupabaseEnv } from "@/lib/env";

export async function listDepartments() {
  return withDemoFallback(demo.demoDepartments, async (db) => {
    const { data, error } = await db.from("departments").select("*").order("name");
    if (error) throw error;
    return data ?? [];
  });
}

export async function listEmployees() {
  return withDemoFallback(demo.demoEmployees, async (db) => {
    const { data, error } = await db.from("employees").select("*").order("full_name");
    if (error) throw error;
    return data ?? [];
  });
}

export async function getCompany() {
  return withDemoFallback(demo.demoCompany, async (db) => {
    const { data, error } = await db.from("companies").select("*").limit(1).maybeSingle();
    if (error) throw error;
    if (!data) return demo.demoCompany;
    return data;
  });
}

export async function createDepartment(input: {
  name: string;
  code: string;
  scope?: string;
  budgetMonthly: number;
  headEmployeeId?: string;
}) {
  const user = await getAuthenticatedUser();
  const context = await getUserContext(user);
  if (!context.companyId) return;

  const db = await getDbClientOrThrow();
  const departmentsTable = db.from("departments") as unknown as {
    insert: (values: Record<string, unknown>) => {
      select: (columns: string) => { single: () => Promise<{ data: { id: string } | null }> };
    };
  };

  const payload = {
    company_id: context.companyId,
    name: input.name,
    code: input.code || null,
    scope: input.scope || null,
    budget_monthly: input.budgetMonthly,
    head_employee_id: input.headEmployeeId || null,
  };

  const { data } = await departmentsTable.insert(payload).select("id").single();
  await writeAuditLog({
    action: "department.create",
    entity: "departments",
    entityId: data?.id ?? null,
    after: payload,
  });
}

export async function createEmployee(input: {
  fullName: string;
  email: string;
  departmentId?: string;
  managerId?: string;
  baseSalary: number;
  employmentType?: string;
}) {
  const user = await getAuthenticatedUser();
  const context = await getUserContext(user);
  if (!context.companyId) return;

  const db = await getDbClientOrThrow();
  const employeesTable = db.from("employees") as unknown as {
    insert: (values: Record<string, unknown>) => {
      select: (columns: string) => { single: () => Promise<{ data: { id: string } | null }> };
    };
  };

  const payload = {
    company_id: context.companyId,
    full_name: input.fullName,
    email: input.email || null,
    department_id: input.departmentId || null,
    manager_id: input.managerId || null,
    base_salary: input.baseSalary,
    employment_type: input.employmentType || "fulltime",
    status: "active",
  };

  const { data } = await employeesTable.insert(payload).select("id").single();
  await writeAuditLog({
    action: "employee.create",
    entity: "employees",
    entityId: data?.id ?? null,
    after: payload,
  });
}

export async function updateCompanySettings(input: {
  name: string;
  code: string;
  currency: string;
  timezone: string;
}) {
  if (!hasSupabaseEnv()) {
    throw new Error("Chưa cấu hình Supabase. Vui lòng thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào Vercel.");
  }

  const db = await getDbClientOrThrow();

  // Resolve company ID: prefer user-scoped context, fall back to first company row
  const user = await getAuthenticatedUser();
  const context = await getUserContext(user);
  let companyId = context.companyId;

  if (!companyId) {
    type CompanyIdRow = { id: string };
    const { data } = await (db.from("companies") as unknown as {
      select: (cols: string) => {
        limit: (n: number) => {
          maybeSingle: () => Promise<{ data: CompanyIdRow | null }>;
        };
      };
    }).select("id").limit(1).maybeSingle();
    companyId = data?.id ?? null;
  }

  if (!companyId) throw new Error("Không tìm thấy công ty. Vui lòng kiểm tra cơ sở dữ liệu.");

  // database.types.ts only defines Row (no Update type) — cast required to call .update()
  const companiesTable = db.from("companies") as unknown as {
    update: (values: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
    };
  };

  const { error } = await companiesTable.update({
    name: input.name,
    code: input.code || null,
    currency: input.currency,
    timezone: input.timezone,
  }).eq("id", companyId);

  if (error) throw new Error(error.message);

  try {
    await writeAuditLog({
      action: "company.update",
      entity: "companies",
      entityId: companyId,
      after: input,
    });
  } catch {
    // audit log failure should not block the save
  }
}
