
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="product-card h-full flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="mb-4 flex-grow-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image mx-auto hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <p className="price-tag rupee-symbol">{product.price.toLocaleString('en-IN')}</p>
          <Link to={`/product/${product._id}`}>
            <Button variant="outline">View Product</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
