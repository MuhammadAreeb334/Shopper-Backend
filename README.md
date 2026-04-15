# Shopper – Backend (E-Commerce API)

## Overview
This is the backend for my Shopper e-commerce application. It is built using Node.js and Express.js and is responsible for handling all core business logic such as user authentication, product management, cart operations, and Stripe payment processing.

The backend acts as the central API layer between the frontend and the database, ensuring secure and structured data flow.

---

## What I Used to Build This

I built this backend using Node.js and Express because it allows me to create fast and scalable REST APIs. It also integrates easily with MongoDB for database management and Stripe for payment processing.

The backend is designed to be modular, clean, and easy to maintain.

---

## Features Implemented

The backend currently supports the following features:

- User registration and login using JWT authentication  
- Password hashing using bcrypt for security  
- Product CRUD operations (create, read, update, delete)  
- Cart management (add, remove, update items)  
- Stripe checkout session creation  
- Stripe webhook handling for payment confirmation  
- Secure API routes with authentication middleware  
- RESTful API structure  

---

## Admin Access

This project includes a default admin account for testing and managing the system.

You can log in as admin using:

Email: admin@shopper.com  
Password: admin123  

Once logged in as admin, you can access admin-only features such as:

- Adding new products  
- Updating existing products  
- Deleting products  
- Managing store data  

Make sure to keep admin credentials secure in production environments.

---

## Tech Stack

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JSON Web Token (JWT)  
- Bcrypt.js  
- Stripe API  
- CORS  

---


## Environment Variables

Create a `.env` file in the root directory and add the following variables:

PORT=5000
MONGO_URI=""
JWT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_SECRET_KEY=""
STRIPE_SECRET_KEY=""
CLIENT_URL=""
STRIPE_WEBHOOK_SECRET=""

---

## Getting It Running Locally

Follow these steps to run the backend locally:

### 1. Clone the repository
git clone https://github.com/MuhammadAreeb334/Shopper-Backend.git  
cd Shopper-Backend  

### 2. Install dependencies
npm install  

### 3. Start the development server
npm run dev  

The server will run at:
http://localhost:5000  

---

## API Functionality

The backend provides REST APIs for:

### Authentication
- Register new users  
- Login existing users  
- Generate JWT tokens  

### Products
- Get all products  
- Get single product details  
- Add, update, and delete products (admin only)  

### Cart
- Add items to cart  
- Remove items from cart  
- Update item quantity  
- Fetch user cart  

### Payments (Stripe)
- Create checkout session  
- Redirect user to Stripe checkout  
- Handle Stripe webhook events  
- Confirm payment and clear cart  

---

## How Payment Flow Works

The Stripe payment process is handled securely in the backend:

1. Frontend sends cart details to backend  
2. Backend creates a Stripe checkout session  
3. Stripe returns a secure checkout URL  
4. User completes payment on Stripe’s hosted page  
5. Stripe sends a webhook event to backend after payment success  
6. Backend verifies payment and updates order status  
7. User cart is cleared after successful payment  

Sensitive payment information is never stored on this server. Stripe handles all payment security.

---

## Security Features

- Passwords are hashed using bcrypt  
- JWT tokens protect private routes  
- Environment variables are used for sensitive keys  
- Stripe webhook verification ensures secure payment confirmation  
- CORS configured for frontend communication  

---

## Frontend Connection

This backend is designed to work with the Shopper frontend application. Make sure both servers are running simultaneously:

- Frontend: React + Vite  
- Backend: Node.js + Express API  

The frontend communicates with this backend for all data operations including authentication, products, cart, and payments.

---