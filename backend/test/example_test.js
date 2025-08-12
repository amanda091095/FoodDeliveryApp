const sinon = require('sinon');
const { expect } = require('chai');
const Order = require('../models/Order');
const { createOrder, getOrdersByUser, updateOrder, deleteOrder } = require('../controllers/OrderController');

const makeRes = () => {
  const res = {
    status: sinon.stub(),
    json: sinon.spy(),
  };
  res.status.returns(res);
  return res;
};

describe('OrderController', () => {
  afterEach(() => sinon.restore());

  // ---------- Add / Create ----------
  describe('AddOrder Function Test', () => {
    it('should create a new order successfully', async () => {
      const req = {
        body: {
          restaurantId: 'r1',
          items: [{ name: 'Burger', price: 8, qty: 2 }],
          deliveryAddress: { city: 'Brisbane' },
        },
        user: { id: 'u1' },
      };
      const res = makeRes();

      const created = { _id: 'o1' };
      sinon.stub(Order, 'create').resolves(created);

      await createOrder(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(created)).to.be.true;
    });

    it('should return 400 when items missing/empty', async () => {
      const req = { body: { restaurantId: 'r1', items: [] }, user: { id: 'u1' } };
      const res = makeRes();
      await createOrder(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 when total invalid (if provided)', async () => {
      const req = {
        body: { restaurantId: 'r1', items: [{ price: 10, qty: 1 }], total: 0 },
        user: { id: 'u1' },
      };
      const res = makeRes();
      await createOrder(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      const req = {
        body: { restaurantId: 'r1', items: [{ price: 10, qty: 1 }] },
        user: { id: 'u1' },
      };
      const res = makeRes();
      sinon.stub(Order, 'create').throws(new Error('boom'));
      await createOrder(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // ---------- Get / List ----------
  describe('GetOrders Function Test', () => {
    it('should return tasks for the given user', async () => {
      const req = { user: { id: 'u1' } };
      const res = makeRes();

      const list = [];
      const sortStub = sinon.stub().returns(list);
      sinon.stub(Order, 'find').returns({ sort: sortStub });

      await getOrdersByUser(req, res);
      expect(Order.find.calledWith({ userId: 'u1' })).to.be.true;
      expect(sortStub.calledWith('-createdAt')).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(list)).to.be.true;
    });

    it('should return 500 on error', async () => {
      const req = { user: { id: 'u1' } };
      const res = makeRes();
      sinon.stub(Order, 'find').throws(new Error('boom'));
      await getOrdersByUser(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // ---------- Update ----------
  describe('UpdateOrder Function Test', () => {
    it('should update order successfully', async () => {
      const req = { params: { id: 'o1' }, body: { status: 'paid' } };
      const res = makeRes();

      const updated = { _id: 'o1', status: 'paid' };
      sinon.stub(Order, 'findByIdAndUpdate').resolves(updated);

      await updateOrder(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updated)).to.be.true;
    });

    it('should return 404 if order is not found', async () => {
      const req = { params: { id: 'o1' }, body: { status: 'paid' } };
      const res = makeRes();

      sinon.stub(Order, 'findByIdAndUpdate').resolves(null);

      await updateOrder(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 500 on error', async () => {
      const req = { params: { id: 'o1' }, body: { status: 'paid' } };
      const res = makeRes();

      sinon.stub(Order, 'findByIdAndUpdate').throws(new Error('boom'));

      await updateOrder(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // ---------- Delete ----------
  describe('DeleteOrder Function Test', () => {
    it('should delete order successfully', async () => {
      const req = { params: { id: 'o1' } };
      const res = makeRes();

      sinon.stub(Order, 'findByIdAndDelete').resolves({ _id: 'o1' });

      await deleteOrder(req, res);
      expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 404 if order is not found', async () => {
      const req = { params: { id: 'o1' } };
      const res = makeRes();

      sinon.stub(Order, 'findByIdAndDelete').resolves(null);

      await deleteOrder(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 500 on error', async () => {
      const req = { params: { id: 'o1' } };
      const res = makeRes();

      sinon.stub(Order, 'findByIdAndDelete').throws(new Error('boom'));

      await deleteOrder(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});
