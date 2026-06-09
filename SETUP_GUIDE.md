# SMM Panel Mobile - Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

## Installation & Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```bash
cp ../.env.example .env
```

4. Update `.env` with your values:
- MONGODB_URI
- JWT_SECRET
- Stripe and PayPal keys
- Email configuration
- Social media API keys

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## Features

### User Features
- ✅ User Registration & Login
- ✅ Profile Management
- ✅ Wallet/Balance Management
- ✅ Service Browsing & Ordering
- ✅ Order Tracking
- ✅ Transaction History
- ✅ Payment Processing (Stripe, PayPal)

### Admin Features
- ✅ Dashboard with Statistics
- ✅ User Management
- ✅ Service Management
- ✅ Order Management
- ✅ Analytics & Reports
- ✅ Settings Management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/wallet` - Get wallet balance
- `GET /api/user/transactions` - Get transactions
- `GET /api/user/orders` - Get user orders

### Services
- `GET /api/services` - Get all services
- `GET /api/services/category/:category` - Get services by category
- `GET /api/services/:id` - Get service details

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/status` - Get order status

### Payment
- `POST /api/payment/stripe/add-funds` - Add funds via Stripe
- `POST /api/payment/paypal/add-funds` - Add funds via PayPal

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/analytics` - Get analytics data

## Database Models

### User
```javascript
{
  username, email, password,
  firstName, lastName, phone,
  address, city, country,
  wallet, totalSpent,
  role (user/admin), profileImage
}
```

### Service
```javascript
{
  name, category, type, description,
  price, minOrder, maxOrder,
  refillDays, speed, quality, isActive
}
```

### Order
```javascript
{
  orderId, userId, serviceId,
  quantity, unitPrice, totalPrice,
  link, status, progress,
  paymentMethod, paymentStatus
}
```

### Transaction
```javascript
{
  userId, type (credit/debit),
  amount, method, description,
  orderId, status, transactionId
}
```

## Tech Stack

**Frontend:**
- React.js with Hooks
- React Router v6
- Axios for API calls
- Tailwind CSS
- React Icons
- React Toastify
- Zustand (State Management)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Stripe & PayPal Integration
- Express Validator
- Helmet & CORS

## Project Structure

```
smm-panel-mobile/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── package.json
├── .env.example
└── README.md
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
