import CategorySection from './CategorySection';
import ProductSection from './ProductSection';
import SliderData from "../Utils/BannersData.js";
import HeroSlider from '../../../common/HeroSlider';


export default function Home() {
  return (
    <div className="bg-gray-100">
      <CategorySection />
        <HeroSlider banners={SliderData} />

      <ProductSection />
      {/* <ProductSection title="Electronics Bestsellers" />
      <ProductSection title="Fashion Picks" /> */}
    </div>
  );
}

