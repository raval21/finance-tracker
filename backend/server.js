require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Debug crash logs
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT ERROR:", err);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED PROMISE:", err);
});

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"]
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
