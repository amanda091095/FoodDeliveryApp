const router = require('express').Router();
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/authMiddleware');

router.get('/restaurant/:restaurantId', async (req, res) => {
  res.json(await MenuItem.find({ restaurantId: req.params.restaurantId, isAvailable: true }));
});

router.post('/', protect, async (req, res) => { /* add menu item */ });
router.put('/:id', protect, async (req, res) => { /* update */ });
router.delete('/:id', protect, async (req, res) => { /* delete or isAvailable=false */ });

module.exports = router;
