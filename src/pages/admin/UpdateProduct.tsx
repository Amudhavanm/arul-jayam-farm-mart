
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Edit, Loader, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { mockProducts } from "@/utils/mockData";

const UpdateProduct: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([...mockProducts]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [newStock, setNewStock] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is done automatically via the filteredProducts variable
  };
  
  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setNewStock(product.stock.toString());
  };
  
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStock(e.target.value);
  };
  
  const handleUpdateStock = () => {
    if (!selectedProduct) return;
    
    if (!newStock.trim() || isNaN(Number(newStock)) || Number(newStock) < 0) {
      toast({
        title: "Invalid Stock",
        description: "Please enter a valid stock quantity.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    // In a real app, this would be an API call to update the stock
    setTimeout(() => {
      // Update the stock in the local products array
      const updatedProducts = products.map((product) =>
        product._id === selectedProduct._id
          ? { ...product, stock: Number(newStock) }
          : product
      );
      
      // Update the mockProducts array as well
      const index = mockProducts.findIndex((p) => p._id === selectedProduct._id);
      if (index !== -1) {
        mockProducts[index].stock = Number(newStock);
      }
      
      setProducts(updatedProducts);
      
      toast({
        title: "Stock Updated",
        description: `The stock for ${selectedProduct.name} has been updated to ${newStock}.`,
      });
      
      setIsUpdating(false);
      setSelectedProduct(null);
    }, 1000);
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
            <CardTitle className="text-2xl">Update Products</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by product name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </div>
            </form>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Current Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-contain"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="capitalize">
                          {product.category}
                        </TableCell>
                        <TableCell className="text-right rupee-symbol">
                          {product.price.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.stock}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit size={16} className="mr-1" />
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Update Stock Dialog */}
        <Dialog
          open={!!selectedProduct}
          onOpenChange={(open) => {
            if (!open) setSelectedProduct(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock</DialogTitle>
              <DialogDescription>
                Update the stock quantity for {selectedProduct?.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedProduct?.image}
                  alt={selectedProduct?.name}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h4 className="font-medium">{selectedProduct?.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedProduct?.category}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={handleStockChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedProduct(null)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateStock} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Stock"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
