"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
	hasBackButton?: boolean;
	title: React.ReactNode;
	actions?: ReactNode;
	className?: string;
}

export function PageHeader({
	title,
	actions,
	hasBackButton,
	className = "",
}: PageHeaderProps) {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate({ to: ".." });
	};

	return (
		<header
			className={cn(
				"flex flex-col",
				"gap-2 lg:gap-4",
				"lg:justify-between lg:items-center lg:flex-row",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				{hasBackButton && (
					<Button variant="secondary" size="icon" onClick={handleBack}>
						<ArrowLeftIcon />
					</Button>
				)}
				<h1 className="text-3xl font-bold text-start m-0">{title}</h1>
			</div>
			<div
				className={cn(
					"flex items-center gap-2 self-start justify-between w-full lg:w-auto",
				)}
			>
				<div className="flex items-center gap-2">{actions}</div>
				<div className="max-lg:absolute max-lg:right-4 max-lg:top-4 w-auto">
					<SidebarTrigger />
				</div>
			</div>
		</header>
	);
}
