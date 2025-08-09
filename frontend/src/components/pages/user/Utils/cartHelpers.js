// Add product to cart with validation
export const validateAndAddToCart = async ({
  product,
  selectedColor,
  selectedSize,
  addToCart,
  setLoading,
  onSuccess,
  onError,
}) => {
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
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0).toFixed(2);
};

// Remove an item from cart
export const removeItemFromCart = async ({
  productId,
  removeFromCart,
  getCart,
  setRemovingId,
}) => {
  setRemovingId(productId);
  await removeFromCart(productId);
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

