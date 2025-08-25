import { env } from "@/env";
import { getCookieFn } from "@/lib/server/functions/cookies";
import {
	type FirebaseOptions,
	initializeApp,
	initializeServerApp,
} from "firebase/app";
import { getAuth } from "firebase/auth";

// Returns an authenticated client SDK instance for use in Server Side Rendering
// and Static Site Generation
export async function getAuthenticatedAppForUser() {
	const authIdToken = await getCookieFn({ data: "__session" });

	// Firebase Server App is a new feature in the JS SDK that allows you to
	// instantiate the SDK with credentials retrieved from the client & has
	// other affordances for use in server environments.
	const firebaseConfig: FirebaseOptions = {
		apiKey: env.VITE_FIREBASE_API_KEY,
		authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
		projectId: env.VITE_FIREBASE_PROJECT_ID,
		storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
		appId: env.VITE_FIREBASE_APP_ID,
	};

	const firebaseServerApp = initializeServerApp(initializeApp(firebaseConfig), {
		authIdToken: authIdToken || undefined,
	});

	const auth = getAuth(firebaseServerApp);
	await auth.authStateReady();

	return { firebaseServerApp, currentUser: auth.currentUser };
}
