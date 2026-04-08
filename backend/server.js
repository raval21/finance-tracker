require("dotenv").config();

console.log("ENV VALUE:", process.env.MONGO_URI);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));



const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const transactionRoutes = require("./routes/transactionRoutes");

app.use("/api/transactions", transactionRoutes);
app.get("/", (req, res) => {
res.send("backend running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on ${PORT}`));
