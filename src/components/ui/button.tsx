import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none  shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default:
					"text-white shadow-xs bg-white/10 hover:bg-white/15 backdrop-blur-sm border-white/20 border-1",
				accent:
					"text-white shadow-xs bg-white/20 hover:bg-white/25 backdrop-blur-sm border-white/20 border-1",
				modest:
					"text-white shadow-xs bg-white/5 hover:bg-white/10 backdrop-blur-sm border-white/20 border-1",
				purpleBlue:
					"text-white shadow-xs bg-gradient-to-br from-blue-800 to-purple-800 hover:from-blue-700 hover:to-purple-700 transition-colors text-white border-0",
			},
			size: {
				default: [
					"text-sm font-medium rounded-full",
					"gap-2 h-10 px-6 has-[>svg]:px-4",
					"[&_svg:not([class*='size-'])]:size-4",
				],
				small: [
					"text-xs font-medium rounded-full",
					"gap-1 h-8 px-3 has-[>svg]:ps-2.5",
					"[&_svg:not([class*='size-'])]:size-4",
				],
				icon: ["rounded-full size-10 [&_svg:not([class*='size-'])]:size-5"],
				"icon-small": [
					"rounded-full size-8 [&_svg:not([class*='size-'])]:size-4",
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
