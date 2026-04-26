"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CompanySettingsState,
  updateCompanySettingsAction,
} from "@/app/(app)/workspace/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Đang lưu..." : "Lưu thay đổi"}
    </Button>
  );
}

type Props = {
  name: string;
  code: string;
  currency: string;
  timezone: string;
};

export function CompanySettingsForm({ name, code, currency, timezone }: Props) {
  // Controlled state — keeps user-typed values even when server re-renders and sends new props
  const [values, setValues] = useState({ name, code, currency, timezone });

  const [state, formAction] = useActionState<CompanySettingsState, FormData>(
    updateCompanySettingsAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-1.5">
        <Label>Tên công ty</Label>
        <Input
          name="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Mã công ty</Label>
        <Input
          name="code"
          value={values.code}
          onChange={(e) => setValues((v) => ({ ...v, code: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label>Currency</Label>
          <Input
            name="currency"
            value={values.currency}
            onChange={(e) => setValues((v) => ({ ...v, currency: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Timezone</Label>
          <Input
            name="timezone"
            value={values.timezone}
            onChange={(e) => setValues((v) => ({ ...v, timezone: e.target.value }))}
          />
        </div>
      </div>

      {state?.success && (
        <p className="text-xs text-emerald-600 font-medium">Đã lưu thành công.</p>
      )}
      {state?.error && (
        <p className="text-xs text-red-600 font-medium">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
