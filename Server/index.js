const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const ProjectOrder = require("./Models/ProjectOrder");
const User = require("./Models/User");
const WithdrawnAmount = require("./Models/WithdrawnAmount");

const app = express();
app.use(express.json());

app.use(
  cors({
    // origin: process.env.FRONTEND_URL,
    origin: "https://dld-project-ordertracker.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("🚀 Backend API is running.");
});

app.post("/submit-order", async (req, res) => {
  try {
    // 🔐 Clean the payload based on type
    if (req.body.type === "Default") {
      delete req.body.projectDetails;
    } else {
      delete req.body.projectName;
    }

    const newOrder = new ProjectOrder(req.body);
    await newOrder.save();
    res.json({ success: true, message: "Order submitted", order: newOrder });
  } catch (error) {
    console.error("Submit Order Error:", error);
    res.status(500).json({ success: false, message: "Error saving order" });
  }
});

app.get("/all-orders", async (req, res) => {
  try {
    const orders = await ProjectOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
});

app.put("/update-order/:id", async (req, res) => {
  const { status, paidAmount, dueAmount } = req.body;

  try {
    const updatedOrder = await ProjectOrder.findByIdAndUpdate(
      req.params.id,
      { status, paidAmount, dueAmount },
      { new: true }
    );
    res.json({ success: true, message: "Order updated", order: updatedOrder });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
});

app.get("/withdrawn-amount", async (req, res) => {
  try {
    const data = await WithdrawnAmount.findOne();
    res.json({ success: true, amount: data?.amount || 0 });
  } catch (err) {
    console.error("Withdrawn GET Error:", err);
    res.status(500).json({ success: false, message: "Error fetching amount" });
  }
});

app.put("/update-withdrawn-amount", async (req, res) => {
  const { amount } = req.body;
  try {
    let doc = await WithdrawnAmount.findOne();
    if (!doc) {
      doc = new WithdrawnAmount({ amount });
    } else {
      doc.amount = amount;
    }
    await doc.save();
    res.json({ success: true, amount });
  } catch (err) {
    console.error("Withdrawn PUT Error:", err);
    res.status(500).json({ success: false, message: "Error updating amount" });
  }
});

app.post("/Signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.json({ success: true, message: "Signup successful", user: newUser });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

app.post("/Login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, password, role });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.json({ success: true, message: "Login successful", token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
// });

module.exports = app;
