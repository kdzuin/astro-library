import type { AcquisitionDetails } from "@/schemas/acquisition-details";
import { createServerFn } from "@tanstack/react-start";

export const getAcquisitionDetailsByUserId = createServerFn({
	method: "GET",
})
	.validator(
		(data: {
			userId: string;
		}) => data,
	)
	.handler(async ({ data: userId }): Promise<AcquisitionDetails[] | null> => {
		try {
			throw new Error("Not implemented");
		} catch (error) {
			console.error("Error fetching acquisition details:", error);
			throw new Error("Failed to fetch acquisition details data");
		}
	});
