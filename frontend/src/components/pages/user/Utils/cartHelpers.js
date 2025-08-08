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
    const res = await addToCart(product._id, 1, sizeToUse, colorToUse);
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
