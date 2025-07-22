import {
  FiBarChart2,
  FiClipboard,
  FiBox,
  FiUser,
  FiSettings,
  FiHome,
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
          { label: "All Products", path: "/vendor/all-products" },
          { label: "Add Product", path: "/vendor/products/add" },
          { label: "Approval Requests", path: "/vendor/products/pending-approval" },
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
          { label: "Edit Store Info", path: "/vendor/store/edit" },
          { label: "Billing Options", path: "/vendor/store/billing" },
          { label: "Shipping Options", path: "/vendor/store/shipping" },
        ],
      },
    ],
  },

  // ───────────────── PROFILE SETTINGS ─────────────────
  {
    section: "PROFILE",
    items: [
      {
        label: "My Profile",
        icon: FiUser,
        expandable: true,
        key: "profile",
        path: "/vendor/profile",
        children: [
          { label: "Edit Personal Info", path: "/vendor/profile/edit" },
          { label: "Change Store Name", path: "/vendor/profile/store-name" },
          { label: "Change Store Logo", path: "/vendor/profile/logo" },
        ],
      },
    ],
  },

  // ───────────────── SETTINGS ─────────────────
  {
    section: "SETTINGS",
    items: [
      {
        label: "General Settings",
        icon: FiSettings,
        expandable: false,
        path: "/vendor/settings",
      },
    ],
  },
];
