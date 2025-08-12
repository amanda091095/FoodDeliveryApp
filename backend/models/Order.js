const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: String,                // denormalized for snapshot
  price: Number,               // snapshot price
  quantity: { type: Number, default: 1, min: 1 },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 },
  deliveryAddress: {
    line1: String, line2: String, city: String, postcode: String, instructions: String
  },
  status: { type: String, enum: ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'], default: 'PLACED' },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'REFUNDED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
