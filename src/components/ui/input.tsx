import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex w-full min-w-0 min-h-9 px-3 py-1 rounded-md border field-sizing-content outline-none",
                "text-base md:text-sm placeholder:text-muted-foreground text-white",
                "focus-visible:border-ring/30 focus-visible:ring-[3px] focus-visible:ring-ring/20",
                "bg-input/10 border-input/10",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
                "selection:bg-primary selection:text-primary-foreground",
                "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "transition-[color,box-shadow]",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
