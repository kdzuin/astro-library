import type React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "flex w-full min-w-0 min-h-16 px-3 py-1 rounded-md border field-sizing-content outline-none",
                "text-base md:text-sm placeholder:text-muted-foreground text-white",
                "focus-visible:border-ring/30 focus-visible:ring-[3px] focus-visible:ring-ring/20",
                "bg-input/10 border-input/10",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
                "selection:bg-primary selection:text-primary-foreground",
                "transition-[color,box-shadow]",
            )}
            {...props}
        />
    );
}

export { Textarea };
