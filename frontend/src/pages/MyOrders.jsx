import { useEffect, useState } from 'react';
import api from '../axiosConfig';              // or '../axiosConfig.jsx' if you keep .jsx
import { useAuth } from '../context/AuthContext';

// status → chip colors
const STATUS_COLORS = {
  PLACED:           { bg: '#f3f4f6', text: '#111827', border: '#e5e7eb' },  // gray
  PREPARING:        { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },  // blue
  OUT_FOR_DELIVERY: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },  // amber
  DELIVERED:        { bg: '#dcfce7', text: '#065f46', border: '#bbf7d0' },  // green
  CANCELLED:        { bg: '#fee2e2', text: '#7f1d1d', border: '#fecaca' },  // red
};

function chipStyle(status) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.PLACED;
  return {
    background: c.bg,
    color: c.text,
    border: `1px solid ${c.border}`,
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '18px',
  };
}

export default function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  setLoading(true);
  console.log('MyOrders: fetching /orders/me...');
  api.get('/orders/me')
    .then(res => {
      console.log('MyOrders: data ->', res.data);
      setOrders(Array.isArray(res.data) ? res.data : []);
    })
    .catch(err => {
      console.log('MyOrders: error ->', err?.response?.status, err?.message);
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>My Orders</h2>
      {!orders.length ? <div>No orders yet.</div> : null}

      <div style={{ display: 'grid', gap: 12 }}>
        {orders.map(o => (
          <div key={o._id} style={{ border: '1px solid #eee', borderRadius: 16, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontWeight: 700 }}>Order #{o._id?.slice(-6)}</div>
              <div style={chipStyle(o.status)}>{o.status}</div>
            </div>
            <div style={{ marginTop: 6, color: '#333' }}>
              {(o.items || []).map(i => `${i.quantity}× ${i.name}`).join(', ')}
            </div>
            <div style={{ marginTop: 6, fontWeight: 700 }}>Total: ${Number(o.total || 0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
