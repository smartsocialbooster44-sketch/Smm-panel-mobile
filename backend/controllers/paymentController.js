const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Add funds via Stripe
exports.addFundsStripe = async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SMM Panel Wallet Credit'
            },
            unit_amount: amount * 100
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      metadata: {
        userId: req.userId.toString()
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add funds via PayPal
exports.addFundsPayPal = async (req, res) => {
  try {
    const { amount } = req.body;
    res.json({ message: 'PayPal payment initiated', amount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add funds via EasyPaisa (Pakistani Payment Method)
exports.addFundsEasyPaisa = async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;

    // Create transaction record
    const transaction = new Transaction({
      userId: req.userId,
      type: 'credit',
      amount: parseFloat(amount),
      method: 'easypaisa',
      description: `EasyPaisa Top-up - Phone: ${phoneNumber}`,
      status: 'pending',
      transactionId: `EPI${Date.now()}`
    });

    await transaction.save();

    res.json({
      transactionId: transaction.transactionId,
      message: 'EasyPaisa payment initiated',
      amount: amount,
      phone: process.env.EASYPAISA_ACCOUNT_PHONE,
      accountName: process.env.EASYPAISA_ACCOUNT_NAME,
      instructions: `Send ${amount} PKR to ${process.env.EASYPAISA_ACCOUNT_PHONE} with reference: ${transaction.transactionId}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Handle Stripe webhook
exports.stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const user = await User.findById(session.metadata.userId);
      
      if (user) {
        const amount = session.amount_total / 100;
        user.wallet += amount;
        await user.save();

        await Transaction.create({
          userId: session.metadata.userId,
          type: 'credit',
          amount: amount,
          method: 'stripe',
          status: 'completed',
          transactionId: session.id,
          description: 'Stripe Payment - Wallet Top-up'
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: 'Webhook error' });
  }
};

// Handle PayPal webhook
exports.paypalWebhook = async (req, res) => {
  try {
    // PayPal webhook verification and processing
    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: 'Webhook error' });
  }
};

// Handle EasyPaisa callback
exports.easypaisaCallback = async (req, res) => {
  try {
    const { transactionId, status, amount } = req.body;

    if (status === 'success' || status === 'completed') {
      const transaction = await Transaction.findOne({ transactionId });
      
      if (transaction) {
        const user = await User.findById(transaction.userId);
        user.wallet += parseFloat(amount);
        await user.save();

        transaction.status = 'completed';
        await transaction.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Callback error' });
  }
};

// Get payment methods
exports.getPaymentMethods = async (req, res) => {
  res.json({
    methods: [
      {
        name: 'Wallet',
        code: 'wallet',
        icon: 'FaWallet'
      },
      {
        name: 'Stripe',
        code: 'stripe',
        icon: 'FaCreditCard',
        supported: true
      },
      {
        name: 'PayPal',
        code: 'paypal',
        icon: 'FaPaypal',
        supported: true
      },
      {
        name: 'EasyPaisa',
        code: 'easypaisa',
        icon: 'FaMobileAlt',
        supported: true,
        phone: process.env.EASYPAISA_ACCOUNT_PHONE,
        accountName: process.env.EASYPAISA_ACCOUNT_NAME
      }
    ]
  });
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const transaction = await Transaction.findOne({ transactionId });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      verified: transaction.status === 'completed',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};