const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['instagram', 'twitter', 'facebook', 'tiktok', 'youtube', 'telegram', 'twitch']
  },
  type: {
    type: String,
    required: true,
    enum: ['followers', 'likes', 'views', 'comments', 'shares', 'engagement']
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  minOrder: {
    type: Number,
    default: 1
  },
  maxOrder: {
    type: Number,
    default: 10000
  },
  refillDays: {
    type: Number,
    default: 0
  },
  speed: {
    type: String,
    enum: ['slow', 'medium', 'fast'],
    default: 'medium'
  },
  quality: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);