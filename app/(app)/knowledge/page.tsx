import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileCheck, Shield } from "lucide-react";
import { fetchSops, fetchDepartments } from "@/lib/queries";

export default async function KnowledgePage() {
  const [sops, departments] = await Promise.all([fetchSops(), fetchDepartments()]);

  const byDept = departments.map((d) => ({
    dept: d,
    docs: sops.filter((s) => s.department_id === d.id),
  }));

  return (
    <div>
      <PageHeader
        title="SOP / Playbook"
        description="Standard Operating Procedure · Checklist · Policy"
        actions={<Button>+ Thêm tài liệu</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <div>
            <div className="text-xs text-zinc-500">SOP</div>
            <div className="text-2xl font-bold">{sops.length}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <FileCheck className="h-8 w-8 text-emerald-600" />
          <div>
            <div className="text-xs text-zinc-500">Published</div>
            <div className="text-2xl font-bold">{sops.filter((s) => s.published).length}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Shield className="h-8 w-8 text-amber-600" />
          <div>
            <div className="text-xs text-zinc-500">Version TB</div>
            <div className="text-2xl font-bold">
              {(sops.reduce((s, d) => s + d.version, 0) / Math.max(1, sops.length)).toFixed(1)}
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-zinc-500">Phòng ban có SOP</div>
          <div className="text-2xl font-bold">
            {byDept.filter((b) => b.docs.length > 0).length}/{departments.length}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {byDept.map(({ dept, docs }) => (
          <Card key={dept.id}>
            <CardHeader>
              <CardTitle className="text-base">{dept.name}</CardTitle>
              <div className="text-xs text-zinc-500">
                {docs.length} tài liệu
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {docs.map((d) => (
                <div
                  key={d.id}
                  className="flex items-start gap-2 rounded-lg border border-zinc-100 p-2"
                >
                  <BookOpen className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-zinc-900">{d.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">v{d.version}</Badge>
                      {d.published ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="warning">Draft</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {docs.length === 0 && (
                <div className="text-xs text-zinc-400 text-center py-3">
                  Chưa có SOP cho phòng ban này
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
