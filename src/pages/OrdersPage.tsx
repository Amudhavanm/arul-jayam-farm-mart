
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileDown, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

interface Order {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  products: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    color?: string;
  }>;
  shippingAddress: {
    doorNumber: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: string;
  orderId: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    // Filter orders for the current user
    const userOrders = user
      ? allOrders.filter((order: Order) => order.user._id === user._id)
      : [];
    
    // Sort orders by date (newest first)
    userOrders.sort((a: Order, b: Order) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setOrders(userOrders);
    setLoading(false);
  }, [user]);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500 hover:bg-green-600";
      case "shipped":
        return "bg-blue-500 hover:bg-blue-600";
      case "processing":
        return "bg-amber-500 hover:bg-amber-600";
      case "pending":
        return "bg-orange-500 hover:bg-orange-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  const downloadOrderSummary = (orderId: string) => {
    // In a real app, this would generate a PDF
    alert(`Downloading summary for order ${orderId}`);
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
        
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        
        {loading ? (
          <p className="text-center py-12">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet.
                </p>
                <Button asChild>
                  <a href="/">Continue Shopping</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.orderId}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {format(new Date(order.createdAt), "PPP")}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        onClick={() => downloadOrderSummary(order.orderId)}
                      >
                        <FileDown size={14} className="mr-1" />
                        Summary
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  {/* Order Items */}
                  <div className="space-y-4 mb-4">
                    {order.products.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-16 h-16">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} {item.color && `• ${item.color}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium rupee-symbol">
                            {item.product.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">Shipping Address</h4>
                      <p className="text-muted-foreground">
                        {order.shippingAddress.doorNumber},{" "}
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                        {order.shippingAddress.pincode}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">Payment Method</h4>
                      <p className="text-muted-foreground capitalize">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod === "upi"
                          ? "UPI Payment"
                          : "Net Banking"}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">Order Total</h4>
                      <p className="text-lg font-bold text-primary rupee-symbol">
                        {order.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
