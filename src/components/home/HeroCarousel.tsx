
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CarouselSlide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: CarouselSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1974&auto=format&fit=crop",
    title: "Premium Agricultural Machinery",
    description: "Discover our wide range of high-quality agricultural equipment for your farm",
    buttonText: "Shop Now",
    buttonLink: "/#products",
  },
  {
    image: "https://images.unsplash.com/photo-1625246333195-78d73c0572bc?q=80&w=2070&auto=format&fit=crop",
    title: "New Tractor Models",
    description: "Explore our latest tractor models with advanced features and great efficiency",
    buttonText: "View Tractors",
    buttonLink: "/#products",
  },
  {
    image: "https://images.unsplash.com/photo-1598887253108-c46d12fb9a10?q=80&w=2070&auto=format&fit=crop",
    title: "Harvesting Equipment",
    description: "Make your harvest easier and more efficient with our specialized equipment",
    buttonText: "Learn More",
    buttonLink: "/#products",
  },
];

const HeroCarousel: React.FC = () => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="carousel-item relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white p-4 max-w-3xl">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-6">{slide.description}</p>
                  <Link to={slide.buttonLink}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      {slide.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" variant="secondary" />
      <CarouselNext className="right-4" variant="secondary" />
    </Carousel>
  );
};

export default HeroCarousel;
