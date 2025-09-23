import CategorySection from './Category/CategorySection.jsx';
// import ProductByCategory from '../Product/ProductsByCategory.jsx';
import ProductSection from './ProductSection';
import SliderData from "../Utils/BannersData.js";
import HeroSlider from '../../../common/HeroSlider';
import TopSellingProducts from '../Product/TopSellingProducts.jsx';
import RecentlyProductList from '../Product/RecentlyProductList.jsx';

export default function Home() {
  return (
    <div className="bg-white relative">
      {/* Add top padding to prevent header overlap */}
      <div>
        <CategorySection />
        <TopSellingProducts />
        <HeroSlider banners={SliderData} />
        <RecentlyProductList />
        <ProductSection />
        {/* <ProductByCategory /> */}
      </div>
    </div>
  );
}

