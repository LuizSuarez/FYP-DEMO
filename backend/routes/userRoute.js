const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get logged-in user's profile
// @access  Private
router.get("/me", authMiddleware, getUserProfile);

module.exports = router;
