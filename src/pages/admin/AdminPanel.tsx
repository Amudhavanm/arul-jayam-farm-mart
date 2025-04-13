
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Tag, TrendingUp, Users } from "lucide-react";
import { mockProducts, mockOrders } from "@/utils/mockData";

const AdminPanel: React.FC = () => {
  // Count products
  const totalProducts = mockProducts.length;
  
  // Count orders
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(order => order.status === "pending").length;
  
  // Calculate total revenue
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="h-5 w-5 text-muted-foreground" />,
      description: "Products in inventory",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBag className="h-5 w-5 text-muted-foreground" />,
      description: "Orders received",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <Tag className="h-5 w-5 text-muted-foreground" />,
      description: "Orders awaiting processing",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: <TrendingUp className="h-5 w-5 text-muted-foreground" />,
      description: "Revenue generated",
    },
  ];
  
  const actions = [
    {
      title: "Add Product",
      description: "Add a new product to the inventory",
      href: "/admin/add-product",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Update Product",
      description: "Update existing product details or stock",
      href: "/admin/update-product",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "View Orders",
      description: "Manage customer orders and deliveries",
      href: "/admin/view-orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
  ];
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-primary/10 p-2 rounded-full mr-3">{action.icon}</span>
                  {action.title}
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={action.href}>Go to {action.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
