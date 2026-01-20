const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/*
 PASSWORD VALIDATION FUNCTION
 -----------------------------
 Checks for:
 - At least 8 characters
 - At least 1 uppercase
 - At least 1 lowercase
 - At least 1 number
 - At least 1 special character
*/
const validatePassword = (password) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

/*
 REGISTER USER
 -------------
 Creates a new user account
*/
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists by email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if any user already has this hashed password
    const samePasswordUser = await User.findOne({ password: hashedPassword });
    if (samePasswordUser) {
      return res.status(400).json({
        message:
          "Another user already has this password. Choose a different one",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
 LOGIN USER
 ----------
 Logs in existing user
*/
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================================
   🔽 ADDED: FORGOT PASSWORD
   ================================================= */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token & expiry in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // FRONTEND RESET LINK (for now logged in console)
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    console.log("Password reset link:", resetUrl);

    res.json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================================
   🔽 ADDED: RESET PASSWORD
   ================================================= */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate password again
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful. Please login again.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
 EXPORTS
*/
module.exports = {
  registerUser,
  loginUser,

  /* 🔽 added exports */
  forgotPassword,
  resetPassword,
};
