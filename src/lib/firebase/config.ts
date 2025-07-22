// Firebase configuration
// Replace these values with your actual Firebase project configuration
// You'll need to create a Firebase project and enable Authentication and Firestore

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDsqrqHseKLYHxfuKON1uryMGRKB2zlCCE',
    authDomain: 'astro-library-468e9.firebaseapp.com',
    projectId: 'astro-library-468e9',
    storageBucket: 'astro-library-468e9.appspot.com',
    messagingSenderId: '329979386828',
    appId: '1:329979386828:web:c872c64dc73ec75c8b9b69',
    measurementId: 'G-C96P8GSFFQ',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
