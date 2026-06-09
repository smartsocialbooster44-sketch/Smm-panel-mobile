const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// Get user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update user profile
router.put('/profile', authMiddleware, userController.updateProfile);

// Change password
router.post('/change-password', authMiddleware, userController.changePassword);

// Get wallet balance
router.get('/wallet', authMiddleware, userController.getWallet);

// Get transaction history
router.get('/transactions', authMiddleware, userController.getTransactions);

// Get user orders
router.get('/orders', authMiddleware, userController.getOrders);

// Upload profile image
router.post('/upload-profile-image', authMiddleware, userController.uploadProfileImage);

module.exports = router;