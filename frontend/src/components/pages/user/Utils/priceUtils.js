export const getFinalPrice = (price, discount) => {
  if (discount > 0 && discount < 100) {
    return price - (price * discount) / 100;
  }
  return price;
};
