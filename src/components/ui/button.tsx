import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    [
        "relative inline-flex items-center justify-center whitespace-nowrap transition-all shrink-0 outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "outline-none focus-visible:border-ring/30 focus-visible:ring-ring/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    ],
    {
        variants: {
            variant: {
                default: [
                    "backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-full",
                    "hover:bg-white/20 active:bg-white/25",
                ],
                prominent: [
                    "backdrop-blur-sm bg-white/20 border border-white/20 text-white rounded-full",
                    "hover:bg-white/30 active:bg-white/35",
                ],
            },
            size: {
                default: [
                    "font-regular text-sm/5 md:text-base/5",
                    "py-2 px-4 gap-2 min-w-8",
                    "has-[>svg]:px-2",
                    "[&_svg]:size-5",
                ],
                small: [
                    "font-regular text-xs/4",
                    "py-1.5 px-2 gap-1 min-w-7.5",
                    "[&_svg]:size-3",
                ],
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
