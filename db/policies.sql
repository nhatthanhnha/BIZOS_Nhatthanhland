-- =============================================================================
-- BIZOS — Row-Level Security policies
-- Role matrix: ceo, cfo, hr_admin, dept_head, team_lead, employee, auditor
-- =============================================================================

create or replace function current_company_id() returns uuid
language sql stable as $$
  select company_id from public.user_roles
  where auth_user_id = auth.uid()
  order by created_at asc
  limit 1;
$$;

create or replace function has_role(target app_role) returns boolean
language sql stable as $$
  select exists (
    select 1 from public.user_roles
    where auth_user_id = auth.uid()
      and company_id = current_company_id()
      and role = target
  );
$$;

create or replace function has_any_role(variadic roles app_role[]) returns boolean
language sql stable as $$
  select exists (
    select 1 from public.user_roles
    where auth_user_id = auth.uid()
      and company_id = current_company_id()
      and role = any(roles)
  );
$$;

create or replace function current_employee_id() returns uuid
language sql stable as $$
  select id from public.employees
  where auth_user_id = auth.uid()
    and company_id = current_company_id()
  limit 1;
$$;

create or replace function is_dept_head_of(dept uuid) returns boolean
language sql stable as $$
  select exists (
    select 1 from public.user_roles
    where auth_user_id = auth.uid()
      and company_id = current_company_id()
      and role = 'dept_head'
      and (scope_department_id = dept or scope_department_id is null)
  );
$$;

-- =============================================================================
-- Enable RLS + generic company_id policies (tables that HAVE company_id column)
-- =============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'business_units','departments','teams','positions',
    'employees','employee_reporting_lines','employment_contracts','user_roles',
    'kpis','kpi_audit_logs',
    'sla_rules','tasks','workload_snapshots',
    'compensation_plans','salary_components','bonus_rules','commission_rules',
    'payroll_periods','payroll_entries','adjustment_entries',
    'projects',
    'chart_of_accounts','cost_centers','accounting_entries','budgets',
    'ar_ap_records','cashflow_records','financial_snapshots',
    'objectives',
    'job_requisitions','candidates','skill_matrix','training_needs',
    'sop_documents','playbooks','checklists',
    'approvals','alert_rules','alerts','reports','report_schedules',
    'notifications','audit_logs',
    'integrations','import_jobs','app_settings','user_preferences','user_sessions'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists tenant_select on public.%I;', t);
    execute format(
      'create policy tenant_select on public.%I for select using (company_id = current_company_id());', t
    );
  end loop;
end $$;

-- =============================================================================
-- Child tables WITHOUT company_id — RLS via parent join
-- =============================================================================

-- kpi_formulas → kpis
alter table public.kpi_formulas enable row level security;
drop policy if exists tenant_select on public.kpi_formulas;
create policy tenant_select on public.kpi_formulas for select using (
  exists (select 1 from public.kpis k where k.id = kpi_id and k.company_id = current_company_id())
);

-- kpi_dependencies → kpis
alter table public.kpi_dependencies enable row level security;
drop policy if exists tenant_select on public.kpi_dependencies;
create policy tenant_select on public.kpi_dependencies for select using (
  exists (select 1 from public.kpis k where k.id = parent_kpi_id and k.company_id = current_company_id())
);

-- kpi_targets → kpis
alter table public.kpi_targets enable row level security;
drop policy if exists tenant_select on public.kpi_targets;
create policy tenant_select on public.kpi_targets for select using (
  exists (select 1 from public.kpis k where k.id = kpi_id and k.company_id = current_company_id())
);

-- kpi_actuals → kpis
alter table public.kpi_actuals enable row level security;
drop policy if exists tenant_select on public.kpi_actuals;
create policy tenant_select on public.kpi_actuals for select using (
  exists (select 1 from public.kpis k where k.id = kpi_id and k.company_id = current_company_id())
);

-- kpi_thresholds → kpis
alter table public.kpi_thresholds enable row level security;
drop policy if exists tenant_select on public.kpi_thresholds;
create policy tenant_select on public.kpi_thresholds for select using (
  exists (select 1 from public.kpis k where k.id = kpi_id and k.company_id = current_company_id())
);

-- task_recurrences → tasks
alter table public.task_recurrences enable row level security;
drop policy if exists tenant_select on public.task_recurrences;
create policy tenant_select on public.task_recurrences for select using (
  exists (select 1 from public.tasks t where t.id = task_id and t.company_id = current_company_id())
);

-- task_outputs → tasks
alter table public.task_outputs enable row level security;
drop policy if exists tenant_select on public.task_outputs;
create policy tenant_select on public.task_outputs for select using (
  exists (select 1 from public.tasks t where t.id = task_id and t.company_id = current_company_id())
);

-- task_status_logs → tasks
alter table public.task_status_logs enable row level security;
drop policy if exists tenant_select on public.task_status_logs;
create policy tenant_select on public.task_status_logs for select using (
  exists (select 1 from public.tasks t where t.id = task_id and t.company_id = current_company_id())
);

-- project_members → projects
alter table public.project_members enable row level security;
drop policy if exists tenant_select on public.project_members;
create policy tenant_select on public.project_members for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.company_id = current_company_id())
);

-- project_milestones → projects
alter table public.project_milestones enable row level security;
drop policy if exists tenant_select on public.project_milestones;
create policy tenant_select on public.project_milestones for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.company_id = current_company_id())
);

-- project_budgets → projects
alter table public.project_budgets enable row level security;
drop policy if exists tenant_select on public.project_budgets;
create policy tenant_select on public.project_budgets for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.company_id = current_company_id())
);

-- project_roi_records → projects
alter table public.project_roi_records enable row level security;
drop policy if exists tenant_select on public.project_roi_records;
create policy tenant_select on public.project_roi_records for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.company_id = current_company_id())
);

-- project_dependencies → projects
alter table public.project_dependencies enable row level security;
drop policy if exists tenant_select on public.project_dependencies;
create policy tenant_select on public.project_dependencies for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.company_id = current_company_id())
);

-- budget_lines → budgets
alter table public.budget_lines enable row level security;
drop policy if exists tenant_select on public.budget_lines;
create policy tenant_select on public.budget_lines for select using (
  exists (select 1 from public.budgets b where b.id = budget_id and b.company_id = current_company_id())
);

-- key_results → objectives
alter table public.key_results enable row level security;
drop policy if exists tenant_select on public.key_results;
create policy tenant_select on public.key_results for select using (
  exists (select 1 from public.objectives o where o.id = objective_id and o.company_id = current_company_id())
);

-- okr_alignments → objectives
alter table public.okr_alignments enable row level security;
drop policy if exists tenant_select on public.okr_alignments;
create policy tenant_select on public.okr_alignments for select using (
  exists (select 1 from public.objectives o where o.id = objective_id and o.company_id = current_company_id())
);

-- approval_steps → approvals
alter table public.approval_steps enable row level security;
drop policy if exists tenant_select on public.approval_steps;
create policy tenant_select on public.approval_steps for select using (
  exists (select 1 from public.approvals a where a.id = approval_id and a.company_id = current_company_id())
);

-- =============================================================================
-- companies — uses "id" as PK, not company_id
-- =============================================================================
alter table public.companies enable row level security;
drop policy if exists tenant_select on public.companies;
create policy tenant_select on public.companies
for select using (id = current_company_id());

drop policy if exists companies_write on public.companies;
create policy companies_write on public.companies
for all using (id = current_company_id() and has_role('ceo'))
with check (id = current_company_id() and has_role('ceo'));

-- =============================================================================
-- Specific writes
-- =============================================================================

-- Departments, teams, positions, business_units: CEO or HR admin writes.
do $$
declare t text;
begin
  foreach t in array array['business_units','departments','teams','positions']
  loop
    execute format('drop policy if exists %I_write on public.%I;', t, t);
    execute format($f$
      create policy %I_write on public.%I
      for all using (company_id = current_company_id() and has_any_role('ceo','hr_admin'))
      with check (company_id = current_company_id() and has_any_role('ceo','hr_admin'));
    $f$, t, t);
  end loop;
end $$;

-- Employees: CEO/HR admin writes. Each employee can update their own row.
drop policy if exists employees_write_admin on public.employees;
create policy employees_write_admin on public.employees
for all using (company_id = current_company_id() and has_any_role('ceo','hr_admin'))
with check (company_id = current_company_id() and has_any_role('ceo','hr_admin'));

drop policy if exists employees_self_update on public.employees;
create policy employees_self_update on public.employees
for update using (auth_user_id = auth.uid() and company_id = current_company_id())
with check (auth_user_id = auth.uid() and company_id = current_company_id());

-- KPIs: CEO/CFO/dept_head write.
drop policy if exists kpis_write on public.kpis;
create policy kpis_write on public.kpis
for all using (company_id = current_company_id() and has_any_role('ceo','cfo','hr_admin','dept_head'))
with check (company_id = current_company_id() and has_any_role('ceo','cfo','hr_admin','dept_head'));

-- Tasks: assignee/reviewer/dept_head/ceo can see. Assignee/manager can write.
drop policy if exists tasks_select on public.tasks;
create policy tasks_select on public.tasks
for select using (
  company_id = current_company_id()
  and (
    has_any_role('ceo','cfo','hr_admin','auditor')
    or assignee_id = current_employee_id()
    or reviewer_id = current_employee_id()
    or (department_id is not null and is_dept_head_of(department_id))
  )
);

drop policy if exists tasks_write on public.tasks;
create policy tasks_write on public.tasks
for all using (
  company_id = current_company_id()
  and (
    has_any_role('ceo','hr_admin','dept_head','team_lead')
    or assignee_id = current_employee_id()
  )
) with check (company_id = current_company_id());

-- Payroll entries: CEO/CFO/HR admin read all. Employee can read own only.
drop policy if exists payroll_entries_select on public.payroll_entries;
create policy payroll_entries_select on public.payroll_entries
for select using (
  company_id = current_company_id()
  and (
    has_any_role('ceo','cfo','hr_admin','auditor')
    or employee_id = current_employee_id()
  )
);

drop policy if exists payroll_entries_write on public.payroll_entries;
create policy payroll_entries_write on public.payroll_entries
for all using (company_id = current_company_id() and has_any_role('ceo','cfo','hr_admin'))
with check (company_id = current_company_id() and has_any_role('ceo','cfo','hr_admin'));

-- Finance: CEO/CFO/auditor read. Only CEO/CFO write.
drop policy if exists accounting_select on public.accounting_entries;
create policy accounting_select on public.accounting_entries
for select using (company_id = current_company_id() and has_any_role('ceo','cfo','auditor'));

drop policy if exists accounting_write on public.accounting_entries;
create policy accounting_write on public.accounting_entries
for all using (company_id = current_company_id() and has_any_role('ceo','cfo'))
with check (company_id = current_company_id() and has_any_role('ceo','cfo'));

-- Audit log: ceo + auditor read. Inserts via service role.
drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs
for select using (company_id = current_company_id() and has_any_role('ceo','auditor'));

-- Notifications: each user reads their own.
drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
for select using (company_id = current_company_id() and auth_user_id = auth.uid());

drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications
for update using (company_id = current_company_id() and auth_user_id = auth.uid())
with check (company_id = current_company_id() and auth_user_id = auth.uid());

drop policy if exists user_preferences_select on public.user_preferences;
create policy user_preferences_select on public.user_preferences
for select using (company_id = current_company_id() and auth_user_id = auth.uid());

drop policy if exists user_preferences_write on public.user_preferences;
create policy user_preferences_write on public.user_preferences
for all using (company_id = current_company_id() and auth_user_id = auth.uid())
with check (company_id = current_company_id() and auth_user_id = auth.uid());

drop policy if exists user_sessions_select on public.user_sessions;
create policy user_sessions_select on public.user_sessions
for select using (company_id = current_company_id() and auth_user_id = auth.uid());
