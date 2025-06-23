import {
  FaTachometerAlt, FaClipboardList, FaUsers, FaTags, FaEnvelope, FaBoxOpen,
  FaStore, FaPalette, FaChevronDown, FaCogs, FaShippingFast, FaHistory
} from 'react-icons/fa';

export const adminSidebarMenu = [
  {
    section: "DASHBOARD",
    items: [
      { label: "Analytics", icon: FaTachometerAlt, expandable: false },
    ],
  },
  {
    section: "ORDERS",
    items: [
      {
        label: "Manage Orders",
        icon: FaClipboardList,
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
        icon: FaUsers,
        expandable: false,
      },
    ],
  },
  {
    section: "COUPONS",
    items: [
      {
        label: "Site-wide Coupons",
        icon: FaTags,
        expandable: false,
      },
    ],
  },
  {
    section: "EMAILS",
    items: [
      {
        label: "Email Templates",
        icon: FaEnvelope,
        expandable: false,
      },
    ],
  },
  {
    section: "PRODUCT MANAGEMENT",
    items: [
      {
        label: "Products",
        icon: FaBoxOpen,
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
        icon: FaStore,
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
        icon: FaPalette,
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
        icon: FaCogs,
        expandable: false,
      },
    ],
  },
];
