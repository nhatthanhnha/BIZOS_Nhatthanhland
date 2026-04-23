# BIZOS — Business Operating System

Business Operating System cho SME: **Task → KPI cá nhân → KPI phòng ban → KPI công ty → Tài chính**. 19 màn hình gồm Dashboard, Org Chart, KPI Tree, Operations, Compensation, Projects, Finance, Reports, Alerts, Approvals, Audit, OKR, Forecast, Recruiting, Knowledge, Profile, Settings.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **TypeScript**
- **Tailwind CSS v4** + shadcn-style UI primitives + **lucide-react** icons
- **Recharts** (line, bar, donut) + **reactflow** (org chart + KPI tree)
- **Supabase** (Postgres, Auth, Storage) qua `@supabase/ssr`
- **React Hook Form + Zod** cho form
- **TanStack Table** cho data grid
- Deploy: **Vercel** hoặc **Railway** (Dockerfile), Supabase managed cloud

## Chạy local

```bash
pnpm install
cp .env.example .env.local
# Điền NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
pnpm dev
```

Mở http://localhost:3000 — redirect sang `/login`.

## Thiết lập Supabase

1. Tạo project tại https://app.supabase.com.
2. Vào **SQL Editor**, chạy lần lượt:
   - `db/schema.sql` — tạo toàn bộ bảng + enums + triggers
   - `db/policies.sql` — bật RLS + policy cho 7 role
   - `db/seed.sql` — seed company BIZOS Demo, phòng ban, KPI, payroll mẫu
3. **Authentication → Users → Add user** tạo các user demo:
   `ceo@bizos.demo`, `hr@bizos.demo`, `cfo@bizos.demo`, `sales.head@bizos.demo`
4. Lấy `auth.users.id` và chạy SQL:
   ```sql
   update employees set auth_user_id = '<auth-id>' where email = 'ceo@bizos.demo';
   insert into user_roles (auth_user_id, company_id, role)
   values ('<ceo-auth-id>', '00000000-0000-0000-0000-00000000c001', 'ceo');
   ```
5. Copy `anon key` và `service_role key` từ **Project Settings → API** vào `.env.local`.

## Deploy

Anh chọn 1 trong 2 (hoặc chạy cả 2 song song):

### Option A — Vercel (khuyến nghị cho Next.js)

1. Push repo lên GitHub.
2. Trên https://vercel.com → **Add New → Project** → chọn repo này.
3. Vercel tự nhận `vercel.json` + framework **Next.js**. Root directory = `company-os/` (nếu anh dùng workspace).
4. Settings → **Environment Variables** thêm:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (URL Vercel sau khi có domain)
5. Deploy — Vercel tự build. App route `/api/health` để kiểm tra.
6. Region mặc định `sin1` (Singapore) trong `vercel.json` cho latency VN tốt; đổi trong file nếu muốn.

### Option B — Railway (Docker)

1. Push repo lên GitHub.
2. Trên https://railway.app → **New → Deploy from GitHub repo** → chọn repo này.
3. Railway tự nhận `Dockerfile` và `railway.json`.
4. Thêm env vars như Vercel ở trên.
5. Deploy — healthcheck tại `/api/health`.

## Cấu trúc

```
app/
  (auth)/            login, signup, reset-password + server actions
  (app)/             shell có Sidebar + Topbar + 19 màn hình
  api/health         healthcheck cho Railway
components/
  ui/                button, card, input, badge, label, separator
  layout/            Sidebar, Topbar, PageHeader, PagePlaceholder
  charts/            AreaTrend, BarCompare, DonutStat
  kpi/               KpiCard
lib/
  supabase/          client.ts, server.ts, proxy.ts
  utils/             cn, formatVND, formatPercent, formatDateVN
  nav.ts             19 menu items
db/
  schema.sql         40+ bảng theo spec (org, KPI, ops, compensation,
                     projects, finance, OKR, recruiting, knowledge, governance)
  policies.sql       RLS cho 7 role
  seed.sql           BIZOS Demo company + KPI cascade mẫu
proxy.ts             root-level proxy (auth guard)
Dockerfile           multi-stage build
railway.json         build + deploy + healthcheck
```

## Lộ trình

| Phase | Scope |
|---|---|
| **0** | Bootstrap, shell, 19 page placeholders, schema + RLS + seed, deploy config ✅ |
| **1** | Org / Department / People full CRUD |
| **2** | KPI formula engine + OKR cascade + integrity checker |
| **3** | Operations (task board, SLA, task-to-KPI mapping) |
| **4** | Compensation rule engine + payroll + simulator |
| **5** | Projects + milestones + ROI |
| **6** | Finance: P&L / BS / Cash Flow / Budget vs Actual |
| **7** | Dashboard intelligence + Forecast simulator |
| **8** | Reports + Alerts + Approvals + Audit Log |
| **9** | Recruiting + SOP / Knowledge |
| **10** | Polish + Railway production deploy |

## Ghi chú Next.js 16

- `middleware.ts` đã đổi thành **`proxy.ts`** — giữ nguyên logic session refresh của Supabase.
- Tailwind 4 dùng `@import "tailwindcss"` + `@theme inline` trong `app/globals.css`.
- Server Actions là cách mặc định xử lý form; xem `app/(auth)/actions.ts`.
