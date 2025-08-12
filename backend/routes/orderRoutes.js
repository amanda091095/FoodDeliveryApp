// backend/routes/orderRoutes.js
const express = require('express');
const { createOrder, getOrdersByUser, updateOrder, deleteOrder } = require('../controllers/OrderController');
const { protect } = require('../middleware/authMiddleware'); // << add this

const router = express.Router();

router.use(protect);                // << ensure JWT is decoded and req.user is set

router.post('/', createOrder);
router.get('/me', getOrdersByUser);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
