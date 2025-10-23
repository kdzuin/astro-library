import { z } from "zod";

export const acquisitionDetailsSchema = z.object({
    id: z.string(),
    sessionId: z.string(),
    filter: z.string(),
    subframes: z.number().min(1),
    exposurePerSubframe: z.number().min(0),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Schema for creating new acquisition details (excludes server-generated fields)
export const createAcquisitionDetailsSchema = acquisitionDetailsSchema.omit({
    id: true,
    sessionId: true,
    createdAt: true,
    updatedAt: true,
});

export const updateAcquisitionDetailsSchema = acquisitionDetailsSchema.omit({
    id: true,
    sessionId: true,
    createdAt: true,
    updatedAt: true,
});

export type AcquisitionDetails = z.infer<typeof acquisitionDetailsSchema>;
export type CreateAcquisitionDetails = z.infer<
    typeof createAcquisitionDetailsSchema
>;
export type UpdateAcquisitionDetails = z.infer<
    typeof updateAcquisitionDetailsSchema
>;
