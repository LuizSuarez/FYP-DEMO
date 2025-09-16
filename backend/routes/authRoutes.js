const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  loginWithToken,
  checkVerification,
} = require("../controllers/authController");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");


router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 10) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 10 characters long" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // check expiry
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

router.get("/login-with-token", loginWithToken);
router.get("/verify-email/:token", verifyEmail);

router.get("/check-verification", auth, checkVerification);

router.get("/dashboard", auth, (req, res) => {
  res.json({ message: `Welcome, your role is ${req.user.role}` });
});

router.get("/admin", auth, allowRoles("Admin"), (req, res) => {
  res.json({ message: "Admin content" });
});

router.get("/clinician", auth, allowRoles("Clinician"), (req, res) => {
  res.json({ message: "Clinician content" });
});

router.get("/user", auth, allowRoles("User"), (req, res) => {
  res.json({ message: "User content" });
});

module.exports = router;
