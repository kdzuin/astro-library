import { db } from "@/db";
import { session } from "@/db/schema";
import {
	type Session,
	createSessionSchema,
	sessionSchema,
} from "@/schemas/session.ts";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";

export const createSession = createServerFn({ method: "POST" })
	.validator(
		(data: {
			userId: string;
			projectId: string;
			date: string;
			description: string;
		}) => {
			console.log("[DEBUG] createSession validator input", data);
			const validated = createSessionSchema.safeParse({
				id: crypto.randomUUID(),
				projectId: data.projectId,
				userId: data.userId,
				date: data.date,
				description: data.description,
			});
			if (!validated.success) {
				console.error(
					"[DEBUG] Session validation failed:",
					validated.error.issues,
				);
				throw new Error(
					`Failed to create session: validation error - ${JSON.stringify(validated.error.issues)}`,
				);
			}
			return validated.data;
		},
	)
	.handler(async ({ data }): Promise<Session> => {
		console.log("[DEBUG] createSession handler started with data:", data);

		try {
			const [insertedSession] = await db
				.insert(session)
				.values(data)
				.returning();

			const dbResponse = sessionSchema.safeParse(insertedSession);

			if (dbResponse.success) {
				console.log("[DEBUG] Session created successfully:", dbResponse.data);
				return dbResponse.data;
			}

			throw new Error("Failed to create session");
		} catch (error) {
			console.error("[DEBUG] Error in createSession handler:", {
				message: error instanceof Error ? error.message : "Unknown error",
				stack: error instanceof Error ? error.stack : undefined,
				data,
				error,
			});
			throw new Error(
				`Failed to create session: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	});

export const getSessionByProjectId = createServerFn({ method: "GET" })
	.validator((projectId: string) => {
		return projectId;
	})
	.handler(async ({ data: projectId }): Promise<{ sessions: Session[] }> => {
		try {
			const sessions = await db
				.select({
					id: session.id,
					projectId: session.projectId,
					description: session.description,
					date: session.date,
					createdAt: session.createdAt,
					updatedAt: session.updatedAt,
				})
				.from(session)
				.where(eq(session.projectId, projectId))
				.orderBy(asc(session.date));

			const validatedSessions: Session[] = [];

			for (const sessionItem of sessions) {
				const result = sessionSchema.safeParse(sessionItem);
				if (result.success) {
					validatedSessions.push(result.data);
				} else {
					console.error("Session validation failed:", result.error);
				}
			}

			return {
				sessions: validatedSessions,
			};
		} catch (error) {
			console.error("Error fetching sessions by project:", error);
			throw new Error("Failed to fetch sessions by project id");
		}
	});
