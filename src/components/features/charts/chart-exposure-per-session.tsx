import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { cn, convertSecondsToHoursMinutes } from "@/lib/utils";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { z } from "zod";

const filterNames = z.enum(["Ha", "OIII", "SII", "L", "R", "G", "B", "Clear"]);
const timelineInputSchema = z.array(
	z.object({
		date: z.string(),
		filters: z.partialRecord(filterNames, z.number()),
	}),
);

export type TimelineInput = z.infer<typeof timelineInputSchema>;

const filterSetChartConfig = {
	Ha: {
		label: "Ha",
		color: "var(--color-red-700)",
	},
	OIII: {
		label: "OIII",
		color: "var(--color-teal-400)",
	},
	SII: {
		label: "SII",
		color: "var(--color-orange-500)",
	},
	L: {
		label: "L",
		color: "var(--color-blue-200)",
	},
	R: {
		label: "R",
		color: "var(--color-red-500)",
	},
	G: {
		label: "G",
		color: "var(--color-green-500)",
	},
	B: {
		label: "B",
		color: "var(--color-blue-500)",
	},
	Clear: {
		label: "Clear",
		color: "var(--color-gray-100)",
	},
} satisfies ChartConfig;

export function ChartExposurePerSession({
	timeline,
	chartHeight,
}: { timeline: TimelineInput; chartHeight: string }) {
	const preparedTimeline = useMemo(
		() =>
			timeline.map((session) => {
				return {
					date: new Date(session.date),
					...Object.fromEntries(
						Object.entries(session.filters).map(([key, value]) => [
							key,
							value || 0,
						]),
					),
				};
			}),
		[timeline],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Exposure Per Session</CardTitle>
			</CardHeader>
			<CardContent className="px-2 pt-4">
				<ChartContainer
					config={filterSetChartConfig}
					className={cn(chartHeight && "aspect-auto w-full", chartHeight)}
				>
					<BarChart accessibilityLayer data={preparedTimeline}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickFormatter={(value) =>
								value.toLocaleDateString(undefined, {
									day: "2-digit",
									month: "short",
								})
							}
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<YAxis hide tickFormatter={convertSecondsToHoursMinutes} />
						<ChartTooltip
							valueFormatter={convertSecondsToHoursMinutes}
							content={<ChartTooltipContent hideLabel />}
						/>

						{Object.keys(filterSetChartConfig).map((filter) => (
							<Bar
								animationDuration={0}
								dataKey={filter}
								key={filter}
								stackId="a"
								fill={
									filterSetChartConfig[
										filter as keyof typeof filterSetChartConfig
									].color
								}
							/>
						))}
						<ChartLegend content={<ChartLegendContent />} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
