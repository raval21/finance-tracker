const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyOTP,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOTP);
router.post("/reset-password", resetPassword);

module.exports = router;