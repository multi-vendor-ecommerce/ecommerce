import {
  FiBarChart2, FiClipboard, FiUsers, FiTag, FiMail, FiBox,
  FiShoppingCart, FiLayers, FiSettings,
} from 'react-icons/fi';

export const adminSidebarMenu = [
  // ───────────────── DASHBOARD ─────────────────
  {
    section: "DASHBOARD",
    items: [
      {
        label: "Analytics",
        icon: FiBarChart2,
        expandable: false,
        path: "/admin",
      },
    ],
  },

  // ───────────────── ORDERS ─────────────────
  {
    section: "ORDERS",
    items: [
      {
        label: "Manage Orders",
        icon: FiClipboard,
        expandable: true,
        key: "orders",
        path: "/admin/all-orders",
        children: [
          { label: "All Orders", path: "/admin/all-orders" },
          { label: "Payment Confirmation", path: "/admin/orders/payment" },
        ],
      },
    ],
  },

  // ───────────────── CUSTOMERS ─────────────────
  {
    section: "CUSTOMERS",
    items: [
      {
        label: "Customer Overview",
        icon: FiUsers,
        expandable: false,
        path: "/admin/customers",
      },
    ],
  },

  // ───────────────── COUPONS ─────────────────
  {
    section: "COUPONS",
    items: [
      {
        label: "Site-wide Coupons",
        icon: FiTag,
        expandable: false,
        path: "/admin/coupons",
      },
    ],
  },

  // ───────────────── EMAILS ─────────────────
  {
    section: "EMAILS",
    items: [
      {
        label: "Email Templates",
        icon: FiMail,
        expandable: false,
        path: "/admin/emails",
      },
    ],
  },

  // ───────────────── PRODUCT MANAGEMENT ─────────────────
  {
    section: "PRODUCT MANAGEMENT",
    items: [
      {
        label: "Products",
        icon: FiBox,
        expandable: true,
        key: "products",
        path: "/admin/products",
        children: [
          { label: "All Products", path: "/admin/products" },
          { label: "Approve Products", path: "/admin/products/approve" },
          { label: "Edit / Dismiss", path: "/admin/products/edit-dismiss" },
        ],
      },
    ],
  },

  // ───────────────── VENDOR MANAGEMENT ─────────────────
  {
    section: "VENDOR MANAGEMENT",
    items: [
      {
        label: "Vendors",
        icon: FiShoppingCart,
        expandable: true,
        key: "vendors",
        path: "/admin/vendors",
        children: [
          { label: "All Vendors", path: "/admin/vendors" },
          { label: "Commissions Viewer", path: "/admin/vendors/commission" },
          { label: "Shop Overview", path: "/admin/vendors/overview" },
          { label: "Status Management", path: "/admin/vendors/status" },
        ],
      },
    ],
  },

  // ───────────────── THEME EDITOR ─────────────────
  {
    section: "THEME EDITOR",
    items: [
      {
        label: "Online Theme Editor",
        icon: FiLayers,
        expandable: true,
        key: "theme",
        path: "/admin/theme",
        children: [
          { label: "Text Blocks", path: "/admin/theme/text-blocks" },
          { label: "Image Blocks", path: "/admin/theme/image-blocks" },
          { label: "Category Creation", path: "/admin/theme/categories" },
          { label: "Product CRUD", path: "/admin/theme/product-crud" },
          { label: "Blog CRUD", path: "/admin/theme/blog-crud" },
        ],
      },
    ],
  },

  // ───────────────── SETTINGS ─────────────────
  {
    section: "SETTINGS",
    items: [
      {
        label: "Admin Settings",
        icon: FiSettings,
        expandable: false,
        path: "/admin/settings",
      },
    ],
  },
];
