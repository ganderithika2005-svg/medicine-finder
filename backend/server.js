// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1️⃣ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/medinow", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// 2️⃣ Define Schemas
const UserSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: String
});

const OrderSchema = new mongoose.Schema({
  email: String,            // user's email
  items: [String],          // list of medicine names
  total: Number,            // total price
  address: String,          // delivery address
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now }
});

// 3️⃣ Create Models
const User = mongoose.model("User", UserSchema);
const Order = mongoose.model("Order", OrderSchema);

// 4️⃣ API Routes

// ➤ Register User
app.post("/api/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const user = new User({ fullname, email, password });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ➤ Login User
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ➤ Place Order
app.post("/api/orders", async (req, res) => {
  try {
    const { email, items, total, address } = req.body;
    if (!email || !items || items.length === 0 || !address) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }
    const order = new Order({ email, items, total, address });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ➤ Get All Orders for a User
app.get("/api/orders/:email", async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ➤ Get Single Order by ID
app.get("/api/orders/id/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5️⃣ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
