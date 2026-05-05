import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1JZcbmfQNj-_fvrtbelpvuTJO6rK4CHg",
  authDomain: "react-tee-redux.firebaseapp.com",
  projectId: "react-tee-redux",
  storageBucket: "react-tee-redux.firebasestorage.app",
  messagingSenderId: "303940470010",
  appId: "1:303940470010:web:754401d1878d8398597543",
  measurementId: "G-H8WRFD7THE",
};

// Prevent duplicate app initialization (happens in Next.js dev with hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const getAnalytics = () => {
  if (typeof window !== "undefined") {
    return import("firebase/analytics").then(({ getAnalytics }) => getAnalytics(app));
  }
  return null;
};

export default app;
