const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    // ✅ FIX: Don't break flow if email fails
    try {
      await sendEmail(email, otp);
    } catch (err) {
      console.log("Email error (signup):", err.message);
    }

    res.json({ msg: "Signup successful. Verify OTP." });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ msg: "Account verified successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    // ✅ FIX: Don't break flow
    try {
      await sendEmail(email, otp);
    } catch (err) {
      console.log("Email error (forgot):", err.message);
    }

    res.json({ msg: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= VERIFY FORGOT OTP =================
exports.verifyForgotOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    res.json({ msg: "OTP verified" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ msg: "Password updated" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};