import { getFirestore } from "@/lib/server/firebase/admin";
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
		const adminDb = getFirestore();

		try {
			// const collectionRef = adminDb
			// 	.collectionGroup("acquisitionDetails")
			// 	.where("userId", "==", userId);
			// const querySnapshot = await collectionRef.get();

			const result = {
				data: [],
			};

			return result.data;
		} catch (error) {
			console.error("Error fetching acquisition details:", error);
			throw new Error("Failed to fetch acquisition details data");
		}
	});
