import {
  FiBarChart2,
  FiClipboard,
  FiBox,
  FiUser,
  FiSettings,
  FiHome,
  FiUsers
} from "react-icons/fi";

import { BiRupee } from "react-icons/bi";

export const vendorSidebarMenu = [
  // ───────────────── DASHBOARD ─────────────────
  {
    section: "DASHBOARD",
    items: [
      {
        label: "Analytics",
        icon: FiBarChart2,
        expandable: false,
        path: "/vendor",
      },
    ],
  },

  // ───────────────── ORDERS ─────────────────
  {
    section: "ORDERS",
    items: [
      {
        label: "My Orders",
        icon: FiClipboard,
        expandable: true,
        key: "orders",
        path: "/vendor/orders",
        children: [
          { label: "All Orders", path: "/vendor/all-orders" },
          { label: "Invoices & Taxes", path: "/vendor/orders/invoices" },
        ],
      },
    ],
  },

  // ───────────────── CUSTOMERS ─────────────────
  {
    section: "CUSTOMERS",
    items: [
      {
        label: "Manage Customers",
        icon: FiUsers,
        expandable: false,
        path: "/vendor/all-customers",
      },
    ],
  },

  // ───────────────── PRODUCTS ─────────────────
  {
    section: "PRODUCT MANAGEMENT",
    items: [
      {
        label: "Manage Products",
        icon: FiBox,
        expandable: true,
        key: "products",
        path: "/vendor/products",
        children: [
          { label: "Add Product", path: "/vendor/add-product" },
          { label: "All Products", path: "/vendor/all-products" },
          { label: "Top Selling Products", path: "/vendor/top-selling-products" },
        ],
      },
    ],
  },

  // ───────────────── PAYMENTS ─────────────────
  {
    section: "PAYMENTS",
    items: [
      {
        label: "My Payments",
        icon: BiRupee,
        expandable: true,
        key: "payments",
        path: "/vendor/payments",
        children: [
          { label: "Payment History", path: "/vendor/payments/history" },
          { label: "Pending Payments", path: "/vendor/payments/pending" },
          { label: "Payment Settings", path: "/vendor/payments/settings" },
        ],
      },
    ],
  },

  // ───────────────── STORE SETTINGS ─────────────────
  {
    section: "STORE SETTINGS",
    items: [
      {
        label: "Store Profile",
        icon: FiHome,
        expandable: true,
        key: "store",
        path: "/vendor/store",
        children: [
          { label: "Logo & Name", path: "/vendor/store/profile" },
          { label: "Billing Options", path: "/vendor/store/billing" },
          { label: "Shipping Options", path: "/vendor/store/shipping" },
        ],
      },
    ],
  },

  // ───────────────── SETTINGS ─────────────────
  {
    section: "PROFILE SETTINGS",
    items: [
      {
        label: "Vendor Profile",
        icon: FiSettings,
        expandable: true,
        path: "/vendor/settings",
        children: [
          { label: "Profile", path: "/vendor/settings/profile" },
          { label: "Security", path: "/vendor/settings/security" },
          { label: "Notifications", path: "/vendor/settings/notifications" },
        ],
      },
    ],
  },
];
