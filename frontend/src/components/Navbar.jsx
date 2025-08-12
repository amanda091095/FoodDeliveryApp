import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { items = [] } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const count = items.reduce((s, i) => s + (i.quantity || 0), 0);

  return (
    <nav style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #eee', zIndex: 10 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 20, textDecoration: 'none', color: '#111' }}>FoodDelivery</Link>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
          <Link to="/orders" style={{ textDecoration: 'none' }}>My Orders</Link>
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            Cart{count ? (
              <span style={{ marginLeft: 6, background: '#2563eb', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 12 }}>
                {count}
              </span>
            ) : null}
          </Link>

          {user ? (
            <>
              <span style={{ fontSize: 14, color: '#444' }}>
                Hi, {user.name || user.email}
              </span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{ background: '#111', color: '#fff', border: 0, padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ background: '#2563eb', color: '#fff', padding: '6px 10px', borderRadius: 8, textDecoration: 'none' }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{ background: '#f3f4f6', color: '#111', padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 8, textDecoration: 'none' }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
