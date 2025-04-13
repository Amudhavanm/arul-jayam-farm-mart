
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  selected: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "selected">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSelectItem: (productId: string) => void;
  selectAllItems: (selected: boolean) => void;
  clearCart: () => void;
  getSelectedItems: () => CartItem[];
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Omit<CartItem, "selected">) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(item => item._id === product._id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + product.quantity,
          color: product.color || updatedCart[existingItemIndex].color
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add new item
        return [...prevCart, { ...product, selected: false }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleSelectItem = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectAllItems = (selected: boolean) => {
    setCart((prevCart) =>
      prevCart.map((item) => ({ ...item, selected }))
    );
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const getSelectedItems = () => {
    return cart.filter(item => item.selected);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.selected ? item.price * item.quantity : 0),
    0
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleSelectItem,
    selectAllItems,
    clearCart,
    getSelectedItems,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
