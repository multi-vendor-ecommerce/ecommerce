import { FaRupeeSign, FaUser, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

export const getCards = ({ totalRevenue, totalOrders, totalCustomers, totalProducts }) => [
  {
    label: "Revenue",
    value: `${totalRevenue}`,
    bgColor: "bg-green-100",
    shadowColor: "hover:shadow-green-500",
    icon: FaRupeeSign,
  },
  {
    label: "Orders",
    value: totalOrders,
    bgColor: "bg-pink-200",
    shadowColor: "hover:shadow-pink-500",
    icon: FaShoppingCart,
  },
  {
    label: "Customers",
    value: totalCustomers,
    bgColor: "bg-purple-100",
    shadowColor: "hover:shadow-purple-500",
    icon: FaUser,
  },
  {
    label: "Products",
    value: totalProducts,
    bgColor: "bg-yellow-100",
    shadowColor: "hover:shadow-yellow-500",
    icon: FaBoxOpen,
  },
];
