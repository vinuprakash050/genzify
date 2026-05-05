import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Product {
  id?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  sizes?: string[];
  inStock?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FirestoreUser {
  id?: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  size: string;
  addedAt?: Timestamp;
}

// Collection references
const productsCollection = collection(db, 'products');
const usersCollection = collection(db, 'users');
const ordersCollection = collection(db, 'orders');
const cartCollection = collection(db, 'cart');

// Product Services
export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : null;
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const q = query(productsCollection, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = await addDoc(productsCollection, {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...product,
      updatedAt: Timestamp.now()
    });
  },

  async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  }
};

// User Services
export const userService = {
  async createUser(user: Omit<FirestoreUser, 'id'>): Promise<string> {
    // Strip undefined values — Firestore doesn't accept them
    const cleanUser = Object.fromEntries(
      Object.entries(user).filter(([_, v]) => v !== undefined)
    );
    const docRef = await addDoc(usersCollection, {
      ...cleanUser,
      role: 'user',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getUserById(id: string): Promise<FirestoreUser | null> {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as FirestoreUser : null;
  },

  async getUserByEmail(email: string): Promise<FirestoreUser | null> {
    const q = query(usersCollection, where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as FirestoreUser;
  },

  async updateUser(id: string, user: Partial<FirestoreUser>): Promise<void> {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, {
      ...user,
      updatedAt: Timestamp.now()
    });
  }
};

// Order Services
export const orderService = {
  async createOrder(order: Omit<Order, 'id'>): Promise<string> {
    const docRef = await addDoc(ordersCollection, {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getOrderById(id: string): Promise<Order | null> {
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Order : null;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const q = query(
      ordersCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },

  async getAllOrders(): Promise<Order[]> {
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
  }
};

// Cart Services
export const cartService = {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const q = query(cartCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
  },

  async addToCart(item: Omit<CartItem, 'id'>): Promise<string> {
    const docRef = await addDoc(cartCollection, {
      ...item,
      addedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async updateCartItem(id: string, quantity: number): Promise<void> {
    const docRef = doc(db, 'cart', id);
    await updateDoc(docRef, { quantity });
  },

  async removeFromCart(id: string): Promise<void> {
    const docRef = doc(db, 'cart', id);
    await deleteDoc(docRef);
  },

  async clearUserCart(userId: string): Promise<void> {
    const q = query(cartCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const batch = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(batch);
  }
};
