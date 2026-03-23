const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Database
const products = [
  { id: 1, name: "Daily Wear Trousers", price: 35.99, image: "images/img Daily wear trousers.png", category: "Men" },
  { id: 2, name: "Brown T-Shirt", price: 19.99, image: "images/img brown tshirt.png", category: "Men" },
  { id: 3, name: "Dark Jeans", price: 49.99, image: "images/img dark jean.png", category: "Men" },
  { id: 4, name: "Faded Jeans", price: 45.99, image: "images/img fadded jean.png", category: "Unisex" },
  { id: 5, name: "Classic Hat", price: 15.99, image: "images/img hat.png", category: "Accessories" },
  { id: 6, name: "Premium Hoodie 1", price: 55.99, image: "images/img hoodie 1.png", category: "Unisex" },
  { id: 7, name: "Premium Hoodie 2", price: 59.99, image: "images/img hoodie 2.png", category: "Unisex" },
  { id: 8, name: "Oversized Beige T-Shirt", price: 25.99, image: "images/img oversized beige tshirt.png", category: "Unisex" },
  { id: 9, name: "Paper Pants", price: 39.99, image: "images/img paper pants.png", category: "Women" },
  { id: 10, name: "Plain Jeans", price: 42.99, image: "images/img plain jean.png", category: "Unisex" },
  { id: 11, name: "White Shirt", price: 29.99, image: "images/img shirt white.png", category: "Men" },
  { id: 12, name: "Sport Shoe 1", price: 79.99, image: "images/img shoe 1.png", category: "Footwear" },
  { id: 13, name: "Sport Shoe 2", price: 85.99, image: "images/img shoe 2.png", category: "Footwear" },
  { id: 14, name: "Sport Shoe 3", price: 89.99, image: "images/img shoe 3.png", category: "Footwear" },
  { id: 15, name: "Lite Blue T-Shirt", price: 21.99, image: "images/img tshirt lite blue.png", category: "Men" },
  { id: 16, name: "Fancy Skirt", price: 34.99, image: "images/img women fancy skirt.png", category: "Women" },
  { id: 17, name: "Jean Skirt", price: 38.99, image: "images/img women jean skirt.png", category: "Women" },
  { id: 18, name: "Oversized White Pants", price: 44.99, image: "images/img women oversized white pants.png", category: "Women" },
  { id: 19, name: "Red Skirt", price: 36.99, image: "images/img women red skirt.png", category: "Women" },
  { id: 20, name: "Shoulder Bag", price: 49.99, image: "images/img women sholder bag.png", category: "Accessories" },
  { id: 21, name: "Black Skirt", price: 32.99, image: "images/img women skirt black.png", category: "Women" },
  { id: 22, name: "Pale Pink T-Shirt", price: 22.99, image: "images/img women tshirt palepink.png", category: "Women" },
  { id: 23, name: "Luxury Men's Watch", price: 249.99, image: "images/luxury_watch.png", category: "Accessories" }
];

const orders = new Map(); // Store orders with tracking logic

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/orders', (req, res) => {
  const { items, total } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Order is empty" });
  }

  // Generate a mock order ID
  const orderId = 'ORD' + Math.floor(10000 + Math.random() * 90000);
  
  // Create an order
  const newOrder = {
    orderId,
    items,
    total,
    status: 'Processing', // Processing, Shipped, Delivered
    date: new Date().toISOString(),
    history: [
      { status: 'Order Placed', time: new Date().toISOString() },
      { status: 'Processing', time: new Date().toISOString() }
    ]
  };

  orders.set(orderId, newOrder);

  // Simulate shipping update after 30 seconds for tracking demo
  setTimeout(() => {
    if(orders.has(orderId)) {
      const o = orders.get(orderId);
      if (o.status === 'Processing') {
        o.status = 'Shipped';
        o.history.push({ status: 'Shipped', time: new Date().toISOString() });
      }
    }
  }, 30000);

  // Simulate delivered after 60s
  setTimeout(() => {
    if(orders.has(orderId)) {
      const o = orders.get(orderId);
      if (o.status === 'Shipped') {
        o.status = 'Delivered';
        o.history.push({ status: 'Delivered', time: new Date().toISOString() });
      }
    }
  }, 60000);

  res.status(201).json({ message: "Order placed successfully", orderId });
});

app.get('/api/track/:id', (req, res) => {
  const orderId = req.params.id;
  const order = orders.get(orderId.toUpperCase());

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
