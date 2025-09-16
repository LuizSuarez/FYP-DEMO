const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    // ✅ req.user contains decoded token (id, role, etc.)
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      verificationToken: user.verificationToken,        // 🔹 added
      verificationTokenExpires: user.verificationTokenExpires, // 🔹 added
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("❌ Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
