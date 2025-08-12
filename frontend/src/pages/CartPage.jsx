import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, remove, updateQty, subtotal } = useCart();

  if (!items.length) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
        Cart is empty. <Link to="/" style={{ color: '#2563eb' }}>Browse restaurants</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Your Cart</h2>
      {items.map(it => (
        <div key={it.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', padding: '10px 0' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{it.name}</div>
            <div style={{ color: '#555', fontSize: 14 }}>${Number(it.price).toFixed(2)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              min={1}
              value={it.quantity}
              onChange={e => updateQty(it.menuItemId, Number(e.target.value) || 1)}
              style={{ width: 60, padding: 6 }}
            />
            <button onClick={() => remove(it.menuItemId)} style={{ color: '#b91c1c', background: 'transparent', border: '1px solid #eee', padding: '6px 10px', borderRadius: 8 }}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Subtotal: ${subtotal.toFixed(2)}</div>
        <Link to="/checkout" style={{ background: '#2563eb', color: '#fff', padding: '8px 14px', borderRadius: 10, textDecoration: 'none' }}>
          Checkout
        </Link>
      </div>
    </div>
  );
}
