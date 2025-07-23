import CategorySection from './CategorySection';
import ProductSection from './ProductSection';
import SliderData from "../Utils/BannersData.js";
import HeroSlider from '../../../common/HeroSlider';


export default function Home() {
  return (
    <div className="bg-[#F9F7FC]">
      <CategorySection />
      <HeroSlider banners={SliderData} />
      <ProductSection />
      
    </div>
  );
}

