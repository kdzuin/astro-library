import { ChartExposurePerSession } from "@/components/features/charts/chart-exposure-per-session";
import type { Meta, StoryObj } from "@storybook/react-vite";

export default {
	title: "Charts/Exposure Per Session",
	component: ChartExposurePerSession,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
} as Meta<typeof ChartExposurePerSession>;

export const Primary: StoryObj<typeof ChartExposurePerSession> = {
	args: {
		timeline: [
			{
				date: "2025-07-04",
				filters: {
					Ha: 10000,
					OIII: 4000,
				},
			},
			{
				date: "2025-08-01",
				filters: {
					Ha: 2000,
					OIII: 1600,
				},
			},
			{
				date: "2025-08-02",
				filters: {
					Ha: 6000,
					OIII: 4800,
				},
			},
			{
				date: "2025-08-03",
				filters: {
					Ha: 4200,
					OIII: 3000,
				},
			},
			{ date: "2025-08-18", filters: { L: 300 } },
		],
	},
};
