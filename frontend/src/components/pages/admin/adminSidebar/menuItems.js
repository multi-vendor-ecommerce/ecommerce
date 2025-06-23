import {
  FaTachometerAlt, FaStore, FaBoxOpen, FaClipboardList, FaMoneyBillAlt,
  FaUserCog, FaCog, FaShippingFast,
  FaHistory
} from 'react-icons/fa';

export const menuItems = [
  {
    section: "DASHBOARD",
    items: [
      {
        label: "Analytics Overview",
        icon: FaTachometerAlt,
        expandable: false,
      },
    ],
  },
  {
    section: "STORE SETTINGS",
    items: [
      {
        label: "Billing Options",
        icon: FaMoneyBillAlt,
        expandable: false,
      },
      {
        label: "Shipping Options",
        icon: FaShippingFast,
        expandable: false,
      },
      {
        label: "Manage Store",
        icon: FaStore,
        expandable: true,
        children: ["Create / Edit Store", "Submit for Approval"],
        key: "store",
      },
    ],
  },
  {
    section: "PRODUCT MANAGEMENT",
    items: [
      {
        label: "Manage Products",
        icon: FaBoxOpen,
        expandable: true,
        children: ["All Products", "Create / Edit Product", "Submit Changes"],
        key: "products",
      },
    ],
  },
  {
    section: "ORDERS",
    items: [
      {
        label: "Orders",
        icon: FaClipboardList,
        expandable: true,
        children: ["All Orders", "Order Status", "Invoices & Taxes"],
        key: "orders",
      },
    ],
  },
  {
    section: "PAYMENTS",
    items: [
      {
        label: "Payment History",
        icon: FaHistory,
        expandable: false,
      },
      {
        label: "Pending Payments",
        icon: FaMoneyBillAlt,
        expandable: false,
      },
      {
        label: "Payment Settings",
        icon: FaCog,
        expandable: false,
      },
    ],
  },
  {
    section: "PROFILE SETTINGS",
    items: [
      {
        label: "Personal Info",
        icon: FaUserCog,
        expandable: false,
      },
      {
        label: "Store Info",
        icon: FaStore,
        expandable: false,
      },
      {
        label: "Change Store Logo",
        icon: FaBoxOpen,
        expandable: false,
      },
    ],
  },
];