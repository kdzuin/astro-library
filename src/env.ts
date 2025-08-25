import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		SERVER_URL: z.string().url().optional(),
		FIREBASE_CLIENT_EMAIL: z.string().min(1).optional(),
		FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
	},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "VITE_",

	client: {
		VITE_FIREBASE_API_KEY: z.string().min(1),
		VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
		VITE_FIREBASE_PROJECT_ID: z.string().min(1),
		VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
		VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
		VITE_FIREBASE_APP_ID: z.string().min(1),
		VITE_FIREBASE_MEASUREMENT_ID: z.string().min(1),
	},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	runtimeEnv: {
		// Server variables from process.env
		SERVER_URL: process.env.SERVER_URL,
		FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
		FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
		// Client variables from import.meta.env
		VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
		VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
		VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
		VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
		VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
		VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
		VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
	},

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});
