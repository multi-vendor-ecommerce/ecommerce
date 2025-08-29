import {
  FiBarChart2, FiClipboard, FiUsers, FiTag, FiMail, FiBox,
  FiShoppingCart, FiLayers, FiSettings, FiHome
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
        label: "Manage Customers",
        icon: FiUsers,
        expandable: false,
        path: "/admin/all-customers",
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
        label: "Email Templates Editor",
        icon: FiMail,
        expandable: false,
        path: "/admin/emails-template-editor",
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
        path: "/admin/all-products",
        children: [
          { label: "All Products", path: "/admin/all-products" },
          { label: "Top Selling Products", path: "/admin/top-selling-products" },
          { label: "Approve Products", path: "/admin/approve-products" },
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
        path: "/admin/all-vendors",
        children: [
          { label: "All Vendors", path: "/admin/all-vendors" },
          { label: "Top Vendors", path: "/admin/top-vendors" },
          { label: "Commissions Overview", path: "/admin/vendors/commission-overview" },
        ],
      },
    ],
  },

  // ───────────────── THEME EDITOR ─────────────────
  {
    section: "THEME EDITOR",
    items: [
      {
        label: "Theme Customization",
        icon: FiLayers,
        expandable: true,
        key: "theme",
        path: "/admin/theme",
        children: [
          { label: "Text Blocks", path: "/admin/theme/text-blocks" },
          { label: "Image Blocks", path: "/admin/theme/image-blocks" },
          { label: "Category Creation", path: "/admin/theme/add-category" },
          { label: "Blog CRUD", path: "/admin/theme/blog-crud" },
        ],
      },
    ],
  },

  // ───────────────── PROFILE SETTINGS ─────────────────
  {
    section: "PROFILE SETTINGS",
    items: [
      {
        label: "Admin Profile",
        icon: FiSettings,
        expandable: true,
        path: "/admin/settings",
        children: [
          { label: "Profile", path: "/admin/settings/profile" },
          { label: "Security", path: "/admin/settings/security" },
          { label: "Notifications", path: "/admin/settings/notifications" },
        ],
      },
    ],
  },
];
