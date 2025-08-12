const router = require('express').Router();
const Restaurant = require('../models/Restaurant');
const { protect } = require('../middleware/authMiddleware'); // or remove for local

// CREATE restaurant
router.post('/', protect, async (req, res) => {
  const { name, description, cuisine, imageUrl, address, isActive } = req.body;
  const doc = await Restaurant.create({
    name,
    description: description || '',
    cuisine: cuisine || '',
    imageUrl: imageUrl || '',
    address: address || '',
    isActive: isActive ?? true
  });
  res.status(201).json(doc);
});

// LIST
router.get('/', async (_req, res) => {
  const docs = await Restaurant.find({ isActive: true }).sort('name');
  res.json(docs);
});

// DETAIL
router.get('/:id', async (req, res) => {
  const doc = await Restaurant.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Restaurant not found' });
  res.json(doc);
});

module.exports = router;
