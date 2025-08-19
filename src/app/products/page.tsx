'use client'

import { useEffect, useState } from 'react';
import { 
  Product, 
  CartItem, 
  fetchProducts as fetchProductsApi,
  fetchCart as fetchCartApi,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi
} from '../services/products.service';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await fetchProductsApi();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await fetchCartApi();
      setCartItems(data);
    } catch (err) {
      setCartError(err instanceof Error ? err.message : 'Error fetching cart');
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await addToCartApi(productId);
      await fetchCart();
    } catch (err) {
      setCartError(err instanceof Error ? err.message : 'Error adding to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await removeFromCartApi(productId);
      await fetchCart();
    } catch (err) {
      setCartError(err instanceof Error ? err.message : 'Error removing from cart');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-start">
        <div className="w-2/3 pr-4">
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.productId}
                className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">${product.price}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => addToCart(product.productId)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-1/3 pl-4">
          <div className="border rounded-lg p-4 shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            {cartError && <p className="text-red-500 mb-4">{cartError}</p>}
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
