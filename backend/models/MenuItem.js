const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  imageUrl: String,
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
