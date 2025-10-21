#  Multivendor E-Commerce Platform (MERN Stack)

A **production-grade multivendor e-commerce web application** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
This platform enables **multiple vendors** to register, list their products, manage orders, and sell online — while customers can explore, add to cart, place orders, and track their purchases in a seamless shopping experience.

---

##  Live Demo

 **Frontend (Testing Link):** https://multi-vendor-e-commerce.netlify.app/
 **Backend:** Hosted on Render 

---

##  Tech Stack

###  Frontend
- React.js (Functional Components + Hooks)
- React Router DOM
- Tailwind CSS (for responsive UI)
- **Fetch API** (for API integration)
- React Icons
- Framer Motion (animations)

###  Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose ORM)  
- JSON Web Tokens (JWT) Authentication  
- Bcrypt for password hashing  
- Multer for image uploads  
- Cloudinary for product & profile images  

###  Database
- MongoDB Atlas (Cloud-hosted)

###  Tools & Environment
- Git & GitHub (Version Control)  
- Postman (API Testing)  
- VS Code (Development)  
- Render (Backend Deployment)  
- Netlify (Frontend Deployment)  

---

##  Core Features

###  Vendor Features
- Vendor registration and login  
- Add / Edit / Delete products  
- Manage inventory and pricing  
- View and track orders  
- Upload product images  

###  Customer Features
- Customer registration and login  
- Explore products by category  
- Add to cart / remove from cart  
- Place and manage orders  
- Secure checkout process  
- View order history  

###  Authentication & Security
- JWT-based authentication  
- Role-based access (Admin, Vendor, Customer)  
- Encrypted passwords with bcrypt  

###  Admin Features
- Approve / Manage vendors  
- Manage users and products  
- Handle orders and site overview dashboard  

---

##  Folder Structure

```bash
ecommerce/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
│
└── README.md

---

##  Installation & Setup

### Clone the repository

```bash
git clone https://github.com/Mukesh469/ecommerce.git
cd ecommerce

## Install dependencies

## For frontend:
cd frontend
npm install

## For backend:
cd ../backend
npm install

##  Environment Variables

Before running the project, create a `.env` file in the root of your **backend** directory and add the following environment variables:

```bash
# MongoDB
DB_URI=your_mongodb_connection_string

# Server
PORT=5000

# Admin Credentials
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_admin_password

# Email Configuration
EMAIL_USER=your_email_user@example.com
EMAIL_PASS=your_email_app_password

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Invoice API
INVOICE_API_KEY=your_invoice_api_key

# Shiprocket Integration
SR_BASE_URL=https://apiv2.shiprocket.in/v1/external
SR_EMAIL=your_shiprocket_email@example.com
SR_PASSWORD=your_shiprocket_password

## Run the application

# Start backend:
cd backend
npm run dev

# Start frontend:
cd frontend
npm start

## Contributing

# Fork the repository

# Create your feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add new feature"

# Push to your branch
git push origin feature/your-feature

# Open a Pull Request
