import React from 'react';
import HeroSection from './HeroSection';
import CategorySection from './CategorySection';
import ProductSection from './ProductSection';


export default function Home() {
  return (
    <div className="bg-user-base text-user-dark">
      <CategorySection />
      <HeroSection />
      <ProductSection />
      {/* <ProductSection title="Electronics Bestsellers" />
      <ProductSection title="Fashion Picks" /> */}
    </div>
  );
}

