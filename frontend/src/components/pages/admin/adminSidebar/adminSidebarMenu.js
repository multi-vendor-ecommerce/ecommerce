import {
  FiBarChart2, FiClipboard, FiUsers, FiTag, FiMail, FiBox,
  FiShoppingCart, FiLayers, FiSettings,
} from 'react-icons/fi';

export const adminSidebarMenu = [
  {
    section: "DASHBOARD",
    items: [
      { label: "Analytics", icon: FiBarChart2, expandable: false },
    ],
  },
  {
    section: "ORDERS",
    items: [
      {
        label: "Manage Orders",
        icon: FiClipboard,
        expandable: true,
        key: "orders",
        children: [
          "All Orders", "Order Details", "Filter by Status/Date",
          "Customer Details", "Vendor", "Payment Confirmation"
        ],
      },
    ],
  },
  {
    section: "CUSTOMERS",
    items: [
      {
        label: "Customer Overview",
        icon: FiUsers,
        expandable: false,
      },
    ],
  },
  {
    section: "COUPONS",
    items: [
      {
        label: "Site-wide Coupons",
        icon: FiTag,
        expandable: false,
      },
    ],
  },
  {
    section: "EMAILS",
    items: [
      {
        label: "Email Templates",
        icon: FiMail,
        expandable: false,
      },
    ],
  },
  {
    section: "PRODUCT MANAGEMENT",
    items: [
      {
        label: "Products",
        icon: FiBox,
        expandable: true,
        key: "products",
        children: [
          "All Products", "Approve Products", "Edit / Dismiss"
        ],
      },
    ],
  },
  {
    section: "VENDOR MANAGEMENT",
    items: [
      {
        label: "Vendors",
        icon: FiShoppingCart,
        expandable: true,
        key: "vendors",
        children: [
          "All Vendors", "Commissions Viewer", "Shop Overview", "Status Management",
        ],
      },
    ],
  },
  {
    section: "THEME EDITOR",
    items: [
      {
        label: "Online Theme Editor",
        icon: FiLayers,
        expandable: true,
        key: "theme",
        children: [
          "Text Blocks", "Image Blocks", "Category Creation", "Product CRUD", "Blog CRUD"
        ],
      },
    ],
  },
  {
    section: "SETTINGS",
    items: [
      {
        label: "Admin Settings",
        icon: FiSettings,
        expandable: false,
      },
    ],
  },
];
