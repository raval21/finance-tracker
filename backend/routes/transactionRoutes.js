const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  addTransaction,
  getTransactions,
} = require("../controllers/transactionController");

router.post("/", auth, addTransaction);
router.get("/", auth, getTransactions);

module.exports = router;