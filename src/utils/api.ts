import { productService, userService, orderService, cartService } from '@/lib/firestore-services';

// Simulate network delay
function wait(ms = 250) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Product API
export async function fetchProducts() {
  await wait();
  return productService.getAllProducts();
}

export async function fetchProductById(id: string) {
  await wait();
  return productService.getProductById(id);
}

export async function fetchProductsByCategory(category: string) {
  await wait();
  return productService.getProductsByCategory(category);
}

// User Authentication API
export async function loginUser(credentials: { email: string; password: string }) {
  await wait();
  const user = await userService.getUserByEmail(credentials.email);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export async function registerUser(payload: { email: string; password: string; name: string }) {
  await wait();
  const userId = await userService.createUser({
    email: payload.email,
    name: payload.name,
  });
  return {
    id: userId,
    email: payload.email,
    name: payload.name,
  };
}

// Order API
export async function createOrder(orderPayload: any) {
  await wait();
  const orderId = await orderService.createOrder(orderPayload);
  return {
    orderId,
    status: 'pending',
    ...orderPayload,
  };
}

export async function fetchUserOrders(userId: string) {
  await wait();
  return orderService.getUserOrders(userId);
}

export async function fetchAllOrders() {
  await wait();
  return orderService.getAllOrders();
}

export async function updateOrderStatus(orderId: string, status: string) {
  await wait();
  await orderService.updateOrderStatus(orderId, status as any);
  return { success: true };
}

// Cart API
export async function fetchCartItems(userId: string) {
  await wait();
  return cartService.getCartItems(userId);
}

// Admin API
export async function createProduct(productData: any) {
  await wait();
  const productId = await productService.createProduct(productData);
  return { id: productId, ...productData };
}

export async function updateProduct(productId: string, productData: any) {
  await wait();
  await productService.updateProduct(productId, productData);
  return { success: true };
}

export async function deleteProduct(productId: string) {
  await wait();
  await productService.deleteProduct(productId);
  return { success: true };
}
