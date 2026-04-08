

console.log("ENV VALUE:", process.env.MONGO_URI);
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(cors());
// Middleware
// app.use(cors({
//   origin:"https://finance-tracker-silk-alpha.vercel.app",methods:["GET","POST","PUT","DELETE"], allowedHeaders:["Content-Type","Authorization"],credentials:true
// }));

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
const PORT = process.env.PORT ;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on ${PORT}`));
