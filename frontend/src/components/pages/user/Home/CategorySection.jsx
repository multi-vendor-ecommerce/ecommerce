import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryContext from "../../../../context/categories/CategoryContext";
import Spinner from "../../../common/Spinner";
import { encryptData } from "../Utils/Encryption";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function CategorySection() {
  const { categories, loading, getAllCategories } = useContext(CategoryContext);
  // const [isLoaded, setIsLoaded] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      await getAllCategories();
    };
    fetchCategories();
  }, []);

  const handleNavigate = (id) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const encryptedId = encryptData(id, secretKey);
    navigateTo(`product/category/${encodeURIComponent(encryptedId)}`);
  };

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <div className="bg-[#F9F7FC] py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        <h2 className="text-xl md:text-2xl font-semibold py-4 text-gray-700 text-start">Shop by Categories</h2>

        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 7 },
          }}
        >
          {categories?.map((cat) => (
            <SwiperSlide key={cat._id}>
              <div
                onClick={() => handleNavigate(cat._id)}
                className="cursor-pointer w-full flex flex-col items-center text-center "
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover "
                  />
                </div>
                <span className="mt-1 text-sm  lg:text-md font-medium text-black truncate w-full">
                  {cat.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}