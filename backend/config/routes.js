import authRoutes from "../routes/authRoutes.js";
import personRoutes from "../routes/personRoutes.js";
import productsRoutes from "../routes/productRoutes.js";
import categoryRoutes from "../routes/categoryRoutes.js";
import vendorRoutes from "../routes/vendorRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import couponRoutes from "../routes/couponRoutes.js";
import cartRoutes from "../routes/cartRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import paymentRoutes from "../routes/paymentRoutes.js";
import shippingAddressRoutes from "../routes/shippingAddressRoutes.js";
import imageRoutes from "../routes/imageRoutes.js";
import wishlistRoutes from "../routes/wishlistRoutes.js";
import productReviewRoutes from "../routes/productReviewRoutes.js";
import shiprocketRoutes from "../routes/shiprocketRoutes.js";
import bannerRoutes from "../routes/bannerRoutes.js";

// ==========================
// API Routes
// ==========================
const apiRoutes = [
  { path: "auth", route: authRoutes },
  { path: "person", route: personRoutes },
  { path: "products", route: productsRoutes },
  { path: "categories", route: categoryRoutes },
  { path: "vendors", route: vendorRoutes },
  { path: "users", route: userRoutes },
  { path: "coupons", route: couponRoutes },
  { path: "cart", route: cartRoutes },
  { path: "orders", route: orderRoutes },
  { path: "payment", route: paymentRoutes },
  { path: "shipping-address", route: shippingAddressRoutes },
  { path: "images", route: imageRoutes },
  { path: "wishlist", route: wishlistRoutes },
  { path: "product-reviews", route: productReviewRoutes },
  { path: "shiprocket", route: shiprocketRoutes },
  { path: "banners", route: bannerRoutes},
];

export default apiRoutes;