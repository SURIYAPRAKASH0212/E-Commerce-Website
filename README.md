# Threadora - Premium E-Commerce Platform

![Threadora Preview](./public/images/premium_hero.png)

## Overview
**Threadora** is a sleek, fully-featured, and modern e-commerce web application built to deliver a premium shopping experience. Inspired by minimalist aesthetics and modern glassmorphism design principles, it offers users a smooth and dynamic journey from browsing exclusive apparel to securely mapping order deliveries.

## 🌟 Key Features

### 🛍️ Core Shopping Experience
- **Interactive Product Catalog**: Browse a dynamic list of premium clothing and footwear. 
- **Dynamic Size Selector**: Seamlessly select exact dress sizes (S, M, L, XL) or shoe sizes before adding an item to the cart. 
- **Favorites (Wishlist)**: Heart your favorite items to save them for later! Favorites are stored persistently on your device.
- **Smart Shopping Cart**: Update quantities, remove items, and see your subtotals in real-time. Size choices are perfectly reflected in your cart summary.

### 🔐 User Authentication (Front-end)
- **Account Registration & Login**: Isolated and fully fleshed out authentication wall.
- **Persistent Sessions**: Your login state is saved locally. If you're not logged in, the entire app strictly redirects you to the Login screen to ensure privacy.
- **Dynamic Navbars**: The interface intelligently swaps "Login" to a "Logout" action when you are authenticated.

### 📦 Checkout & Track Order
- **Instant Checkout Mockup**: Submitting an order generates a unique Order ID directly sent from our Node.js Backend.
- **Animated Order Tracking**: Enter your secret Order ID in the "Track Order" page to watch a beautiful, animated timeline detailing your package's delivery steps (Processing → Shipped → Delivered).

## 🛠️ Technology Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Variables, Flexbox/Grid, Glassmorphism), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js (REST API Endpoints).
- **Storage**: In-memory server caching for orders, and LocalStorage for blazing-fast cart, favorites, and user session persistence.

## 🚀 Getting Started

### Prerequisites
You will need [Node.js](https://nodejs.org/en/) installed on your local machine.

### Installation & Run instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SURIYAPRAKASH0212/E-Commerce-Website.git
   cd E-Commerce-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm start
   # Alternatively: node server.js
   ```

4. **Open the App:**
   Open your preferred web browser and head to:
   `http://localhost:3000`

---

*Designed and engineered to elevate everyday style seamlessly.*
