# SMM Panel Mobile - Payment & Admin Configuration

## Payment Methods Setup

### EasyPaisa Integration
Your EasyPaisa account has been configured for payments:

**Account Details:**
- **Phone Number:** 03012998872
- **Account Name:** SADA
- **IBAN:** PK28SADA0000003012998872

**To enable EasyPaisa payments:**

1. Update your `.env` file with:
```env
# EasyPaisa Configuration
EASYPAISA_MERCHANT_ID=your_merchant_id
EASYPAISA_API_KEY=your_api_key
EASYPAISA_ACCOUNT_PHONE=03012998872
EASYPAISA_ACCOUNT_NAME=SADA
EASYPAISA_IBAN=PK28SADA0000003012998872
```

2. Install EasyPaisa SDK:
```bash
cd backend
npm install easypaisa
```

3. Add EasyPaisa to payment routes (`backend/routes/payment.js`):
```javascript
// Add EasyPaisa route
router.post('/easypaisa/add-funds', authMiddleware, paymentController.addFundsEasyPaisa);
router.post('/easypaisa/callback', paymentController.easypaisaCallback);
```

### Supported Payment Methods
- ✅ **Stripe** - International credit/debit cards
- ✅ **PayPal** - Global payments
- ✅ **EasyPaisa** - Pakistani mobile payments (NEW)

---

## Admin Account Setup

### Default Admin Credentials
```
Email: naiknamkhanbjr@gmail.com
Password: naiknam5426
Role: Admin
```

### How to Create Admin Account

**Option 1: Manual Database Insertion (Recommended for First Admin)**

1. Connect to your MongoDB database
2. Insert admin user:
```javascript
db.users.insertOne({
  username: "admin",
  email: "naiknamkhanbjr@gmail.com",
  password: "naiknam5426", // Will be hashed by the pre-save middleware
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  isActive: true,
  wallet: 10000,
  createdAt: new Date()
})
```

**Option 2: Via API (After Registration)**

1. Register as normal user first
2. Connect to MongoDB and update role:
```javascript
db.users.updateOne(
  { email: "naiknamkhanbjr@gmail.com" },
  { $set: { role: "admin" } }
)
```

### Admin Dashboard Access
- Login at: `http://localhost:3000/login`
- Email: `naiknamkhanbjr@gmail.com`
- Password: `naiknam5426`
- Navigate to: `http://localhost:3000/admin`

### Admin Features Available
- 📊 Dashboard with statistics
- �� User management
- 🛍️ Service management
- 📦 Order management
- 💰 Revenue tracking
- 📈 Analytics & reports
- ⚙️ System settings

---

## Complete Payment Configuration Guide

### Backend Payment Controller Updates

Create `backend/controllers/paymentController.js` with EasyPaisa support:

```javascript
const easypaisa = require('easypaisa');

// Add funds via EasyPaisa
exports.addFundsEasyPaisa = async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;

    const transaction = await easypaisa.initiatePayment({
      amount: amount,
      mobileAccount: phoneNumber,
      description: 'SMM Panel Wallet Top-up',
      orderId: `ORD${Date.now()}`,
      returnUrl: `${process.env.FRONTEND_URL}/payment/easypaisa/callback`,
      notifyUrl: `${process.env.BACKEND_URL}/api/payment/easypaisa/callback`
    });

    res.json({
      transactionId: transaction.transactionId,
      paymentUrl: transaction.paymentUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// EasyPaisa callback handler
exports.easypaisaCallback = async (req, res) => {
  try {
    const { transactionId, status, amount, orderId } = req.body;

    if (status === 'success') {
      // Update user wallet
      const transaction = await Transaction.findOne({ transactionId });
      if (transaction) {
        const user = await User.findById(transaction.userId);
        user.wallet += amount;
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
```

---

## Environment Variables Template

Update your `.env` file with all payment methods:

```env
# Server Configuration
BACKEND_PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/smm-panel
MONGODB_USER=your_mongo_user
MONGODB_PASSWORD=your_mongo_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:3000

# Stripe
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# EasyPaisa (Pakistani Payments)
EASYPAISA_MERCHANT_ID=your_merchant_id
EASYPAISA_API_KEY=your_api_key
EASYPAISA_ACCOUNT_PHONE=03012998872
EASYPAISA_ACCOUNT_NAME=SADA
EASYPAISA_IBAN=PK28SADA0000003012998872
EASYPAISA_SANDBOX=true

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Admin Configuration
ADMIN_EMAIL=naiknamkhanbjr@gmail.com
ADMIN_PASSWORD=naiknam5426

# Social Media APIs
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret

TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
```

---

## Testing Payments

### Test Mode Instructions

**Stripe Test Cards:**
- 4242 4242 4242 4242 (Success)
- 4000 0000 0000 0002 (Decline)

**PayPal Test:**
- Use PayPal sandbox accounts

**EasyPaisa Test:**
- Use sandbox mode in `.env`
- Phone: 03012998872

---

## Security Notes ⚠️

1. **Never commit `.env` file** to GitHub
2. **Rotate API keys** regularly
3. **Use strong passwords** for admin accounts
4. **Enable 2FA** when available
5. **Keep dependencies updated**

---

## First Time Setup Checklist

- [ ] Install all dependencies
- [ ] Configure MongoDB connection
- [ ] Set up `.env` file with payment keys
- [ ] Create admin account
- [ ] Test Stripe integration
- [ ] Test PayPal integration
- [ ] Test EasyPaisa integration
- [ ] Verify email configuration
- [ ] Run backend: `npm run dev`
- [ ] Run frontend: `npm start`
- [ ] Login with admin account
- [ ] Access admin dashboard

---

## Support

For payment integration issues:
- **Stripe**: https://dashboard.stripe.com
- **PayPal**: https://developer.paypal.com
- **EasyPaisa**: https://www.easypaisa.com.pk

For admin issues, contact: naiknamkhanbjr@gmail.com

---

**Last Updated:** June 9, 2026
