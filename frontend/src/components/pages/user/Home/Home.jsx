import { useContext, useEffect } from 'react';
import CategorySection from './Category/CategorySection.jsx';
// import ProductByCategory from '../Product/ProductsByCategory.jsx';
import ProductSection from './ProductSection';
import HeroSlider from '../../../common/HeroSlider';
import TopSellingProducts from '../Product/TopSellingProducts.jsx';
import RecentlyProductList from '../Product/RecentlyProductList.jsx';
import BannerContext from '../../../../context/banners/BannersContext.jsx';
import Spinner from '../../../common/Spinner.jsx';

export default function Home() {
  const { banners, loading, error, getBanners } = useContext(BannerContext);

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div className="bg-white relative">
      <div>
        <CategorySection />
        <TopSellingProducts />

        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : banners.length > 0 ? (
          <HeroSlider banners={banners} />
        ) : null}


        <RecentlyProductList />
        <ProductSection />
        {/* <ProductByCategory /> */}
      </div>
    </div>
  );
}
