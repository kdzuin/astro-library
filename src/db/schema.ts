import {
	pgTable,
	text,
	timestamp,
	integer,
	pgEnum,
	date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

// Enum for project status
export const projectStatusEnum = pgEnum("project_status", [
	"planning",
	"active",
	"processing",
	"completed",
]);

// Tags table
export const tag = pgTable("tag", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	color: text("color"), // Hex color code
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Projects table
export const project = pgTable("project", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description"),
	status: projectStatusEnum("status").default("planning").notNull(),
	totalExposureTime: integer("total_exposure_time"), // in seconds
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Sessions table
export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	projectId: text("project_id")
		.notNull()
		.references(() => project.id, { onDelete: "cascade" }),
	date: date("date").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Junction table for project-tag many-to-many relationship
export const projectTag = pgTable("project_tag", {
	id: text("id").primaryKey(),
	projectId: text("project_id")
		.notNull()
		.references(() => project.id, { onDelete: "cascade" }),
	tagId: text("tag_id")
		.notNull()
		.references(() => tag.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Junction table for session-tag many-to-many relationship
export const sessionTag = pgTable("session_tag", {
	id: text("id").primaryKey(),
	sessionId: text("session_id")
		.notNull()
		.references(() => session.id, { onDelete: "cascade" }),
	tagId: text("tag_id")
		.notNull()
		.references(() => tag.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
	projects: many(project),
	tags: many(tag),
	sessions: many(session),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
	user: one(user, {
		fields: [project.userId],
		references: [user.id],
	}),
	projectTags: many(projectTag),
	sessions: many(session),
}));

export const sessionRelations = relations(session, ({ one, many }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
	project: one(project, {
		fields: [session.projectId],
		references: [project.id],
	}),
	sessionTags: many(sessionTag),
}));

export const tagRelations = relations(tag, ({ one, many }) => ({
	user: one(user, {
		fields: [tag.userId],
		references: [user.id],
	}),
	projectTags: many(projectTag),
	sessionTags: many(sessionTag),
}));

export const projectTagRelations = relations(projectTag, ({ one }) => ({
	project: one(project, {
		fields: [projectTag.projectId],
		references: [project.id],
	}),
	tag: one(tag, {
		fields: [projectTag.tagId],
		references: [tag.id],
	}),
}));

export const sessionTagRelations = relations(sessionTag, ({ one }) => ({
	session: one(session, {
		fields: [sessionTag.sessionId],
		references: [session.id],
	}),
	tag: one(tag, {
		fields: [sessionTag.tagId],
		references: [tag.id],
	}),
}));
