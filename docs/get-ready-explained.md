# Actions Required for Astro Library Setup

## Firebase and Authentication Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once your project is created, you'll need to:

### 2. Set Up Firebase Authentication

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Google" as a sign-in provider
3. Configure the OAuth consent screen if prompted

### 3. Create a Web App in Firebase

1. In the Firebase Console, click the gear icon and select "Project settings"
2. In the "Your apps" section, click the "</>" icon to add a web app
3. Register your app with a nickname (e.g., "Astro Library")
4. Copy the Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 4. Set Up Firebase Admin SDK

1. In the Firebase Console, go to "Project settings" > "Service accounts"
2. Click "Generate new private key"
3. Save the JSON file securely
4. From this file, you'll need:
   - `project_id`
   - `client_email`
   - `private_key`

### 5. Set Up Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (it should be linked to your Firebase project)
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set up the OAuth consent screen if prompted
6. Create a Web application type
7. Add authorized JavaScript origins (e.g., `http://localhost:3000`)
8. Add authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`)
9. Copy the Client ID and Client Secret

### 6. Update Your .env.local File

Open your `.env.local` file and replace the placeholder values:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (for NextAuth adapter)
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="your-firebase-private-key"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

For the `NEXTAUTH_SECRET`, you can generate a random string using:

```bash
openssl rand -base64 32
```

### 7. Initialize Firebase Storage (for images)

1. In the Firebase Console, go to "Storage"
2. Click "Get Started" and follow the setup wizard
3. Set up security rules for your storage bucket

## Next Steps After Configuration

Once you've completed these steps:

1. Start the development server: `npm run dev`
2. Test authentication flow by signing in with Google
3. Begin implementing the core data management features
