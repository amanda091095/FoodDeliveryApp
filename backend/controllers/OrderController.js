const router = require('express').Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  // Expect: restaurantId, items [{menuItemId, name, price, quantity}], deliveryAddress
  // Compute subtotal/total on server for safety
});

router.get('/me', protect, async (req, res) => {
  const mine = await Order.find({ userId: req.user.id }).sort('-createdAt');
  res.json(mine);
});

router.get('/:id', protect, async (req, res) => { /* get order detail if owner */ });
router.patch('/:id/status', protect, async (req, res) => { /* admin/restaurant updates status */ });

module.exports = router;
