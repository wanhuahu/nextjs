export interface Product {
  productId: string;
  name: string;
  price: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name?: string;
}

const API_URL = 'http://localhost:3001';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchCart = async (): Promise<CartItem[]> => {
  const response = await fetch(`${API_URL}/cart`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

export const addToCart = async (productId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add to cart');
  }
};

export const removeFromCart = async (productId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove from cart');
  }
};
