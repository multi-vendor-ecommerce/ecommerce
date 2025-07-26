export const orderSeedData = [
  {
    user: "6883b69d6e9b3a1e276eb283",
    vendor: "6883b44b42d3fea6d9f9d99e",
    products: [
      { product: "68837ab664a9695d0703d7be", quantity: 1, priceAtPurchase: 1790 },
      { product: "68837ab664a9695d0703d7c0", quantity: 2, priceAtPurchase: 1400 },
    ],
    totalAmount: 1790 + 2 * 1400,
    status: "delivered",
    paymentMethod: "COD",
    shippingAddress: "Bihar",
  },
  {
    user: "6883b60e6e9b3a1e276eb27b",
    vendor: "6881bbe2e57aadbfc4c11940",
    products: [
      { product: "68837ab664a9695d0703d7c5", quantity: 1, priceAtPurchase: 500 },
    ],
    totalAmount: 500,
    status: "shipped",
    paymentMethod: "UPI",
    shippingAddress: "Bihar",
  },
  {
    user: "68821ab2aa28b3d2e77f020a",
    vendor: "6883b44b42d3fea6d9f9d99e",
    products: [
      { product: "68837ab664a9695d0703d7c7", quantity: 3, priceAtPurchase: 650 },
    ],
    totalAmount: 3 * 650,
    status: "pending",
    paymentMethod: "COD",
    shippingAddress: "F-212",
  },
  {
    user: "6883b60e6e9b3a1e276eb27b",
    vendor: "6881bbe2e57aadbfc4c11940",
    products: [
      { product: "68837ab664a9695d0703d7c0", quantity: 1, priceAtPurchase: 1400 },
    ],
    totalAmount: 1400,
    status: "cancelled",
    paymentMethod: "UPI",
    shippingAddress: "Delhi",
  },
  {
    user: "6883b69d6e9b3a1e276eb283",
    vendor: "6883b44b42d3fea6d9f9d99e",
    products: [
      { product: "68837ab664a9695d0703d7be", quantity: 2, priceAtPurchase: 1790 },
    ],
    totalAmount: 2 * 1790,
    status: "shipped",
    paymentMethod: "Card",
    shippingAddress: "Mumbai",
  },
  {
    user: "68821ab2aa28b3d2e77f020a",
    vendor: "6881bbe2e57aadbfc4c11940",
    products: [
      { product: "68837ab664a9695d0703d7c5", quantity: 1, priceAtPurchase: 500 },
      { product: "68837ab664a9695d0703d7c7", quantity: 1, priceAtPurchase: 650 },
    ],
    totalAmount: 1150,
    status: "delivered",
    paymentMethod: "COD",
    shippingAddress: "Patna",
  },
  {
    user: "6883b60e6e9b3a1e276eb27b",
    vendor: "6883b44b42d3fea6d9f9d99e",
    products: [
      { product: "68837ab664a9695d0703d7c0", quantity: 2, priceAtPurchase: 1400 },
    ],
    totalAmount: 2800,
    status: "pending",
    paymentMethod: "UPI",
    shippingAddress: "Pune",
  },
  {
    user: "6883b69d6e9b3a1e276eb283",
    vendor: "6881bbe2e57aadbfc4c11940",
    products: [
      { product: "68837ab664a9695d0703d7c7", quantity: 2, priceAtPurchase: 650 },
    ],
    totalAmount: 1300,
    status: "delivered",
    paymentMethod: "Netbanking",
    shippingAddress: "Hyderabad",
  },
  {
    user: "68821ab2aa28b3d2e77f020a",
    vendor: "6883b44b42d3fea6d9f9d99e",
    products: [
      { product: "68837ab664a9695d0703d7be", quantity: 1, priceAtPurchase: 1790 },
    ],
    totalAmount: 1790,
    status: "shipped",
    paymentMethod: "COD",
    shippingAddress: "Lucknow",
  },
  {
    user: "6883b69d6e9b3a1e276eb283",
    vendor: "6881bbe2e57aadbfc4c11940",
    products: [
      { product: "68837ab664a9695d0703d7c5", quantity: 2, priceAtPurchase: 500 },
    ],
    totalAmount: 1000,
    status: "delivered",
    paymentMethod: "Card",
    shippingAddress: "Jaipur",
  },
];