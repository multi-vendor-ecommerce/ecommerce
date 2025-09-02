import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HeroSlider = ({ banners = [] }) => {
  if (!Array.isArray(banners) || banners.length === 0) return null;

  return (
    <div className="max-w-9xl bg-green-50 py-4 lg:py-5">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="rounded-xl overflow-hidden shadow-sm"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id || index}>
              <div className="w-full h-64 md:h-96 relative group">
                <img
                  src={banner.image}
                  alt={banner.title || `Banner ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent " />

                {/* Text content overlay */}
                {(banner.title || banner.description) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 ">
                    {banner.title && (
                      <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                        {banner.title}
                      </h2>
                    )}
                    {banner.description && (
                      <p className="text-base md:text-xl mt-2 text-white max-w-2xl drop-shadow">
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
