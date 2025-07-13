import { useState } from "react";
import CategoryContext from "./CategoryContext";

const CategoryState = (props) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const host = "http://localhost:5000";

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${host}/api/categories/allCategory`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories.');
            }

            const data = await response.json();

            if (data && data.categories) {
                setCategories(data.categories);
            } else {
                setCategories([]);
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, loading, getAllCategories }}>
            {props.children}
        </CategoryContext.Provider>
    )
}

export default CategoryState;
