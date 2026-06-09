const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Dashboard stats
router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboardStats);

// User management
router.get('/users', authMiddleware, adminMiddleware, adminController.getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, adminController.getUserDetails);
router.put('/users/:id', authMiddleware, adminMiddleware, adminController.updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, adminController.deleteUser);

// Service management
router.post('/services', authMiddleware, adminMiddleware, adminController.createService);
router.put('/services/:id', authMiddleware, adminMiddleware, adminController.updateService);
router.delete('/services/:id', authMiddleware, adminMiddleware, adminController.deleteService);

// Order management
router.get('/orders', authMiddleware, adminMiddleware, adminController.getAllOrders);
router.put('/orders/:id/status', authMiddleware, adminMiddleware, adminController.updateOrderStatus);

// Analytics
router.get('/analytics', authMiddleware, adminMiddleware, adminController.getAnalytics);
router.get('/reports', authMiddleware, adminMiddleware, adminController.getReports);

// Settings
router.get('/settings', authMiddleware, adminMiddleware, adminController.getSettings);
router.put('/settings', authMiddleware, adminMiddleware, adminController.updateSettings);

module.exports = router;