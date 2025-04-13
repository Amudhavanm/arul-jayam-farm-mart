
import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  colors: string[];
  specifications: string[];
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  minPrice: number;
  maxPrice: number;
  categories: { value: string; label: string }[];
  colors: { value: string; label: string }[];
  specifications: { value: string; label: string }[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilterChange,
  minPrice,
  maxPrice,
  categories,
  colors,
  specifications,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSpecifications, setSelectedSpecifications] = useState<string[]>([]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const toggleSpecification = (spec: string) => {
    setSelectedSpecifications((prev) =>
      prev.includes(spec)
        ? prev.filter((s) => s !== spec)
        : [...prev, spec]
    );
  };

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      colors: selectedColors,
      specifications: selectedSpecifications,
    });
  };

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSpecifications([]);
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      categories: [],
      colors: [],
      specifications: [],
    });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Button
          onClick={toggleFilter}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          {isFilterOpen ? (
            <>
              <X size={18} className="mr-2" />
              Close Filters
            </>
          ) : (
            <>
              <Filter size={18} className="mr-2" />
              Filter Products
            </>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      <div
        className={`${
          isFilterOpen ? "block" : "hidden md:block"
        } w-full md:w-64 lg:w-72 mb-6 md:mb-0`}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Filter Products
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs text-muted-foreground"
              >
                Reset
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <Slider
                defaultValue={[minPrice, maxPrice]}
                value={priceRange}
                min={minPrice}
                max={maxPrice}
                step={100}
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm">
                <span className="rupee-symbol">{priceRange[0].toLocaleString('en-IN')}</span>
                <span className="rupee-symbol">{priceRange[1].toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Separator />

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={selectedCategories.includes(category.value)}
                      onCheckedChange={() => toggleCategory(category.value)}
                    />
                    <Label
                      htmlFor={`category-${category.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <div>
              <h3 className="font-medium mb-3">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Badge
                    key={color.value}
                    variant={selectedColors.includes(color.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleColor(color.value)}
                  >
                    {color.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Specifications */}
            <div>
              <h3 className="font-medium mb-3">Specifications</h3>
              <div className="space-y-2">
                {specifications.map((spec) => (
                  <div key={spec.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`spec-${spec.value}`}
                      checked={selectedSpecifications.includes(spec.value)}
                      onCheckedChange={() => toggleSpecification(spec.value)}
                    />
                    <Label
                      htmlFor={`spec-${spec.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {spec.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={applyFilters} className="w-full mt-4">
              Apply Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductFilter;
