# SMM Panel Mobile

A comprehensive Social Media Marketing (SMM) Panel with React frontend, Node.js backend, and MongoDB database. Works seamlessly on both mobile and desktop.

## Features

- 📱 Responsive design (Mobile & Desktop)
- 👤 User Authentication & Dashboard
- 📊 Service Management (Followers, Likes, Views, Comments, etc.)
- 💰 Wallet & Balance Management
- 📋 Order Management & History
- 💳 Payment Integration
- 📈 Analytics & Statistics
- ⚙️ Admin Panel
- 🔒 Secure JWT Authentication

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe/PayPal Integration

## Project Structure

```
Smm-panel-mobile/
├── frontend/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
├── backend/               # Node.js/Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── .env.example
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and other configs
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create `.env` files in both backend and frontend directories with necessary configurations.

## API Documentation

See `backend/API_DOCS.md` for detailed API endpoints.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.