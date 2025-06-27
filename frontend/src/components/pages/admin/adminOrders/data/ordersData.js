// ——— filter options ——————————————————————————
export const orderFilterOptions = {
  status: ["", "Pending", "Delivered", "Cancelled"],
};

// ——— dummy orders ————————————————————————————
export const ordersDummy = [
  {
    orderNo: "ORD123",
    date: "2025-06-26",
    products: [
      { name: "Canon EOS R6", price: 400, qty: 1 },
      { name: "Canon RF 24-70mm f/2.8L IS", price: 400, qty: 1 },
      { name: "SanDisk Extreme Pro 128 GB", price: 400, qty: 1 },
    ],
    status: "Delivered",
    customer: {
      name: "Palchhin Parihar",
      email: "palchhin@example.com",
      phone: "9876543210",
    },
    vendor: {
      name: "CamStore",
      email: "support@camstore.com",
    },
    payment: "Paid",
  },
  {
    orderNo: "ORD124",
    date: "2025-06-25",
    products: [
      { name: "Nikon Z6 II", price: 400, qty: 1 },
      { name: "Nikon Z 50 mm f/1.8 S", price: 400, qty: 1 },
    ],
    status: "Pending",
    customer: {
      name: "Soham Verma",
      email: "soham@example.com",
      phone: "9876543211",
    },
    vendor: {
      name: "ClickKart",
      email: "support@clickkart.com",
    },
    payment: "Unpaid",
  },
  {
    orderNo: "ORD125",
    date: "2025-06-24",
    products: [
      { name: "Sony Alpha A7 III", price: 400, qty: 1 },
      { name: "Sony FE 24-105 mm f/4 G", price: 400, qty: 1 },
    ],
    status: "Cancelled",
    customer: {
      name: "Aarav Shah",
      email: "aarav@example.com",
      phone: "9876543212",
    },
    vendor: {
      name: "LensHub",
      email: "support@lenshub.com",
    },
    payment: "Refunded",
  },
  {
    orderNo: "ORD126",
    date: "2025-06-23",
    products: [
      { name: "Fujifilm X-T4", price: 400, qty: 1 },
      { name: "Fujinon XF 16-55 mm f/2.8", price: 400, qty: 1 },
    ],
    status: "Pending",
    customer: {
      name: "Ishaan Patel",
      email: "ishaan@example.com",
      phone: "9876543213",
    },
    vendor: {
      name: "PhotoWorld",
      email: "support@photoworld.com",
    },
    payment: "Paid",
  },
  {
    orderNo: "ORD127",
    date: "2025-06-22",
    products: [
      { name: "Olympus OM-D E-M1 III", price: 400, qty: 1 },
      { name: "Olympus M.Zuiko 12-40 mm f/2.8 PRO", price: 400, qty: 1 },
    ],
    status: "Delivered",
    customer: {
      name: "Riya Gupta",
      email: "riya@example.com",
      phone: "9876543214",
    },
    vendor: {
      name: "SnapShop",
      email: "support@snapshop.com",
    },
    payment: "Paid",
  },
  {
    orderNo: "ORD128",
    date: "2025-06-21",
    products: [
      { name: "Panasonic Lumix GH5 II", price: 400, qty: 1 },
    ],
    status: "Pending",
    customer: {
      name: "Ananya Singh",
      email: "ananya@example.com",
      phone: "9876543215",
    },
    vendor: {
      name: "CameraBazaar",
      email: "support@camerabazaar.com",
    },
    payment: "Unpaid",
  },
  {
    orderNo: "ORD129",
    date: "2025-06-20",
    products: [
      { name: "Leica Q2", price: 400, qty: 1 },
    ],
    status: "Cancelled",
    customer: {
      name: "Vivaan Mehta",
      email: "vivaan@example.com",
      phone: "9876543216",
    },
    vendor: {
      name: "EliteCameras",
      email: "support@elitecameras.com",
    },
    payment: "Refunded",
  },
  {
    orderNo: "ORD130",
    date: "2025-06-19",
    products: [
      { name: "GoPro HERO9 Black", price: 400, qty: 1 },
      { name: "GoPro Enduro Battery", price: 400, qty: 1 },
    ],
    status: "Delivered",
    customer: {
      name: "Aanya Kapoor",
      email: "aanya@example.com",
      phone: "9876543217",
    },
    vendor: {
      name: "ActionCams",
      email: "support@actioncams.com",
    },
    payment: "Paid",
  },
  {
    orderNo: "ORD131",
    date: "2025-06-18",
    products: [
      { name: "DJI Mavic Air 2", price: 400, qty: 1 },
      { name: "DJI Fly-More Combo Kit", price: 400, qty: 1 },
    ],
    status: "Pending",
    customer: {
      name: "Arjun Joshi",
      email: "arjun@example.com",
      phone: "9876543218",
    },
    vendor: {
      name: "DroneZone",
      email: "support@dronezone.com",
    },
    payment: "Unpaid",
  },
  {
    orderNo: "ORD132",
    date: "2025-06-17",
    products: [
      { name: "Sigma 35 mm f/1.4 DG HSM Art", price: 400, qty: 1 },
    ],
    status: "Cancelled",
    customer: {
      name: "Naina Sharma",
      email: "naina@example.com",
      phone: "9876543219",
    },
    vendor: {
      name: "LensMasters",
      email: "support@lensmasters.com",
    },
    payment: "Refunded",
  },
];
