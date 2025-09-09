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
  const token = localStorage.getItem("customerToken");


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
    <div className="bg-green-50 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl">
        <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4">
          Your Shopping Cart
        </h2>

        <div className="py-2">
          <BackButton />
        </div>

        <div className="space-y-4">
          {cart.filter((item) => item.product).map(({ _id, color, size, product, quantity }) => (
            <div
              key={_id || `${product._id}-${color || "default"}-${size || "default"}`}
              className="flex flex-col md:flex-row md:items-center bg-white border border-green-500 p-4 rounded-xl shadow-sm gap-4"
            >
              <img
                src={product.image?.url || null}
                alt={product.title}
                className="h-50 w-full md:w-24 md:h-24 object-center rounded bg-white p-1 cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              />

              <div className="flex-1">
                <h3
                  className="font-semibold text-lg text-[#333] cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  {product.title}
                </h3>

                <div className="text-2xl font-bold text-[#7F55B1] flex items-center gap-3">
                  {formatPrice(product.price) && product.discount && product.discount > 0 && product.discount < 100 ? (
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

                <p className="text-sm text-gray-500 mt-1">
                  {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Size: {size ? size : "Free Size"} | Color: {color ? color : "N/A"}
                </p>

                {product.freeDelivery && (
                  <p className="text-green-600 font-medium mt-1">Free Delivery</p>
                )}
              </div>

              <div className="flex md:flex-col items-center md:items-end gap-2 mt-4 md:mt-0">
                {/* Quantity controls */}
                <div className="flex items-center w-fit border rounded-lg overflow-hidden">
                  {/* Minus Button */}
                  <button
                    onClick={() =>
                      handleQuantityChange(product._id, color, size, quantity - 1, product.stock)
                    }
                    className="px-3 py-2 bg-[#EDE3F9] hover:bg-[#D7C2F0] text-[#7F55B1] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    disabled={quantity <= 1 || updatingProductId === product._id}
                  >
                    −
                  </button>

                  {/* Quantity Input */}
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

                  {/* Plus Button */}
                  <button
                    onClick={() =>
                      handleQuantityChange(product._id, color, size, quantity + 1, product.stock)
                    }
                    className="px-3 py-2 bg-[#EDE3F9] hover:bg-[#D7C2F0] text-[#7F55B1] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    disabled={quantity >= product.stock || updatingProductId === product._id}
                  >
                    +
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
                  {removingId === _id ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Removing...
                    </span>
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-4">
          <StatGrid cards={getCartSummaryData(cart)} />

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCartCheckout}
              className="bg-green-900 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
