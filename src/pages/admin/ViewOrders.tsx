
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckSquare, ClipboardCheck, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { mockOrders } from "@/utils/mockData";
import { format } from "date-fns";

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  color?: string;
  completed?: boolean;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  products: OrderProduct[];
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

const ViewOrders: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompleted, setFilterCompleted] = useState(false);
  
  useEffect(() => {
    // Initialize orders with product completion status
    const initializedOrders = mockOrders.map((order) => ({
      ...order,
      products: order.products.map((product) => ({
        ...product,
        completed: false,
      })),
    }));
    
    // Sort by date (newest first)
    initializedOrders.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setOrders(initializedOrders);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is handled by filteredOrders below
  };
  
  const handleToggleProductCompletion = (orderId: string, productId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              products: order.products.map((product) =>
                product.product._id === productId
                  ? { ...product, completed: !product.completed }
                  : product
              ),
            }
          : order
      )
    );
  };
  
  const handleCompleteOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? { ...order, status: "delivered" }
          : order
      )
    );
    
    toast({
      title: "Order Completed",
      description: `Order #${orders.find((o) => o._id === orderId)?.orderId} has been marked as delivered.`,
    });
  };
  
  const isOrderReady = (order: Order) => {
    return order.products.every((product) => product.completed);
  };
  
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompletionFilter = filterCompleted
      ? order.status === "delivered"
      : order.status !== "delivered";
    
    return matchesSearch && matchesCompletionFilter;
  });
  
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
  
  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Admin Panel
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-2xl">Manage Orders</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  id="filter-completed"
                  checked={filterCompleted}
                  onCheckedChange={setFilterCompleted}
                />
                <Label htmlFor="filter-completed">Show Completed Orders</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by order ID, customer name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </div>
            </form>
            
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {filterCompleted
                    ? "No completed orders match your search."
                    : "No pending orders match your search."}
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredOrders.map((order) => (
                  <AccordionItem
                    key={order._id}
                    value={order._id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between text-left gap-2">
                        <div>
                          <h3 className="font-medium text-lg">
                            Order #{order.orderId}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.createdAt), "PP p")}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <span className="font-medium rupee-symbol">
                            {order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-6 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <h4 className="font-semibold mb-2">Customer</h4>
                          <p className="text-muted-foreground">
                            {order.user.username}<br />
                            {order.user.email}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Shipping Address</h4>
                          <p className="text-muted-foreground">
                            {order.shippingAddress.doorNumber},{" "}
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                            {order.shippingAddress.pincode}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Payment</h4>
                          <p className="text-muted-foreground capitalize">
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : order.paymentMethod === "upi"
                              ? "UPI Payment"
                              : "Net Banking"}
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h4 className="font-semibold mb-4">Order Items</h4>
                      
                      <div className="space-y-4">
                        {order.products.map((item) => (
                          <div
                            key={item.product._id}
                            className="flex items-center space-x-4 py-2"
                          >
                            <input
                              type="checkbox"
                              id={`item-${order._id}-${item.product._id}`}
                              checked={!!item.completed}
                              onChange={() =>
                                handleToggleProductCompletion(order._id, item.product._id)
                              }
                              disabled={order.status === "delivered"}
                              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            
                            <div className="w-16 h-16">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h5 className="font-medium">
                                {item.product.name}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} {item.color && `• ${item.color}`}
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-medium rupee-symbol">
                                {(item.product.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {order.status !== "delivered" && (
                        <div className="mt-6 flex justify-end">
                          <Button
                            onClick={() => handleCompleteOrder(order._id)}
                            disabled={!isOrderReady(order)}
                            className="flex items-center"
                          >
                            <CheckSquare size={16} className="mr-2" />
                            Complete Order
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ViewOrders;
