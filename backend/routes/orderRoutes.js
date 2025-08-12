const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

router.post('/', protect, async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress } = req.body;

    // Basic validation
    if (!restaurantId) return res.status(400).json({ message: 'restaurantId is required' });
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'items is required' });
    if (!deliveryAddress || !deliveryAddress.line1 || !deliveryAddress.city || !deliveryAddress.postcode)
      return res.status(400).json({ message: 'deliveryAddress.line1, city, postcode are required' });

    // Normalize items
    const normalizedItems = items.map(i => ({
      menuItemId: i.menuItemId ?? i._id,               // allow either key
      name: String(i.name || ''),
      price: Number(i.price),
      quantity: Number(i.quantity || 1),
    }));

    // Compute amounts (MUST be numbers)
    const subtotal = normalizedItems.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );
    const deliveryFee = 0;                             // change if you have rules
    const total = subtotal + deliveryFee;

    console.log('calc amounts =>', { subtotal, deliveryFee, total });

    // Build document matching schema (INCLUDE total!)
    const orderDoc = {
      userId: req.user.id,
      restaurantId,
      items: normalizedItems,
      deliveryAddress,
      subtotal,
      deliveryFee,
      total,                                           // <-- REQUIRED BY SCHEMA
      // status & paymentStatus will use schema defaults
    };

    console.log('calc amounts =>', { subtotal, deliveryFee, total });
    console.log('orderDoc keys:', Object.keys(orderDoc));
    console.log('orderDoc:', JSON.stringify(orderDoc, null, 2));


    const order = await Order.create(orderDoc);
    return res.status(201).json(order);
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.error('Order validation error:', err.message);
      return res.status(400).json({ message: err.message });
    }
    console.error('POST /api/orders error:', err);
    return res.status(500).json({ message: 'Internal error creating order' });
  }
});
// GET /api/orders/me  -> all orders for the logged-in user
router.get('/me', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
