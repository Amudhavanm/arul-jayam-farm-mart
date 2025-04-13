
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileDown, Truck, CreditCard, Smartphone } from "lucide-react";
import { generateOrderId } from "@/utils/mockData";

interface AddressForm {
  doorNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getSelectedItems, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const selectedItems = getSelectedItems();
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;
  
  const [addressForm, setAddressForm] = useState<AddressForm>({
    doorNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  React.useEffect(() => {
    // Redirect if no items are selected
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items in your cart first.",
        variant: "destructive",
      });
      navigate("/cart");
    }
  }, [selectedItems, navigate, toast]);
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const generateOrderSummaryPDF = (orderId: string) => {
    // In a real application, this would generate a PDF
    // For this demo, we'll just display a success message
    toast({
      title: "Order Summary Generated",
      description: `Your order #${orderId} summary has been generated.`,
    });
  };
  
  const handlePlaceOrder = () => {
    // Validate form
    const { doorNumber, street, city, state, pincode } = addressForm;
    if (!doorNumber || !street || !city || !state || !pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all address fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to create order
    setTimeout(() => {
      try {
        const orderId = generateOrderId();
        
        // Store the order in localStorage for demo purposes
        const newOrder = {
          _id: `order_${Date.now()}`,
          user: {
            _id: user?._id,
            username: user?.username,
            email: user?.email,
          },
          products: selectedItems.map(item => ({
            product: {
              _id: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
            },
            quantity: item.quantity,
            color: item.color,
          })),
          shippingAddress: addressForm,
          paymentMethod,
          totalAmount: total,
          status: "pending",
          orderId,
          createdAt: new Date().toISOString(),
        };
        
        const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));
        
        // Clear the selected items from cart
        selectedItems.forEach(item => {
          clearCart();
        });
        
        toast({
          title: "Order Placed Successfully",
          description: `Your order #${orderId} has been placed.`,
        });
        
        generateOrderSummaryPDF(orderId);
        
        // Redirect to orders page
        navigate("/orders");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to place order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Cart
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck size={20} className="mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doorNumber">Door/Flat Number</Label>
                    <Input
                      id="doorNumber"
                      name="doorNumber"
                      value={addressForm.doorNumber}
                      onChange={handleAddressChange}
                      placeholder="e.g. 42, Flat 3B"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Name</Label>
                    <Input
                      id="street"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      placeholder="e.g. Main Street"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Village</Label>
                    <Input
                      id="city"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      placeholder="e.g. Chennai"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      placeholder="e.g. Tamil Nadu"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleAddressChange}
                    placeholder="e.g. 600001"
                    required
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard size={20} className="mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-secondary/50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="cursor-pointer flex items-center">
                      <Smartphone size={18} className="mr-2" />
                      UPI Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-secondary/50">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="cursor-pointer flex items-center">
                      <CreditCard size={18} className="mr-2" />
                      Net Banking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-secondary/50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="cursor-pointer flex items-center">
                      <Truck size={18} className="mr-2" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} {item.color && `• ${item.color}`}
                        </p>
                      </div>
                      <p className="font-medium rupee-symbol">
                        {(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium rupee-symbol">
                      {subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : <span className="rupee-symbol">{shipping}</span>}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="rupee-symbol">
                      {total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-4"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  disabled={isSubmitting}
                  onClick={() => generateOrderSummaryPDF("PREVIEW")}
                >
                  <FileDown size={16} className="mr-2" />
                  Download Summary
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
