import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { FB_API_KEY, FB_APP_ID, FB_AUTH_DOMAIN, FB_DATABASE_URL, FB_MESSAGIN_SENDER_ID, FB_PROJECT_ID, FB_STORAGE_BUCKET } from "../constants"

const firebaseConfig: FirebaseOptions = {
  apiKey: FB_API_KEY,
  authDomain: FB_AUTH_DOMAIN,
  projectId: FB_PROJECT_ID,
  storageBucket: FB_STORAGE_BUCKET,
  messagingSenderId: FB_MESSAGIN_SENDER_ID,
  appId: FB_APP_ID,
  databaseURL: FB_DATABASE_URL
}

export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIREBASE_DB = getFirestore(FIREBASE_APP)
