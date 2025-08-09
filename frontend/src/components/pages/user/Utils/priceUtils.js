export const getFinalPrice = (price, discount) => {
  if (discount > 0 && discount < 100) {
    return price - (price * discount) / 100;
  }
  return price;
};

//safely format price or return null if invalid
export const formatPrice = (price) => {
  if (typeof price !== "number" || price <= 0) {
    return null; 
  }
  return price.toLocaleString();
};