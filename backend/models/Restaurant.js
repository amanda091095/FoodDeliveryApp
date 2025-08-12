const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  cuisine: String,
  imageUrl: String,
  address: String,
  isActive: { type: Boolean, default: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
