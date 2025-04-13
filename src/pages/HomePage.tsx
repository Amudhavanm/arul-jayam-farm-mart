
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import HeroCarousel from "@/components/home/HeroCarousel";
import SearchBar from "@/components/home/SearchBar";
import ProductFilter from "@/components/home/ProductFilter";
import ProductGrid from "@/components/product/ProductGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import { mockProducts } from "@/utils/mockData";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  colors: string[];
  specifications: string[];
}

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  colors: string[];
  specifications: string[];
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);

  const minPrice = Math.min(...mockProducts.map((product) => product.price));
  const maxPrice = Math.max(...mockProducts.map((product) => product.price));

  const categories = [
    { value: "tractors", label: "Tractors" },
    { value: "harvesters", label: "Harvesters" },
    { value: "tillers", label: "Tillers & Cultivators" },
    { value: "seeders", label: "Seeders & Planters" },
    { value: "sprayers", label: "Sprayers" },
  ];

  const colors = [
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
    { value: "yellow", label: "Yellow" },
    { value: "black", label: "Black" },
  ];

  const specifications = [
    { value: "high-power", label: "High Power" },
    { value: "fuel-efficient", label: "Fuel Efficient" },
    { value: "compact", label: "Compact Size" },
    { value: "heavy-duty", label: "Heavy Duty" },
    { value: "electric", label: "Electric" },
  ];

  // Get recently viewed products from localStorage on component mount
  useEffect(() => {
    const storedRecentlyViewed = localStorage.getItem("recentlyViewed");
    if (storedRecentlyViewed) {
      const parsedViewed = JSON.parse(storedRecentlyViewed);
      const viewedProducts = parsedViewed
        .map((id: string) => mockProducts.find((p) => p._id === id))
        .filter(Boolean);
      setRecentlyViewed(viewedProducts);
    }

    // Set up top selling products (first 5 products for demo)
    setTopSellingProducts(mockProducts.slice(0, 5));
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredProducts(products);
      return;
    }

    const searchResults = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(searchResults);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    const { priceRange, categories, colors, specifications } = filters;

    const filtered = products.filter((product) => {
      // Filter by price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Filter by categories
      if (categories.length > 0 && !categories.includes(product.category)) {
        return false;
      }

      // Filter by colors
      if (colors.length > 0 && !product.colors.some(color => colors.includes(color))) {
        return false;
      }

      // Filter by specifications
      if (
        specifications.length > 0 &&
        !specifications.every(spec => product.specifications.includes(spec))
      ) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  };

  return (
    <Layout>
      <HeroCarousel />
      
      <div className="container px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        
        {recentlyViewed.length > 0 && (
          <ProductCarousel
            products={recentlyViewed}
            title="Recently Viewed Products"
          />
        )}
        
        <ProductCarousel
          products={topSellingProducts}
          title="Top Selling Products"
        />
        
        <div className="flex flex-col md:flex-row gap-6 mt-8" id="products">
          <ProductFilter
            onFilterChange={handleFilterChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categories={categories}
            colors={colors}
            specifications={specifications}
          />
          
          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              title={searchTerm ? `Search Results for "${searchTerm}"` : "All Products"}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
