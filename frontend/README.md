# Moroccan Cosmetics E-Commerce Website

A full-stack e-commerce web application for selling Moroccan cosmetic products.
The platform allows users to browse products, view detailed information, manage a shopping cart and wishlist, authenticate securely, and place orders online.

The application was built using modern web technologies with a React frontend and a Node.js backend connected to a MongoDB database.

---

## Overview

This project demonstrates the implementation of a modern e-commerce platform with a clean architecture separating the frontend and backend.
It includes authentication, product browsing, cart management, order processing, and email services.

The system follows a RESTful API structure where the frontend communicates with the backend using HTTP requests.

---

## Technologies Used

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemailer

---

## Project Structure

```
ecommerce-project
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   │   └── assets
│   │       ├── images
│   │       └── data
│   │
│   └── src
│       ├── assets
│       ├── components
│       │   ├── Header.jsx
│       │   ├── Navbar.jsx
│       │   └── Footer.jsx
│       │
│       ├── contacts
│       │   └── AppContacts.jsx
│       │
│       ├── pages
│       │   ├── Home.jsx
│       │   ├── Shop.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Wishlist.jsx
│       │   ├── Login.jsx
│       │   ├── ResetPassword.jsx
│       │   ├── VerifyEmail.jsx
│       │   ├── ContactUs.jsx
│       │   └── AboutUs.jsx
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── README.md
```

---

## Features

### User Features

* Browse Moroccan cosmetic products
* View detailed product information
* Add products to a shopping cart
* Manage a personal wishlist
* Secure user authentication
* Email verification
* Password reset functionality
* Checkout and order placement

### System Features

* RESTful API architecture
* Secure authentication using JSON Web Tokens
* MongoDB database integration
* Email services using Nodemailer
* Responsive frontend interface
* Modular backend structure with controllers and routes

---

## Installation

### 1. Clone the Repository

```
git clone https://github.com/HajarBenbounjima04/ecommerce-project
cd ecommerce-project
```

---

### 2. Backend Setup

Navigate to the backend folder and install dependencies.

```
cd backend
npm install
```

Create a `.env` file inside the backend directory.

Example:

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SMTP_USER=your_email
SMTP_PASS=your_email_password
SENDER_EMAIL=your_email
NODE_ENV=development
```

Run the backend server:

```
npm run dev
```

The backend server will run on:

```
http://localhost:5000
```

---

### 3. Frontend Setup

Navigate to the frontend folder.

```
cd ../frontend
npm install
```

Create a `.env` file inside the frontend directory.

Example:

```
VITE_BACKEND_URL=http://localhost:5000
```

Run the frontend development server:

```
npm run dev
```

The frontend application will run on:

```
http://localhost:5173
```

---

## Email Integration

Email functionality is implemented using Nodemailer.
It is used for:

* Contact form messages
* Email verification
* Password reset requests

---

## Authentication

Authentication is implemented using JSON Web Tokens.
Passwords are securely stored using hashing and verification processes.

The authentication system supports:

* User registration
* Login
* Email verification
* Password reset

---

## Future Improvements

Potential improvements for the project include:

* Admin dashboard
* Product management panel
* Online payment integration
* Product reviews and ratings
* Order tracking system

---

## Author

Hajar Benbounjima
Software development student with a focus on full-stack web development.

---

## License

This project was developed for educational and portfolio purposes.
