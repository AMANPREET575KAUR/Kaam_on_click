const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const adminAuth = require('../middleware/adminAuth');

// OTP Routes (public)
router.post('/send-otp', providerController.sendProviderOTP);
router.post('/verify-otp', providerController.verifyProviderOTP);

// ✅ NEW — Google Auth Route
router.post('/auth/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    const { User } = require('../models');
    const jwt = require('jsonwebtoken');

    // Check if customer already exists
    let user = await User.findOne({ where: { email, role: 'CUSTOMER' } });

    if (!user) {
      // Create new customer from Google login
      user = await User.create({
        name,
        email,
        password: googleId, // store googleId as password placeholder
        role: 'CUSTOMER',
        isVerified: true,   // Google users are auto verified
        profileCompleted: false
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        state: user.state || "",
        profileCompleted: user.profileCompleted
      }
    });

  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ success: false, message: 'Google login failed' });
  }
});

// Admin Routes (protected)
router.post('/admin/login', providerController.adminLogin);
router.get('/admin/providers', adminAuth, providerController.getAllProviders);
router.get('/admin/users', adminAuth, providerController.getAllUsers);

module.exports = router;