'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { userService, FirestoreUser } from "@/lib/firestore-services";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  isLoginOpen: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthUser>;
  register: (payload: { email: string; password: string; name: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<AuthUser | null>("genzify-user", null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Check if user exists in Firestore
        const userData = await userService.getUserByEmail(firebaseUser.email!);
        if (userData && userData.id) {
          const authUser: AuthUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            role: userData.role
          };
          setUser(authUser);
        } else {
          // Create user in Firestore if doesn't exist
          const newUser = {
            email: firebaseUser.email!,
            name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
            avatar: firebaseUser.photoURL || undefined,
          };
          const userId = await userService.createUser(newUser);
          const createdUser: AuthUser = { id: userId, ...newUser };
          setUser(createdUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function login(credentials: { email: string; password: string }) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      const userData = await userService.getUserByEmail(credentials.email);
      if (!userData || !userData.id) {
        throw new Error('User not found in database');
      }
      
      const authUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        role: userData.role
      };
      
      setUser(authUser);
      setLoginOpen(false);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(payload: { email: string; password: string; name: string }) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      
      const newUser = {
        email: payload.email,
        name: payload.name,
        avatar: userCredential.user.photoURL || undefined,
      };
      
      const userId = await userService.createUser(newUser);
      const createdUser = { id: userId, ...newUser };
      
      setUser(createdUser);
      return createdUser;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoginOpen,
        isLoading,
        login,
        register,
        logout,
        openLogin: () => setLoginOpen(true),
        closeLogin: () => setLoginOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
