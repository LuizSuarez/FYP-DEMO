const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Password validation function
function validatePassword(password) {
  const errors = [];

  if (password.length < 10) {
    errors.push("Password must be at least 10 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must include at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must include at least one number");
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push(
      "Password must include at least one special character (@, $, !, %, *, ?, &)"
    );
  }

  return errors;
}

// ✅ helper for signing tokens (keeps it DRY)
function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
}

// ✅ REGISTER
exports.register = async function (req, res) {
  const { name, email, password, role } = req.body;

  try {
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ errors: passwordErrors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token & expiry (24h)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log("Generating verification token:", verificationToken);
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    // 👇 default to "User" role if none provided
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "User",
      verificationToken,
      verificationTokenExpires,
    });
    await newUser.save();

    // Send verification email (non-blocking)
    const verifyURL = `${process.env.VITE_API_BACKEND}/api/auth/verify-email/${verificationToken}`;
    try {
      await sendEmail({
        to: newUser.email,
        subject: "Verify Your Email",
        html: `<p>Click <a href="${verifyURL}">here</a> to verify your email.</p>`,
      });
      console.log("✅ Verification email sent to:", newUser.email);
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }

    const token = signToken(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      verificationToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(`${process.env.VITE_API_FRONTEND}/verify-email?status=failed`);
    }

    // Mark email as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.redirect(`${process.env.VITE_API_FRONTEND}/consent?status=success`);
  } catch (error) {
    console.error("❌ Error in verifyEmail:", error.message);
    return res.redirect(`${process.env.VITE_API_FRONTEND}/verify-email?status=failed`);
  }
};

// ✅ LOGIN WITH TOKEN (auto-login after email verification)
exports.loginWithToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // Find user by verification token (only unverified users)
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Mark email as verified
  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  // Sign JWT
  const jwtToken = signToken(user);

  return res.status(200).json({
    token: jwtToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    msg: "Email verified and logged in successfully",
  });
};

const checkVerification = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ verified: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ verified: false });
    res.json({ verified: user.emailVerified });
  } catch (err) {
    console.error("Verification check error:", err);
    res.status(500).json({ verified: false });
  }
};

exports.checkVerification = checkVerification;

// ✅ LOGIN
exports.login = async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);               
    return res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async function (req, res) {
  const { email } = req.body;
  console.log("Forgot password request for email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No account with that email found" });
    }

    // Generate token
    const Token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(Token)
      .digest("hex");

    // Save token + expiry in DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Build reset link (frontend handles reset form)
    const resetLink = `${process.env.VITE_API_FRONTEND}/reset-password/${Token}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password (valid for 1 hour):</p>
                <a href="${resetLink}">${resetLink}</a>
            `,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async function (req, res) {
  const { token } = req.params;
  const { password } = req.body;

  // Hash the token before lookup
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

   // ✅ Hash the new password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ msg: "Password reset successful" });
};
