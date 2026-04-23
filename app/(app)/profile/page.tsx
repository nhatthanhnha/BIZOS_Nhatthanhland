import { createClientOrNull } from "@/lib/supabase/server";
import { logout } from "@/app/(auth)/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
  const supabase = await createClientOrNull();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  const email = user?.email ?? "guest@bizos.local";
  const fullName = (user?.user_metadata?.full_name as string) ?? "Người dùng";
  const initials = fullName.slice(0, 1).toUpperCase();

  return (
    <div>
      <PageHeader
        title="Tài khoản cá nhân"
        description="Quản lý hồ sơ, bảo mật và thiết bị đăng nhập"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            <div className="mt-3 font-semibold text-zinc-900">{fullName}</div>
            <div className="text-sm text-zinc-500">{email}</div>
            <Badge variant="success" className="mt-2">
              Đã kích hoạt
            </Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Họ và tên</Label>
                <Input defaultValue={fullName} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input defaultValue={email} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Số điện thoại</Label>
                <Input defaultValue="" placeholder="+84..." />
              </div>
              <div className="space-y-1.5">
                <Label>Phòng ban</Label>
                <Input defaultValue="Chưa gán" disabled />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Lưu thay đổi</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bảo mật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-zinc-900">Mật khẩu</div>
                <div className="text-zinc-500">Cập nhật lần cuối: —</div>
              </div>
              <Button variant="outline" size="sm">
                Đổi mật khẩu
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-zinc-900">Xác thực 2 lớp (2FA)</div>
                <div className="text-zinc-500">Chưa bật</div>
              </div>
              <Button variant="outline" size="sm">
                Thiết lập
              </Button>
            </div>
            <Separator />
            <form action={logout}>
              <Button variant="destructive" className="w-full">
                Đăng xuất
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thiết bị & phiên đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-zinc-200 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-900">Trình duyệt hiện tại</span>
                <Badge variant="success">Đang hoạt động</Badge>
              </div>
              <div className="text-zinc-500 text-xs mt-1">Lần cuối hoạt động: vừa xong</div>
            </div>
            <div className="text-xs text-zinc-400 text-center pt-2">
              Chưa có phiên đăng nhập nào khác.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
