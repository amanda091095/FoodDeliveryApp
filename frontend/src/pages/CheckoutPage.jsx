// frontend/src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { useCart } from '../context/CartContext';
// (Auth is handled by axios interceptor reading fd_token; no need to pass token)

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [addr, setAddr] = useState({ line1: '', city: '', postcode: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  if (!items.length) {
    return <div style={{ padding: 16 }}>Your cart is empty.</div>;
  }

  const place = async () => {
    try {
      setLoading(true);
      setErr('');

      // 1) Validate basic address fields (optional but helpful)
      if (!addr.line1 || !addr.city || !addr.postcode) {
        setErr('Please fill delivery address (line1, city, postcode).');
        return;
      }

      // 2) restaurantId from first cart item (all items should be from same restaurant)
      const restaurantId = items[0]?.restaurantId;
      if (!restaurantId) {
        setErr('Missing restaurantId on cart items.');
        return;
      }

      // 3) Map cart items to the fields the backend expects
      const orderItems = items.map(i => ({
        menuItemId: i._id ?? i.menuItemId,  // support either key
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity || 1),
      }));

      const payload = {
        restaurantId,
        items: orderItems,
        deliveryAddress: {
          line1: addr.line1,
          city: addr.city,
          postcode: addr.postcode,
        },
        // backend will compute subtotal/total; no need to send them
      };

      // 4) POST (Authorization header is auto-added by axios interceptor)
      await api.post('/orders', payload);

      // 5) Success → clear cart & go to My Orders
      clear();
      navigate('/orders');
    } catch (e) {
      // show friendly validation error if backend sends one
      setErr(e?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Checkout</h2>

      <div style={{ border: '1px solid #eee', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Delivery address</h3>
        <input
          placeholder="Line 1"
          value={addr.line1}
          onChange={e => setAddr({ ...addr, line1: e.target.value })}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          placeholder="City"
          value={addr.city}
          onChange={e => setAddr({ ...addr, city: e.target.value })}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          placeholder="Postcode"
          value={addr.postcode}
          onChange={e => setAddr({ ...addr, postcode: e.target.value })}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span>Subtotal</span>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>

      {err ? <div style={{ color: '#b91c1c', marginBottom: 8 }}>{err}</div> : null}

      <button
        disabled={loading}
        onClick={place}
        style={{ width: '100%', background: '#16a34a', color: '#fff', padding: '10px 14px', borderRadius: 10, border: 0, cursor: 'pointer' }}
      >
        {loading ? 'Placing...' : 'Place order'}
      </button>
    </div>
  );
}
