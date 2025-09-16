const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      enum: ['User', 'Clinician', 'Admin'],
      default: 'User'
    },

    // 🔹 Email verification
    emailVerified: { 
      type: Boolean, 
      default: false 
    },
    verificationToken: { 
      type: String 
    },
    verificationTokenExpires: { 
      type: Date 
    },

    // 🔹 Password reset
    resetPasswordToken: { 
      type: String 
    },
    resetPasswordExpires: { 
      type: Date 
    }
  }, 
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);