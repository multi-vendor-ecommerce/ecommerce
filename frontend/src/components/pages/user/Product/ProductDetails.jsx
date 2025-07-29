import React, { useContext, useEffect, useState } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import CartContext from "../../../../context/cart/CartContext";
import { decryptData } from "../Utils/Encryption";
import Spinner from "../../../common/Spinner";
import { useNavigate } from "react-router-dom";
import { FaStar } from 'react-icons/fa';

const ProductDetails = () => {
    // Contexts
    const { getPublicProductById } = useContext(ProductContext);
    const { addToCart } = useContext(CartContext);

    // State variables
    const [decryptedProductId, setDecryptedProductId] = useState("");
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const navigate = useNavigate();

    // Secret key for decryption 
    const secretKey = import.meta.env.VITE_SECRET_KEY;

    // Decode and decrypt product ID from URL
    useEffect(() => {
        const path = window.location.pathname;
        const parts = path.split("/");
        const encodedProductId = parts[parts.length - 1];

        try {
            const decodedProductId = decodeURIComponent(decodeURIComponent(encodedProductId));
            const decryptedId = decryptData(decodedProductId, secretKey);
            console.log("Decrypted ID:", decryptedId);
            setDecryptedProductId(decryptedId);
        } catch (error) {
            console.error("Error decoding or decrypting product ID:", error);
            setLoading(false);
        }
    }, [secretKey]);

    // Fetch product details using decrypted ID
    useEffect(() => {
        const fetchProduct = async () => {
            if (decryptedProductId) {
                setLoading(true);
                const product = await getPublicProductById(decryptedProductId);
                setProductDetails(product);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [decryptedProductId, getPublicProductById]);

    //  Check login & handle Add to Cart
    const handleAddToCart = async () => {
        const authToken = localStorage.getItem("customerToken");

        if (!authToken) {
            const currentPath = window.location.pathname;
            navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
            return;
        }

        if (!productDetails || !productDetails._id) {
            console.error("Product details or product ID missing");
            return;
        }

        try {
            console.log("Adding product to cart:", productDetails._id);
            setIsLoading(true);
            const data = await addToCart(productDetails._id, 1); 
            console.log("Add to cart response:", data);
            if (data.success) {
                alert("Product added to cart successfully!");
            }
        } catch (error) {
            console.error("Failed to add to cart", error);
        } finally {
            setIsLoading(false);
        }
    };


    if (loading) {
        return (
            <section className="bg-[#F3EDFA] min-h-screen flex items-center justify-center">
                <Spinner />
            </section>
        );
    }

    if (!productDetails) {
        // product might be undefined/null while loading or if fetch failed
        return <p>Product not found or loading...</p>;
    }

    return (
        <div className="bg-[#F3EDFA] min-h-screen p-4 md:p-10">
            <div className="max-w-7xl mx-auto bg-white shadow-lg border border-[#E4D9F7] rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: IMAGE */}
                <div className="p-6">
                    {productDetails.images?.length > 1 ? (
                        <>
                            <div className="aspect-square w-full rounded-xl overflow-hidden mb-4">
                                <img
                                    src={productDetails.images[activeImage]}
                                    alt="product"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                {productDetails.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`thumb-${idx}`}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-20 object-cover rounded-md cursor-pointer border transition ${activeImage === idx
                                            ? "border-[#7F55B1]"
                                            : "border-transparent hover:border-[#BFA5E0]"
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="aspect-square w-full rounded-xl overflow-hidden">
                            <img
                                src={productDetails.images?.[0] || "https://via.placeholder.com/600"}
                                alt={productDetails.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* RIGHT: DETAILS */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 break-words">
                        {productDetails.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 text-md">
                        <span className="font-semibold text-yellow-500">
                            {productDetails.rating}
                        </span>
                        <span className="text-yellow-500">
                            <FaStar />
                        </span>
                        <span className="text-gray-500">
                            ({productDetails.totalReviews.toLocaleString()} reviews)
                        </span>
                    </div>

                    {/* Price & Delivery */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-2xl font-bold text-[#7F55B1]">
                            ₹{productDetails.price.toLocaleString()}
                        </div>
                        {productDetails.freeDelivery && (
                            <span className="text-green-600 font-medium text-sm"> Free Delivery</span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div>
                        <span
                            className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${productDetails.stock > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {productDetails.stock > 0
                                ? `In Stock (${productDetails.stock})`
                                : "Out of Stock"}
                        </span>
                    </div>

                    {/* Category */}
                    {productDetails.category?.name && (
                        <p className="text-sm text-gray-500">
                            Category:{" "}
                            <span className="font-medium text-gray-700">
                                {productDetails.category.name}
                            </span>
                        </p>
                    )}

                    {/* Tags */}
                    {productDetails.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs">
                            {productDetails.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-[#EFE7FB] text-[#7F55B1] px-2 py-1 rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {productDetails.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        <button
                            className="bg-[#7F55B1] hover:bg-[#6d48a1] text-white px-6 py-2 rounded-lg shadow-md transition"
                            onClick={() => alert("Buy Now clicked!")}
                        >
                            Buy Now
                        </button>
                        <button
                            className="bg-white border border-[#7F55B1] text-[#7F55B1] px-6 py-2 rounded-lg shadow-md hover:bg-[#f4ecff] transition"
                            onClick={() => handleAddToCart()}
                        >
                           {isLoading ? "Adding..." : "Add to Cart" }
                        </button>
                    </div>

                    {/* Back Link */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-block text-sm text-gray-500 hover:text-[#7F55B1] transition hover:underline mt-2"
                    >
                        ← Back to Products
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
