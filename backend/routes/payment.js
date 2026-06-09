const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');

// Add funds to wallet (Stripe)
router.post('/stripe/add-funds', authMiddleware, paymentController.addFundsStripe);

// Add funds to wallet (PayPal)
router.post('/paypal/add-funds', authMiddleware, paymentController.addFundsPayPal);

// Add funds to wallet (EasyPaisa - Pakistani Payment)
router.post('/easypaisa/add-funds', authMiddleware, paymentController.addFundsEasyPaisa);

// Handle Stripe webhook
router.post('/stripe/webhook', paymentController.stripeWebhook);

// Handle PayPal webhook
router.post('/paypal/webhook', paymentController.paypalWebhook);

// Handle EasyPaisa callback
router.post('/easypaisa/callback', paymentController.easypaisaCallback);

// Get payment methods
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);

// Verify payment
router.post('/verify', authMiddleware, paymentController.verifyPayment);

module.exports = router;