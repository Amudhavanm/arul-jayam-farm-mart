
import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium">No products found</h2>
        <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
