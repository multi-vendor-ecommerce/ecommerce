import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductContext from "../../../../context/products/ProductContext";
import CartContext from "../../../../context/cart/CartContext";
import Spinner from "../../../common/Spinner";
import { FaStar } from "react-icons/fa";
import BackButton from "../../../common/layout/BackButton";
import ReadMoreLess from "../../../common/ReadMoreLess";
import { validateAndAddToCart } from "../Utils/cartHelpers";
import { getDecryptedProductIdFromURL } from "../Utils/urlUtils";
import { getFinalPrice } from "../Utils/priceUtils";
import OrderContext from "../../../../context/orders/OrderContext";
import WishlistButton from "../../../common/WishlistButton";

const ProductDetails = () => {
  // Contexts
  const { getProductById } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { createOrderDraft } = useContext(OrderContext);

  // State variables
  const [decryptedProductId, setDecryptedProductId] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const lastAddClickTime = useRef(0);

  const secretKey = import.meta.env.VITE_SECRET_KEY;

  const navigate = useNavigate();
  const location = useLocation();

  // Decrypt product ID from URL
  useEffect(() => {
    const id = getDecryptedProductIdFromURL(window.location.pathname, secretKey);
    if (id) setDecryptedProductId(id);
    else setLoading(false);
  }, [secretKey]);

  // Fetch product details using decrypted ID
  useEffect(() => {
    const fetchProduct = async () => {
      if (decryptedProductId) {
        setLoading(true);
        const product = await getProductById(decryptedProductId);
        setProductDetails(product);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [decryptedProductId, getProductById]);

  // Update active image when selectedColor changes (if image url includes color name)
  useEffect(() => {
    if (selectedColor && productDetails?.images.url?.length > 1) {
      const index = productDetails.images.findIndex(img =>
        (img.publicId || " ").toLowerCase().includes(selectedColor.toLowerCase())
      );
      if (index !== -1) setActiveImage(index);
    }
  }, [selectedColor, productDetails]);

  // default colors and size:
  useEffect(() => {
    if (productDetails) {
      setSelectedColor(productDetails.colors?.[0] || null);
      setSelectedSize(productDetails.sizes?.[0] || null);
    }
  }, [productDetails]);

  // Handle Add to Cart with validation for color & size
  const handleAddToCart = () => {
    const now = Date.now();
    if (now - lastAddClickTime.current < 500) {
      return;
    }
    lastAddClickTime.current = now;
    validateAndAddToCart({
      product: productDetails,
      selectedSize,
      selectedColor,
      addToCart,
      setLoading: setIsLoading,
      onSuccess: (msg) => alert(msg),
      onError: (err) => alert(err),
      navigate,
      location,
    });
  };

  const handleBuyNow = async () => {
    if (!productDetails?._id) return;

    const res = await createOrderDraft({
      buyNow: true,
      productId: productDetails._id,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    });

    if (res?.success && res.draftOrderId) {
      navigate(`/order-summary/${res.draftOrderId}`);
    } else {
      alert("Failed to create order draft");
    }
  };

  if (!productDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-[#F0FDF4] min-h-screen p-4 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg border border-[#E4D9F7] rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {/* LEFT: IMAGE */}
        <div className="p-6">
          {productDetails.images?.length > 1 ? (
            <>
              <div className="aspect-square w-full rounded-xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                <img
                  src={productDetails.images[activeImage]?.url}
                  alt="product"
                  className="max-w-full max-h-full"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {productDetails.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`thumb-${idx}`}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border transition ${activeImage === idx ? "border-[#7F55B1]" : "border-transparent hover:border-[#BFA5E0]"
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

          {productDetails.brand && (
            <div className="text-sm text-gray-500 font-medium">
              Brand: <span className="text-gray-800">{productDetails.brand}</span>
            </div>
          )}

          {
            productDetails.createdBy?.name && (
              <p className="text-sm text-gray-500">
                Product By:{" "}
                <span className="font-medium text-gray-700">{productDetails.createdBy.name}</span>
              </p>
            )
          }

          <div className="text-2xl font-bold text-[#7F55B1] flex items-center gap-3">
            {productDetails.discount && productDetails.discount > 0 && productDetails.discount < 100 ? (
              <>
                <span>
                  ₹{getFinalPrice(productDetails.price, productDetails.discount).toLocaleString()}
                </span>

                <span className="text-gray-500 line-through text-lg font-medium">
                  ₹{productDetails.price.toLocaleString()}
                </span>

                <span className="text-sm text-green-600 font-semibold">
                  ({productDetails.discount}% OFF)
                </span>
              </>
            ) : (
              <>₹{productDetails.price.toLocaleString()}</>
            )}
          </div>

          {/* Category */}
          {productDetails.category?.name && (
            <p className="text-sm text-gray-500">
              Category:{" "}
              <span className="font-medium text-gray-700">{productDetails.category.name}</span>
            </p>
          )}

          {/* Tags */}
          {productDetails.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {productDetails.tags.map((tag, i) => (
                <span key={i} className="bg-[#EFE7FB] text-[#7F55B1] px-2 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Color Picker */}
          {productDetails.colors?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Select Color:</h4>
              <div className="flex gap-2 flex-wrap">
                {productDetails.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${selectedColor === color
                      ? "bg-[#7F55B1] text-white border-[#7F55B1]"
                      : "bg-white border-gray-300 text-gray-700 hover:border-[#7F55B1]"
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Picker */}
          {productDetails.sizes?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1 mt-4">Select Size:</h4>
              <div className="flex gap-2 flex-wrap">
                {productDetails.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${selectedSize === size
                      ? "bg-[#7F55B1] text-white border-[#7F55B1]"
                      : "bg-white border-gray-300 text-gray-700 hover:border-[#7F55B1]"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <ReadMoreLess text={productDetails.description} limit={120} />

          {/* Rating */}
          <div className="flex items-center  gap-1 text-md">
            <span className="font-semibold text-yellow-500">{productDetails.rating}</span>
            <FaStar className="text-yellow-500 mt-[1px]" />
            <span className="text-gray-500 text-sm ml-1">
              ({productDetails.totalReviews.toLocaleString()} reviews)
            </span>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              className="bg-[#7F55B1] hover:bg-[#6d48a1] text-white px-6 py-2 rounded-lg shadow-md transition cursor-pointer"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button
              className="bg-white border border-[#7F55B1] text-[#7F55B1] px-6 py-2 rounded-lg shadow-md hover:bg-[#f4ecff] transition cursor-pointer"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
            <WishlistButton productId={productDetails._id} />
          </div>

          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
