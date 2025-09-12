import { db } from "@/db";
import { project, projectTag, tag } from "@/db/schema";
import { type Project, projectSchema } from "@/schemas/project";
import { type Tag, tagSchema } from "@/schemas/tag";
import { createServerFn } from "@tanstack/react-start";
import { asc, desc, eq } from "drizzle-orm";

/**
 * Create a new project with debug logging
 */
export const createProject = createServerFn({ method: "POST" })
	.validator((data: { name: string; userId: string; description?: string }) => {
		console.log("[DEBUG] createProject validator input:", data);
		return data;
	})
	.handler(async ({ data }): Promise<Project> => {
		console.log("[DEBUG] createProject handler started with data:", data);

		try {
			const projectId = crypto.randomUUID();
			const now = new Date();

			const projectData = {
				id: projectId,
				userId: data.userId,
				name: data.name,
				description: data.description || null,
				status: "planning" as const,
				totalExposureTime: null,
				createdAt: now,
				updatedAt: now,
			};

			// Insert into database
			await db.insert(project).values(projectData).returning();

			// Validate and return the created project
			console.log("[DEBUG] Validating project data with schema...");
			const result = projectSchema.safeParse(projectData);
			if (!result.success) {
				console.error(
					"[DEBUG] Project validation failed:",
					result.error.issues,
				);
				throw new Error(
					`Failed to create project: validation error - ${JSON.stringify(result.error.issues)}`,
				);
			}

			console.log("[DEBUG] Project created successfully:", result.data);
			return result.data;
		} catch (error) {
			console.error("[DEBUG] Error in createProject handler:", {
				message: error instanceof Error ? error.message : "Unknown error",
				stack: error instanceof Error ? error.stack : undefined,
				data: data,
				error: error,
			});
			throw new Error(
				`Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	});

/**
 * Main projects query - Returns only project data for maximum performance
 * Tags are loaded separately on the client side when needed
 */
const orderFieldMap = {
	created: project.createdAt,
	name: project.name,
	updated: project.updatedAt,
} as const;

const directionMap = {
	asc: asc,
	desc: desc,
} as const;

export const getProjectsByUserId = createServerFn({ method: "GET" })
	.validator(
		(data: {
			userId: string;
			limit?: number;
			offset?: number;
			order?: "updated" | "created" | "name";
			direction?: "asc" | "desc";
			cursor?: string;
		}) => data,
	)
	.handler(
		async ({ data }): Promise<{ projects: Project[]; nextCursor?: string }> => {
			try {
				const {
					userId,
					limit = 50,
					offset = 0,
					order = "updated",
					direction = "desc",
					cursor,
				} = data;

				// Parse cursor if provided
				let cursorData: { order: string; direction: string; value: string; id: string } | null = null;
				if (cursor) {
					try {
						const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
						const [cursorOrder, cursorDirection, cursorValue, cursorId] = decoded.split(':');
						cursorData = { order: cursorOrder, direction: cursorDirection, value: cursorValue, id: cursorId };
					} catch (error) {
						console.error("Invalid cursor format:", error);
					}
				}

				// Use cursor data if available, otherwise use provided params
				const finalOrder = cursorData?.order || order;
				const finalDirection = cursorData?.direction || direction;
				const orderField = orderFieldMap[finalOrder as keyof typeof orderFieldMap];

				// Fetch one extra project to determine if there are more
				const projects = await db
					.select({
						id: project.id,
						userId: project.userId,
						name: project.name,
						description: project.description,
						status: project.status,
						totalExposureTime: project.totalExposureTime,
						createdAt: project.createdAt,
						updatedAt: project.updatedAt,
					})
					.from(project)
					.where(eq(project.userId, userId))
					.orderBy(directionMap[finalDirection as keyof typeof directionMap](orderField))
					.limit(limit + 1)
					.offset(offset);

				// Determine if there are more projects
				const hasMore = projects.length > limit;
				const projectsToReturn = hasMore ? projects.slice(0, limit) : projects;

				// Validate each project
				const validatedProjects: Project[] = [];
				for (const proj of projectsToReturn) {
					const result = projectSchema.safeParse(proj);
					if (result.success) {
						validatedProjects.push(result.data);
					} else {
						console.error("Project validation failed:", result.error);
					}
				}

				// Generate cursor for next page if there are more projects
				let nextCursor: string | undefined;
				if (hasMore && validatedProjects.length > 0) {
					const lastProject = validatedProjects[validatedProjects.length - 1];
					
					const cursorValueMap = {
						created: lastProject.createdAt.toISOString(),
						name: lastProject.name,
						updated: lastProject.updatedAt.toISOString(),
					} as const;
					
					const cursorValue = cursorValueMap[finalOrder as keyof typeof cursorValueMap];
					nextCursor = Buffer.from(`${finalOrder}:${finalDirection}:${cursorValue}:${lastProject.id}`).toString('base64');
				}

				return { projects: validatedProjects, nextCursor };
			} catch (error) {
				console.error("Error fetching projects:", error);
				throw new Error("Failed to fetch projects");
			}
		},
	);

/**
 * Client-side tag loading - Load tags for specific project when needed
 * Use this from React components with proper caching/state management
 */
export const getProjectTags = createServerFn({ method: "GET" })
	.validator((projectId: string) => projectId)
	.handler(async ({ data: projectId }): Promise<Tag[]> => {
		try {
			const projectTags = await db
				.select({
					id: tag.id,
					name: tag.name,
					description: tag.description,
					color: tag.color,
					userId: tag.userId,
					createdAt: tag.createdAt,
					updatedAt: tag.updatedAt,
				})
				.from(tag)
				.innerJoin(projectTag, eq(tag.id, projectTag.tagId))
				.where(eq(projectTag.projectId, projectId));

			const validatedTags: Tag[] = [];
			for (const tagData of projectTags) {
				const result = tagSchema.safeParse(tagData);
				if (result.success) {
					validatedTags.push(result.data);
				}
			}

			return validatedTags;
		} catch (error) {
			console.error("Error fetching project tags:", error);
			throw new Error("Failed to fetch project tags");
		}
	});

export const getProjectById = createServerFn({ method: "GET" })
	.validator((projectId: string) => projectId)
	.handler(async ({ data: projectId }): Promise<Project | null> => {
		try {
			const result = await db
				.select()
				.from(project)
				.where(eq(project.id, projectId))
				.limit(1);

			if (result.length === 0) {
				return null;
			}

			const projectData = result[0];

			// Validate the data using Zod schema with safeParse
			const validationResult = projectSchema.safeParse(projectData);

			if (!validationResult.success) {
				console.error(
					"Project data validation failed:",
					validationResult.error,
				);
				return null;
			}

			return validationResult.data;
		} catch (error) {
			console.error("Error fetching project:", error);
			throw new Error("Failed to fetch project data");
		}
	});
