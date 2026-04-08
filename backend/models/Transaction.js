const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["income", "expense"],
    },
    description: String,
    amount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);