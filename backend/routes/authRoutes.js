const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

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
