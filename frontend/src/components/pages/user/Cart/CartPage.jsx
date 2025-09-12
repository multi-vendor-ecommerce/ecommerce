import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import CartContext from "../../../../context/cart/CartContext";
import OrderContext from "../../../../context/orders/OrderContext";

import BackButton from "../../../common/layout/BackButton";
import { getFinalPrice, formatPrice } from "../Utils/priceUtils";
import { encryptData } from "../Utils/Encryption";
import StatGrid from "../../../common/helperComponents/StatGrid";
import Loader from "../../../common/Loader";

import { toast } from "react-toastify";
import { FiPlus, FiMinus } from "react-icons/fi";

import {
  removeItemFromCart,
  changeCartQuantity,
  getCartSummaryData
} from "../Utils/cartHelpers";

const CartPage = () => {
  const { cart, getCart, removeFromCart, addToCart } = useContext(CartContext);
  const { createOrderDraft } = useContext(OrderContext);
  const navigate = useNavigate();

  const lastClickTime = useRef(0);

  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [loading, setLoading] = useState(true);


  // Redirect if not logged in
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      await getCart();
      setLoading(false);
    };
    fetchCart();
  }, []);

  // Use cartHelpers.removeItemFromCart
  const handleRemove = async (cartItemId) => {
    await removeItemFromCart({
      cartItemId,
      removeFromCart,
      getCart,
      setRemovingId,
    });
    toast.info("Item removed from cart");
  };

  //  Use cartHelpers.changeCartQuantity
  const handleQuantityChange = (productId, color, size, newQuantity, stock) => {
    const now = Date.now();
    if (now - lastClickTime.current < 300) return;
    lastClickTime.current = now;

    changeCartQuantity({
      productId,
      color,
      size,
      newQuantity,
      stock,
      cart,
      addToCart,
      getCart,
      setUpdatingProductId,
    });
  };

  const handleProductClick = (productId) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const encryptedProductId = encryptData(productId, secretKey);
    navigate(`/product/${encodeURIComponent(encryptedProductId)}`);
  };

  const handleCartCheckout = async () => {
    const res = await createOrderDraft({ buyNow: false });

    if (res.success) {
      navigate(`/order-summary/${res.draftOrderId}`);
    } else {
      toast.error(res.message || "Failed to create order.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="flex flex-col items-center justify-center px-6 text-center space-y-4 bg-green-50 min-h-screen">
        <p className="text-xl font-semibold text-green-700">Your cart is empty</p>
        <NavLink
          to="/"
          className="inline-block px-6 py-3 bg-green-900 text-white font-medium rounded-md transition-colors duration-300"
        >
          Shop Now
        </NavLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">   
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-9xl">
        <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4">
          Your Shopping Cart
        </h2>

        <div className="py-2">
          <BackButton />
        </div>

        {/* Cart Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cart
            .filter((item) => item.product)
            .map(({ _id, color, size, product, quantity }) => (
              <div
                key={_id || `${product._id}-${color || "default"}-${size || "default"}`}
                className="flex flex-col bg-white border border-green-200 p-4 rounded-xl shadow-sm 
              transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:shadow-green-200"
              >
                {/* Product Image */}
                <img
                  src={product.image?.url || null}
                  alt={product.title}
                  className="h-40 w-full object-contain rounded bg-white p-1 cursor-pointer mb-3"
                  onClick={() => handleProductClick(product._id)}
                />

                {/* Title */}
                <h3
                  className="font-semibold text-lg text-gray-800 cursor-pointer hover:text-green-700 transition-colors"
                  onClick={() => handleProductClick(product._id)}
                >
                  {product.title}
                </h3>

                {/* Price */}
                <div className="text-2xl font-bold text-[#7F55B1] flex items-center gap-3 mt-1">
                  {formatPrice(product.price) &&
                    product.discount &&
                    product.discount > 0 &&
                    product.discount < 100 ? (
                    <>
                      <span>
                        ₹{formatPrice(getFinalPrice(product.price, product.discount))}
                      </span>
                      <span className="text-gray-500 line-through text-lg font-medium">
                        ₹{formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        ({product.discount}% OFF)
                      </span>
                    </>
                  ) : formatPrice(product.price) ? (
                    <>₹{formatPrice(product.price)}</>
                  ) : (
                    <span>-</span>
                  )}
                </div>

                {/* Stock + Details */}
                <p className="text-sm text-gray-500 mt-1">
                  {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Size: {size ? size : "Free Size"} | Color: {color ? color : "N/A"}
                </p>

                {product.freeDelivery && (
                  <p className="text-green-600 font-medium mt-1">Free Delivery</p>
                )}

                {/* Bottom controls */}
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  {/* Quantity controls */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          color,
                          size,
                          quantity - 1,
                          product.stock
                        )
                      }
                      className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 disabled:opacity-50 transition"
                      disabled={quantity <= 1 || updatingProductId === product._id}
                    >
                      <FiMinus size={25} />
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          product._id,
                          color,
                          size,
                          Number(e.target.value),
                          product.stock
                        )
                      }
                      className="w-14 text-center border-x focus:outline-none bg-white py-2"
                      disabled={updatingProductId === product._id}
                    />

                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          color,
                          size,
                          quantity + 1,
                          product.stock
                        )
                      }
                      className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 disabled:opacity-50 transition"
                      disabled={quantity >= product.stock || updatingProductId === product._id}
                    >
                      <FiPlus size={25} />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(_id)}
                    disabled={removingId === _id}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${removingId === _id
                        ? "bg-red-300 text-white cursor-not-allowed"
                        : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white shadow-sm"
                      }`}
                  >
                    {removingId === _id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* StatGrid (normal flow) */}
        <div className="mt-8 border-t pt-4">
          <StatGrid cards={getCartSummaryData(cart)} />
        </div>
      </div>

      {/* Sticky Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 shadow-md">
        <div className="max-w-9xl mx-auto px-4 py-3 flex justify-end">
          <button
            onClick={handleCartCheckout}
            className="bg-green-900 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow text-sm sm:text-base"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>

  );
};

export default CartPage;
