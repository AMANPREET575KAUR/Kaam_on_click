const { generateOTP, storeOTP, verifyOTP } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/mailer');
const ProviderProfile = require('../models/ProviderProfile');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Called after provider registers — send OTP
exports.sendProviderOTP = async (req, res) => {
  const { email, name } = req.body;
  try {
    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp, name);
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyProviderOTP = async (req, res) => {
  const { email, otp } = req.body;
  const result = verifyOTP(email, otp);
  if (result.valid) {
    // Mark provider as verified in DB
    await User.findOneAndUpdate({ email }, { isVerified: true });
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
};

// Admin: Get all providers
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await ProviderProfile.find().populate('userId');
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', email }, process.env.ADMIN_JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
};