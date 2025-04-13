
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Heart, Truck, Shield, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { mockProducts } from "@/utils/mockData";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // In a real app, fetch product by ID from backend
    const fetchedProduct = mockProducts.find(p => p._id === id);
    
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      setSelectedColor(fetchedProduct.colors[0] || "");
      
      // Find similar products from the same category
      const similar = mockProducts
        .filter(p => p.category === fetchedProduct.category && p._id !== id)
        .slice(0, 4);
      setSimilarProducts(similar);
      
      // Add to recently viewed
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      if (!recentlyViewed.includes(id)) {
        const updatedRecentlyViewed = [id, ...recentlyViewed].slice(0, 6);
        localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecentlyViewed));
      }
    } else {
      setError("Product not found");
    }
    
    setLoading(false);
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images ? product.images[0] : product.image,
      quantity,
      color: selectedColor
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading product details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-xl text-red-500 mb-4">{error || "Product not found"}</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2" size={16} />
              Back to Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // If product has multiple images, use them, otherwise create an array with the single image
  const productImages = product.images || [product.image];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="overflow-hidden rounded-lg mb-4 border border-gray-200 bg-white">
              <img
                src={productImages[activeImageIndex]}
                alt={product.name}
                className="w-full h-[400px] object-contain p-4"
              />
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`border rounded-md overflow-hidden cursor-pointer transition-all h-20 w-20 flex-shrink-0 ${
                      activeImageIndex === index ? "border-primary" : "border-gray-200"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-primary mb-4 rupee-symbol">
              {product.price.toLocaleString('en-IN')}
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Available Colors</h3>
                <RadioGroup
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="flex space-x-2"
                >
                  {product.colors.map((color: string) => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={color}
                        id={`color-${color}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="capitalize flex items-center space-x-1 rounded-md border-2 border-muted bg-popover px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        ></span>
                        <span>{color}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 mx-2 text-center"
                />
                <Button variant="outline" size="icon" onClick={increaseQuantity}>
                  +
                </Button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="flex space-x-3 mb-8">
              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2" size={18} />
                Add to Cart
              </Button>
              <Button variant="outline">
                <Heart size={18} />
              </Button>
            </div>
            
            {/* Product Metadata */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-start space-x-3">
                <Truck className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-muted-foreground">For orders above ₹10,000</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-medium">1 Year Warranty</p>
                  <p className="text-sm text-muted-foreground">Manufacturer warranty included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications & Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="specifications">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Engine</h4>
                    <p className="text-sm">Powerful 30 HP diesel engine with high torque</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Weight</h4>
                    <p className="text-sm">1500 kg</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Dimensions</h4>
                    <p className="text-sm">L: 3.2m, W: 1.8m, H: 2.1m</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Fuel Capacity</h4>
                    <p className="text-sm">45 liters</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-6">
              <ul className="list-disc pl-5 space-y-2">
                <li>Advanced hydraulic system for better control</li>
                <li>Ergonomic seat with lumbar support for comfort during long working hours</li>
                <li>LED lighting for night operations</li>
                <li>Digital instrument cluster</li>
                <li>Power steering for easy maneuverability</li>
                <li>Tiltable steering wheel</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <p className="text-center text-muted-foreground">
                No reviews yet for this product.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <ProductGrid products={similarProducts} title="Similar Products" />
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
