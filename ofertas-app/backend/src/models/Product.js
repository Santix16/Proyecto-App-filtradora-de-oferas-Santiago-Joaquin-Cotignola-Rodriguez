const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    originalPrice: {
      type: Number
    },
    discount: {
      type: Number
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    },
    storeName: {
      type: String,
      required: true
    },
    location: {
      latitude: Number,
      longitude: Number
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
