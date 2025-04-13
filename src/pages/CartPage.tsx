
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, toggleSelectItem, selectAllItems, subtotal } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    selectAllItems(newSelectAll);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleCheckout = () => {
    if (cart.filter(item => item.selected).length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to proceed to checkout.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to proceed to checkout.",
      });
      navigate("/login");
      return;
    }
    
    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cart.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Checkbox
                      id="select-all"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="mr-3"
                    />
                    <CardTitle>Select All Items</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center py-4">
                      <Checkbox
                        id={`select-${item._id}`}
                        checked={item.selected}
                        onCheckedChange={() => toggleSelectItem(item._id)}
                        className="mr-4"
                      />
                      
                      <div className="w-20 h-20 flex-shrink-0 mr-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item._id}`} className="font-medium hover:text-primary">
                          {item.name}
                        </Link>
                        
                        {item.color && (
                          <p className="text-sm text-muted-foreground">
                            Color: <span className="capitalize">{item.color}</span>
                          </p>
                        )}
                        
                        <p className="font-medium text-primary rupee-symbol">
                          {item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      <div className="flex items-center mr-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 1) {
                              handleQuantityChange(item._id, value);
                            }
                          }}
                          className="w-14 h-8 mx-2 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium rupee-symbol">
                      {subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {subtotal > 10000 ? "Free" : <span className="rupee-symbol">500</span>}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="rupee-symbol">
                      {subtotal > 0
                        ? (subtotal > 10000 
                          ? subtotal 
                          : subtotal + 500
                        ).toLocaleString('en-IN')
                        : 0}
                    </span>
                  </div>
                  
                  {!cart.some(item => item.selected) && (
                    <div className="flex items-center text-amber-600 text-sm mt-2">
                      <AlertCircle size={16} className="mr-2" />
                      <span>Please select at least one item</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={!cart.some(item => item.selected)}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
