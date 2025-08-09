import { useContext, useEffect, useState } from "react";
import CartContext from "../../../../context/cart/CartContext";
import { useNavigate } from "react-router-dom";
// import Spinner from "../../../common/Spinner";
import BackButton from "../../../common/layout/BackButton";
import {
  calculateCartTotal,
  removeItemFromCart,
  changeCartQuantity,
} from "../Utils/cartHelpers";

const CartPage = () => {
  const { cart, loading, getCart, removeFromCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const token = localStorage.getItem("customerToken");

  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=/cart", { replace: true });
    } else {
      getCart();
    }
  }, []);

  const handleRemove = (productId) => {
    removeItemFromCart({
      productId,
      removeFromCart,
      getCart,
      setRemovingId,
    });
  };

  const handleQuantityChange = (productId, color, size, newQuantity, stock) => {
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


  if (!cart.length)
    return (
      <div className="text-center p-6 text-lg">
        Your cart is empty.
        <br />
        <button
          onClick={() => navigate("/")}
          className="inline-block text-sm text-gray-500 hover:text-[#7F55B1] transition hover:underline mt-2"
        >
          ← Back to Products
        </button>
      </div>
    );

  return (
    <div className="bg-[#F3F0FA] min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl">
       <BackButton />
        <h2 className="text-xl sm:text-2xl font-semibold text-[#7F55B1] mb-4 sm:mb-6">
          Your Shopping Cart
        </h2>

        <div className="space-y-6">
          {cart.filter(item => item.product).map(({ _id, color, size, product, quantity }) => (
            <div
              key={_id || `${product._id}-${color || 'default'}-${size || 'default'}`}
              className="flex flex-col md:flex-row md:items-center bg-[#F8F5FD] border border-[#E0D6F2] p-4 rounded-xl shadow-sm gap-4"
            >
              <img
                src={product.images?.[0] || ""}
                alt={product.title}
                className="h-50 w-full md:w-24 md:h-24 object-center rounded bg-white p-1"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-[#333]">{product.title}</h3>
                <p className="text-gray-600 mt-1">
                  ₹ {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Size: {size ? size : "N/A"} | Color: {color ? color : "N/A"}
                </p>

                {product.freeDelivery && (
                  <p className="text-green-600 font-medium mt-1">Free Delivery</p>
                )}
              </div>

              <div className="flex md:flex-col items-center md:items-end gap-2 mt-4 md:mt-0">
                <div className="flex items-center border rounded overflow-hidden">
                  <button
                    onClick={() =>
                      handleQuantityChange(product._id, color, size, quantity - 1, product.stock)
                    }
                    className="px-3 py-1 bg-[#EDE3F9] hover:bg-[#D7C2F0] text-[#7F55B1]"
                    disabled={quantity <= 1 || updatingProductId === product._id}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(product._id, color, size, Number(e.target.value), product.stock)
                    }
                    className="w-12 text-center border-l border-r focus:outline-none bg-white"
                    disabled={updatingProductId === product._id}
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(product._id, color, size, quantity + 1, product.stock)
                    }
                    className="px-3 py-1 bg-[#EDE3F9] hover:bg-[#D7C2F0] text-[#7F55B1]"
                    disabled={quantity >= product.stock || updatingProductId === product._id}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(product._id)}
                  className="text-red-600 hover:underline text-sm"
                  disabled={removingId === product._id}
                >
                  {removingId === product._id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center space-x-6 border-t pt-4">
          <span className="text-xl font-semibold text-[#7F55B1]">
            Total: ₹{calculateCartTotal(cart)}
          </span>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-[#7F55B1] hover:bg-[#6b3fa5] text-white px-6 py-2 rounded-lg shadow"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
