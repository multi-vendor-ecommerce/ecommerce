import React, { useEffect, useRef } from "react";
import BannerData from "../Utils/BannersData";

export default function HeroSection() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;
      const bannerWidth = container.offsetWidth;
      const maxScrollLeft = container.scrollWidth - bannerWidth;

      if (container.scrollLeft >= maxScrollLeft) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: bannerWidth, behavior: "smooth" });
      }
    }, 30000); // scroll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {BannerData.map((banner) => (
          <div
            key={banner.id}
            className="flex-shrink-0 w-full h-60 md:h-80 relative snap-start"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">
                {banner.title}
              </h2>
              <p className="text-sm md:text-lg mt-1 text-white drop-shadow-sm">
                {banner.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
