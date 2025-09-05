const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Password validation function
function validatePassword(password) {
    const errors = [];

    if (password.length < 10) {
        errors.push('Password must be at least 10 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must include at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must include at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must include at least one number');
    }
    if (!/[@$!%*?&]/.test(password)) {
        errors.push('Password must include at least one special character (@, $, !, %, *, ?, &)');
    }

    return errors;
}

// ✅ helper for signing tokens (keeps it DRY)
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
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

    // 👇 default to "User" role if none provided
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || "User" 
    });
    await newUser.save();

    const token = signToken(newUser);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ LOGIN
exports.login = async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.forgotPassword = async function (req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'No account with that email found' });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');

        // Save token + expiry in DB
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Build reset link (frontend handles reset form)
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // Send email
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password (valid for 1 hour):</p>
                <a href="${resetLink}">${resetLink}</a>
            `
        });

        res.json({ message: 'Password reset link sent to your email' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
exports.resetPassword = async function (req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
        
         if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
                
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({ errors: passwordErrors });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash new password
        const hashed = await bcrypt.hash(password, 10);

        // Update password & clear token
        user.password = hashed;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};