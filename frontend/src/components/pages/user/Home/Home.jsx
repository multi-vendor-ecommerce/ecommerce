import React from 'react';
import HeroSection from './HeroSection';
import CategorySection from './CategorySection';
import ProductSection from './ProductSection';

export default function Home() {
  return (
    <div className="mt-16 bg-amber-50"> {/* Add padding if you have fixed header */}
      <HeroSection />
      <CategorySection />
      <ProductSection title="Top Deals for You" />
      <ProductSection title="Electronics Bestsellers" />
      <ProductSection title="Fashion Picks" />
    </div>
  );
}
