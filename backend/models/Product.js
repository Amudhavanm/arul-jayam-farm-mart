
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  images: [String],
  category: {
    type: String,
    required: true,
    enum: ['tractors', 'harvesters', 'tillers', 'seeders', 'sprayers']
  },
  colors: [String],
  specifications: [String],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
