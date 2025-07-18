// components/common/HeroSlider.jsx

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HeroSlider = ({ banners = [] }) => {
  if (!Array.isArray(banners) || banners.length === 0) return null;

  return (
    <div className="w-full bg-white py-2">
      <div className="mx-auto px-4 sm:px-4 lg:px-6">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="rounded-lg overflow-hidden"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id || index}>
              <div className="w-full h-60 md:h-80 relative">
                <img
                  src={banner.image}
                  alt={banner.title || `Banner ${index + 1}`}
                  className="w-full h-full object-cover brightness-75"
                />

                {(banner.title || banner.description) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    {banner.title && (
                      <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">
                        {banner.title}
                      </h2>
                    )}
                    {banner.description && (
                      <p className="text-sm md:text-lg mt-1 text-white drop-shadow-sm">
                        {banner.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSlider;
