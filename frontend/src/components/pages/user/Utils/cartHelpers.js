// src/utils/cartHelpers.js
export const validateAndAddToCart = async ({
  product,
  selectedColor,
  selectedSize,
  addToCart,
  setLoading,
  onSuccess,
  onError,
}) => {
  if (product.colors?.length > 0 && !selectedColor) {
    return onError?.("Please select a color.");
  }

  if (product.sizes?.length > 0 && !selectedSize) {
    return onError?.("Please select a size.");
  }

  setLoading(true);
  try {
    const res = await addToCart(product._id, 1, selectedSize, selectedColor);
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
