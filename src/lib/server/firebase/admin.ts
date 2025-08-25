import { env } from "@/env";
import { cert, getApps, initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin SDK
if (!getApps().length) {
	initializeApp({
		credential: cert({
			projectId: env.VITE_FIREBASE_PROJECT_ID,
			clientEmail: env.FIREBASE_CLIENT_EMAIL,
			privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
		}),
		projectId: env.VITE_FIREBASE_PROJECT_ID,
	});
}

export { getFirestore } from "firebase-admin/firestore";
export { getAuth } from "firebase-admin/auth";
