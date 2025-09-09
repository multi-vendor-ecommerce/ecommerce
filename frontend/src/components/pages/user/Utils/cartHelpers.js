import { getFinalPrice } from "./priceUtils";
import { FiShoppingCart } from "react-icons/fi";
import { FaRupeeSign, FaBoxOpen } from "react-icons/fa";

// Add product to cart with validation
export const validateAndAddToCart = async ({
  product,
  selectedColor,
  selectedSize,
  addToCart,
  setLoading,
  onSuccess,
  onError,
  navigate,
  location
}) => {
  const token = localStorage.getItem("customerToken");
  if (!token) {
    navigate("/login/user", { state: { from: location.pathname } });
    return;
  }
  const colorToUse = selectedColor || (product.colors?.[0] ?? null);
  const sizeToUse = selectedSize || (product.sizes?.[0] ?? null);

  if (product.colors?.length > 0 && !colorToUse) {
    return onError?.("Please select a color.");
  }
  if (product.sizes?.length > 0 && !sizeToUse) {
    return onError?.("Please select a size.");
  }

  setLoading(true);
  try {
    const res = await addToCart(product._id, 1, colorToUse, sizeToUse);
    if (res.success) {
      onSuccess?.("Product added to cart!");
    } else {
      onError?.(`Failed to add to cart: ${res.message}`);
    }
  } catch (err) {
    onError?.("Something went wrong while adding to cart.");
  }
  setLoading(false);
};

// Calculate total price from cart array
export const calculateCartTotal = (cart) => {
  return cart.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discount || 0;
    const discountedPrice = price - (price * (discount / 100));
    return acc + discountedPrice * item.quantity;
  }, 0).toFixed(2);
};

// Remove an item from cart
export const removeItemFromCart = async ({
  cartItemId,
  removeFromCart,
  getCart,
  setRemovingId,
}) => {
  setRemovingId(cartItemId);
  await removeFromCart(cartItemId);
  await getCart();
  setRemovingId(null);
};

// Change quantity of an item in cart
export const changeCartQuantity = async ({
  productId,
  color,
  size,
  newQuantity,
  stock,
  cart,
  addToCart,
  getCart,
  setUpdatingProductId,
}) => {
  if (newQuantity < 1 || newQuantity > stock) return;

  // Find the exact cart item with productId + color + size
  const currentItem = cart.find(
    (item) =>
      item.product?._id === productId &&
      item.color === color &&
      item.size === size
  );
  if (!currentItem) return;

  const delta = newQuantity - currentItem.quantity;
  if (delta === 0) return;

  setUpdatingProductId(currentItem._id);

  try {
    const data = await addToCart(productId, delta, color, size);
    if (!data.success) {
      alert(`Failed to update quantity: ${data.message}`);
    } else {
      await getCart();
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("Something went wrong while updating quantity.");
  }

  setUpdatingProductId(null);
};

export const calculateCheckoutTotals = (
  cart,
  taxRate = 0.18,
  shippingThreshold = 500,
  shippingFee = 50
) => {
  const itemPrice = cart.reduce((acc, item) => {
    const discountedPrice = getFinalPrice(item.product.price, item.product.discount);
    return acc + discountedPrice * item.quantity;
  }, 0);

  const tax = itemPrice * taxRate;
  const shippingCharges = itemPrice > shippingThreshold ? 0 : shippingFee;
  const totalAmount = itemPrice + tax + shippingCharges;

  return {
    itemPrice: Number(itemPrice.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shippingCharges,
    totalAmount: Number(totalAmount.toFixed(2)),
  };
};

export const getCartSummaryData = (cart) => [
  {
    label: "Total Items",
    value: cart.reduce((acc, item) => acc + item.quantity, 0),
    icon:  FiShoppingCart,
    bg: "bg-blue-50",
    shadow: "shadow-blue-100",
  },
  {
    label: "Total Price",
    value: `₹${calculateCartTotal(cart)}`,
    icon:  FaRupeeSign,
    bg: "bg-green-50",
    shadow: "shadow-green-100",
  },
  {
    label: "Unique Products",
    value: cart.length,
    icon: FaBoxOpen,
    bg: "bg-purple-50",
    shadow: "shadow-purple-100",
  },
];