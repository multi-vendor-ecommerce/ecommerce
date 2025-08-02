// import CategorySection from './Category/CategorySection.jsx';
import ProductSection from './ProductSection';
import SliderData from "../Utils/BannersData.js";
import HeroSlider from '../../../common/HeroSlider';
// import CategoryMenu from './Category/CategoryMenu.jsx';


export default function Home() {
  return (
    <div className="bg-[#F9F7FC]">
      {/* <CategorySection /> */}
      {/* <CategoryMenu /> */}
      <HeroSlider banners={SliderData} />
      <ProductSection />
      
    </div>
  );
}

