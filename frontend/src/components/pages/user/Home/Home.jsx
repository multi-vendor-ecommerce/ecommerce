import CategorySection from './Category/CategorySection.jsx';
// import ProductByCategory from '../Product/ProductsByCategory.jsx';
import ProductSection from './ProductSection';
import SliderData from "../Utils/BannersData.js";
import HeroSlider from '../../../common/HeroSlider';
import TopSellingProducts from '../Product/TopSellingProducts.jsx';


export default function Home() {
  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-100">
      <CategorySection />
      <TopSellingProducts />
      <HeroSlider banners={SliderData} />
      <ProductSection />

      {/* <ProductByCategory /> */}
    </div>
  );
}

