"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const panelColors = [
	"color-mix(in oklch, var(--color-pink-700), transparent 90%)",
	"color-mix(in oklch, var(--color-pink-700), transparent 60%)",
	"color-mix(in oklch, var(--color-pink-700), transparent 40%)",
	"color-mix(in oklch, var(--color-pink-700), transparent 20%)",
	"color-mix(in oklch, var(--color-pink-700), transparent 0%)",
];

const normalize = (value: number, min: number, max: number) =>
	(value - min) / (max - min);

const mapNormalisedToColor = (value: number) => {
	const normalizedValue = normalize(value, 0, 1);
	const index = Math.floor(normalizedValue * (panelColors.length - 1));
	return panelColors[index];
};

interface HeatMapProps {
	numberOfWeeks?: number;
	data?: Array<{ date: string; value: number }>;
}

export function HeatMap({ numberOfWeeks = 12, data = [] }: HeatMapProps) {
	const maxCount = useMemo(() => {
		return Math.max(...data.map((d) => d.value));
	}, [data]);

	const [startDate, endDate, now] = useMemo(() => {
		const now = new Date();

		// Find the most recent Monday (start of current week)
		const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
		const daysToLastMonday = today === 0 ? 6 : today - 1; // Days back to get to Monday
		const thisMonday = new Date(now);
		thisMonday.setDate(now.getDate() - daysToLastMonday);

		// Start date: (numberOfWeeks - 1) weeks before last Monday
		const startDate = new Date(thisMonday);
		startDate.setDate(thisMonday.getDate() - (numberOfWeeks - 1) * 7);

		// End date: Last Monday + 6 days (end of current week)
		const endDate = new Date(thisMonday);
		endDate.setDate(thisMonday.getDate() + 6);

		return [startDate, endDate, now];
	}, [numberOfWeeks]);

	const days = useMemo(() => {
		const result: Record<string, number> = {};
		for (
			let date = new Date(startDate);
			date <= endDate;
			date.setDate(date.getDate() + 1)
		) {
			const key = date.toISOString().split("T")[0];
			result[key] = data.find((d) => d.date === key)?.value || 0;
		}

		return result;
	}, [data, startDate, endDate]);

	const weeks = useMemo(() => {
		const weeks: Array<Array<{ date: string; count: number } | undefined>> = [];
		const datePointer = new Date(startDate);

		// Generate exactly numberOfWeeks weeks, but stop at current date
		while (weeks.length < numberOfWeeks) {
			const week: Array<{ date: string; count: number } | undefined> = [];

			// Generate 7 days for this week (Monday to Sunday)
			for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
				const dateStr = datePointer.toISOString().split("T")[0];

				// Only add days up to today
				if (datePointer <= now) {
					week.push({
						date: dateStr,
						count: days[dateStr] || 0,
					});
				} else {
					week.push(undefined);
				}

				datePointer.setDate(datePointer.getDate() + 1);
			}

			weeks.push(week);
		}

		return weeks;
	}, [days, numberOfWeeks, startDate, now]);

	return (
		<div className={cn("w-full grid gap-1 grid-flow-col")}>
			{weeks.map((week, weekIndex) => (
				<div
					key={weekIndex}
					className={cn("grid gap-[inherit]", "grid-rows-7")}
				>
					{week.map((day, dayIndex) => (
						<Tooltip key={dayIndex}>
							<TooltipTrigger asChild>
								<div
									className={cn(
										"aspect-square rounded-[12%] min-w-0 min-h-0",
										day ? "bg-white/5" : "bg-transparent",
									)}
									style={{
										backgroundColor: day
											? mapNormalisedToColor(normalize(day.count, 0, maxCount))
											: "transparent",
									}}
									data-date={day?.date}
									data-count={day?.count || 0}
								/>
							</TooltipTrigger>
							{day?.count ? (
								<TooltipContent>
									{day?.date},{day?.count}
								</TooltipContent>
							) : null}
						</Tooltip>
					))}
				</div>
			))}
		</div>
	);
}
