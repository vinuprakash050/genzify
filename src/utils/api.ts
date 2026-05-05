import { productService, userService, orderService, cartService } from '@/lib/firestore-services';
import { products } from '@/data/products';

// Simulate network delay
function wait(ms = 250) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Product API
export async function fetchProducts() {
  await wait();
  try {
    // Try to get products from Firestore first
    const firestoreProducts = await productService.getAllProducts();
    
    // If no products in Firestore, seed with initial data
    if (firestoreProducts.length === 0) {
      await seedProducts();
      return await productService.getAllProducts();
    }
    
    return firestoreProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to local data
    return products;
  }
}

export async function fetchProductById(id: string) {
  await wait();
  try {
    const product = await productService.getProductById(id);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to local data
    return products.find(p => p.id === id) || null;
  }
}

export async function fetchProductsByCategory(category: string) {
  await wait();
  try {
    const products = await productService.getProductsByCategory(category);
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    // Fallback to local data
    return products.filter(p => p.category === category);
  }
}

// User Authentication API
export async function loginUser(credentials: { email: string; password: string }) {
  await wait();
  try {
    const user = await userService.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(payload: { email: string; password: string; name: string }) {
  await wait();
  try {
    const userId = await userService.createUser({
      email: payload.email,
      name: payload.name,
    });
    return {
      id: userId,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Order API
export async function createOrder(orderPayload: any) {
  await wait();
  try {
    const orderId = await orderService.createOrder(orderPayload);
    return {
      orderId,
      status: 'pending',
      ...orderPayload,
    };
  } catch (error) {
    console.error('Order creation error:', error);
    throw error;
  }
}

export async function fetchUserOrders(userId: string) {
  await wait();
  try {
    const orders = await orderService.getUserOrders(userId);
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function fetchAllOrders() {
  await wait();
  try {
    const orders = await orderService.getAllOrders();
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await wait();
  try {
    await orderService.updateOrderStatus(orderId, status as any);
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Cart API
export async function fetchCartItems(userId: string) {
  await wait();
  try {
    const items = await cartService.getCartItems(userId);
    return items;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

// Admin API
export async function createProduct(productData: any) {
  await wait();
  try {
    const productId = await productService.createProduct(productData);
    return { id: productId, ...productData };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(productId: string, productData: any) {
  await wait();
  try {
    await productService.updateProduct(productId, productData);
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  await wait();
  try {
    await productService.deleteProduct(productId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Helper function to seed products in Firestore
async function seedProducts() {
  try {
    console.log('Seeding products to Firestore...');
    for (const product of products) {
      await productService.createProduct({
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        sizes: product.sizes,
        inStock: product.inStock,
      });
    }
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}
