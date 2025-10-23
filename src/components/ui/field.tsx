import { Label } from "@/components/ui/label.tsx";
import type { ReactNode } from "react";

export function Field({
    id,
    label,
    component,
    errorMessage,
    isInvalid,
}: {
    id: string;
    label?: ReactNode;
    component?: ReactNode;
    errorMessage?: ReactNode;
    isInvalid?: boolean;
}) {
    return (
        <div className="grid gap-1">
            <Label htmlFor={id}>{label}</Label>

            {component}

            {isInvalid && errorMessage ? (
                <div className="text-sm text-red-700">{errorMessage}</div>
            ) : null}
        </div>
    );
}
