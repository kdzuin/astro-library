import { db } from "@/db";
import { project, projectTag, tag } from "@/db/schema";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import {
    type Project,
    createProjectSchema,
    projectSchema,
} from "@/schemas/project";
import { type Tag, tagSchema } from "@/schemas/tag";
import { createServerFn } from "@tanstack/react-start";
import { asc, desc, eq } from "drizzle-orm";

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

/**
 * Create a new project
 */
export const createProject = createServerFn({ method: "POST" })
    .validator(async (data: { name: string; description?: string }) => {
        const userId = await getUserId();

        if (!userId) {
            throw new Error("User not authenticated");
        }

        const validated = createProjectSchema.safeParse({
            id: crypto.randomUUID(),
            userId,
            name: data.name,
            description: data.description || null,
            status: "planning" as const,
            totalExposureTime: null,
        });
        if (!validated.success) {
            console.error(validated.error.issues);
            throw new Error(
                `Failed to create project: validation error - ${JSON.stringify(validated.error.issues)}`,
            );
        }

        return validated.data;
    })
    .handler(async ({ data }): Promise<Project> => {
        try {
            const [insertedProject] = await db
                .insert(project)
                .values(await data)
                .returning();

            const dbResponse = projectSchema.safeParse(insertedProject);

            if (dbResponse.success) {
                return dbResponse.data;
            }

            throw new Error("Failed to create project");
        } catch (error) {
            console.error("[DEBUG] Error in createProject handler:", {
                message:
                    error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
                data,
                error,
            });
            throw new Error(
                `Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    });

/**
 * Get projects for a user
 */
export const getProjectsByUserId = createServerFn({ method: "GET" })
    .validator(
        (data: {
            userId: string;
            order?: "updated" | "created" | "name";
            direction?: "asc" | "desc";
        }) => data,
    )
    .handler(
        async ({
            data,
        }): Promise<{ projects: Project[]; nextCursor?: string }> => {
            try {
                const { userId, order = "updated", direction = "desc" } = data;

                const orderField =
                    orderFieldMap[order as keyof typeof orderFieldMap];

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
                    .orderBy(
                        directionMap[direction as keyof typeof directionMap](
                            orderField,
                        ),
                    );

                // Validate each project
                const validatedProjects: Project[] = [];
                for (const proj of projects) {
                    const result = projectSchema.safeParse(proj);
                    if (result.success) {
                        validatedProjects.push(result.data);
                    } else {
                        console.error(
                            "Project validation failed:",
                            result.error,
                        );
                    }
                }

                return { projects: validatedProjects };
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

/**
 * Get a single project by ID
 */
export const getProjectById = createServerFn({ method: "GET" })
    .validator((projectId: string) => {
        return projectId;
    })
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
