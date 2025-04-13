
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Loader, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { mockProducts } from "@/utils/mockData";

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  stock: string;
  colors: string[];
  specifications: string[];
  images: string[];
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    colors: [],
    specifications: [],
    images: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newSpecification, setNewSpecification] = useState("");
  
  const categories = [
    { value: "tractors", label: "Tractors" },
    { value: "harvesters", label: "Harvesters" },
    { value: "tillers", label: "Tillers & Cultivators" },
    { value: "seeders", label: "Seeders & Planters" },
    { value: "sprayers", label: "Sprayers" },
  ];
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }));
      setNewColor("");
    }
  };
  
  const handleRemoveColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };
  
  const handleAddSpecification = () => {
    if (
      newSpecification.trim() &&
      !formData.specifications.includes(newSpecification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, newSpecification.trim()],
      }));
      setNewSpecification("");
    }
  };
  
  const handleRemoveSpecification = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((s) => s !== spec),
    }));
  };
  
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, this would upload to a storage service
    // Here we'll create data URLs for the selected images
    const newImages = Array.from(files).map((file) => {
      return URL.createObjectURL(file);
    });
    
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a product name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a product description.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.category) {
      toast({
        title: "Missing Information",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.stock.trim() || isNaN(Number(formData.stock))) {
      toast({
        title: "Invalid Stock",
        description: "Please enter a valid stock quantity.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.images.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please upload at least one product image.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to save the product
    setTimeout(() => {
      // Create a new product object
      const newProduct = {
        _id: `product_${Date.now()}`,
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        image: formData.images[0], // First image is the main image
        images: formData.images,
        category: formData.category,
        colors: formData.colors,
        specifications: formData.specifications,
        stock: Number(formData.stock),
        rating: 0,
      };
      
      // For demo purposes, add to mockProducts array
      mockProducts.push(newProduct);
      
      toast({
        title: "Product Added",
        description: "The product has been added successfully.",
      });
      
      setIsSubmitting(false);
      navigate("/admin/update-product");
    }, 1500);
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
            <CardTitle className="text-2xl">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Compact Tractor - 25HP"
                    required
                  />
                </div>
                
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 385000"
                    required
                  />
                </div>
                
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock">
                    Stock <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    required
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              {/* Colors */}
              <div className="space-y-3">
                <Label>Colors</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.colors.map((color, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center space-x-1"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="ml-2 text-muted-foreground hover:text-destructive"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a color (e.g. red, blue)"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddColor}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Specifications */}
              <div className="space-y-3">
                <Label>Specifications</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecification(spec)}
                        className="ml-2 text-muted-foreground hover:text-destructive"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a specification (e.g. high-power)"
                    value={newSpecification}
                    onChange={(e) => setNewSpecification(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddSpecification}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Product Images */}
              <div className="space-y-3">
                <Label>
                  Product Images <span className="text-destructive">*</span>
                </Label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square border rounded-md overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        &times;
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs py-1 text-center">
                          Main Image
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                  >
                    <ImageIcon className="h-8 w-8 mb-2" />
                    <span className="text-sm">Add Image</span>
                  </button>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                
                <p className="text-xs text-muted-foreground">
                  Upload product images. The first image will be used as the main product image.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" />
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Plus size={16} className="mr-2" />
                      Add Product
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddProduct;
