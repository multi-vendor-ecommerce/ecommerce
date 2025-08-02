import React, { useContext, useEffect, useState } from "react";
import CategoryContext from "../../../../../context/categories/CategoryContext";
import CategoryColumn from "./CategoryColumn";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../../Utils/Encryption";

const CategoryMenu = () => {
    const { getCategoriesByLevel } = useContext(CategoryContext);
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    const navigateTo = useNavigate();

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useEffect(() => {
        const loadMainCategories = async () => {
            const topLevel = await getCategoriesByLevel(1);
            setMainCategories(topLevel);
        };
        loadMainCategories();
    }, []);

    const handleHover = async (id) => {
        if (!subCategories[id]) {
            const subCats = await getCategoriesByLevel(2, id);
            setSubCategories((prev) => ({ ...prev, [id]: subCats }));
        }
        setActiveCategory(id);
    };

    const handleNavigate = (id) => {
        const encryptedId = encryptData(id, import.meta.env.VITE_SECRET_KEY);
        navigateTo(`/product/category/${encodeURIComponent(encryptedId)}`);
    };

    return (
        <div className="relative py-10 border-gray-200">
            <ul className="flex gap-5 px-5 py-3 list-none overflow-x-auto whitespace-nowrap">
                {mainCategories.map((cat) => (
                    <li
                        key={cat._id}
                        onClick={() => isMobile ? handleHover(cat._id) : handleNavigate(cat._id)}
                        onMouseEnter={() => !isMobile && handleHover(cat._id)}
                        onMouseLeave={() => !isMobile && setActiveCategory(null)}
                        className="relative cursor-pointer px-3 py-2 font-semibold text-[#7f55b1] hover:bg-[#f9f7fc] rounded-md"
                    >
                        {cat.name}

                        {/* Subcategory on hover (desktop) or toggle (mobile) */}
                        {activeCategory === cat._id && subCategories[cat._id]?.length > 0 && (
                            <CategoryColumn
                                data={subCategories[cat._id]}
                                onNavigate={handleNavigate}
                                isMobile={isMobile}
                                parentId={cat._id}
                                fetchSubcategories={handleHover} // Pass down to fetch next level
                                level={2}
                            />

                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryMenu;
