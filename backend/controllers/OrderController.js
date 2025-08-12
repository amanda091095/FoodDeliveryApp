const Order = require('../models/Order');

const round2 = n => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const createOrder = async (req, res) => {
  const body = req.body || {};
  const { restaurantId, items, deliveryAddress } = body;

  if (!restaurantId) return res.status(400).json({ message: 'restaurantId required' });
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items must be a non-empty array' });
  }

  // If client explicitly included total, validate it; otherwise we'll compute one.
  const clientSentTotal = Object.prototype.hasOwnProperty.call(body, 'total');
  if (clientSentTotal) {
    const t = body.total;
    if (typeof t !== 'number' || !Number.isFinite(t) || t <= 0) {
      return res.status(400).json({ message: 'total must be a positive number' });
    }
  }

  try {
    const subtotal = round2(
      items.reduce((s, it) => s + Number(it.price) * Number(it.qty ?? it.quantity ?? 1), 0)
    );
    const deliveryFee = 0;
    const tax = 0;
    const computedTotal = round2(subtotal + tax + deliveryFee);

    const doc = await Order.create({
      userId: req.user?.id,
      restaurantId,
      items,
      deliveryAddress,
      subtotal,
      tax,
      deliveryFee,
      total: clientSentTotal ? body.total : computedTotal,
    });

    return res.status(201).json(doc);
  } catch {
    return res.status(500).json({ message: 'DB error' });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const list = await Order.find(userId ? { userId } : {}).sort('-createdAt');
    return res.status(200).json(list);
  } catch {
    return res.status(500).json({ message: 'DB error' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const update = { ...req.body };

    // If items provided, recompute totals server-side
    if (Array.isArray(update.items) && update.items.length > 0) {
      const subtotal = round2(
        update.items.reduce(
          (s, it) => s + Number(it.price) * Number(it.qty ?? it.quantity ?? 1),
          0
        )
      );
      const deliveryFee = 0;
      const tax = 0;
      update.subtotal = subtotal;
      update.tax = tax;
      update.deliveryFee = deliveryFee;
      update.total = round2(subtotal + tax + deliveryFee);
    }

    const doc = await Order.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json(doc);
  } catch {
    return res.status(500).json({ message: 'DB error' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Order.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Order deleted' });
  } catch {
    return res.status(500).json({ message: 'DB error' });
  }
};

module.exports = { createOrder, getOrdersByUser, updateOrder, deleteOrder };
