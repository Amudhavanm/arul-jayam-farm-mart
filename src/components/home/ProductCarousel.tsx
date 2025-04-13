
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title }) => {
  if (products.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/3">
              <div className="product-card p-1 h-full">
                <div className="flex flex-col h-full p-6">
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain w-full h-48 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="price-tag rupee-symbol">
                      {product.price.toLocaleString('en-IN')}
                    </p>
                    <Link to={`/product/${product._id}`}>
                      <Button variant="outline">View Product</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
