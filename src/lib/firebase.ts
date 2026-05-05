// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo4td_RewGLvXvmnzbAX0UkYsi93DNDlg",
  authDomain: "genzify-b0d97.firebaseapp.com",
  projectId: "genzify-b0d97",
  storageBucket: "genzify-b0d97.firebasestorage.app",
  messagingSenderId: "418857765876",
  appId: "1:418857765876:web:947b21c27e89f79ed187a1",
  measurementId: "G-R0SRET9WZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics only on client side
export const getAnalytics = () => {
  if (typeof window !== 'undefined') {
    return import('firebase/analytics').then(({ getAnalytics }) => getAnalytics(app));
  }
  return null;
};

export default app;
