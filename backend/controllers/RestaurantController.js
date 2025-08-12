const router = require('express').Router();
const Restaurant = require('../models/Restaurant');
const { protect } = require('../middleware/auth');

// Public: list & detail
router.get('/', async (req, res) => res.json(await Restaurant.find({ isActive: true })));
router.get('/:id', async (req, res) => {
  const doc = await Restaurant.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

// Admin only (optional): create/update/delete
router.post('/', protect, async (req, res) => { /* create */ });
router.put('/:id', protect, async (req, res) => { /* update */ });
router.delete('/:id', protect, async (req, res) => { /* soft delete */ });

module.exports = router;
