import { Link } from 'react-router-dom';

export default function RestaurantCard({ r }) {
  return (
    <Link to={`/restaurant/${r._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ border: '1px solid #eee', borderRadius: 16, overflow: 'hidden' }}>
        {r.imageUrl ? (
          <img src={r.imageUrl} alt={r.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
        ) : (
          <div style={{ height: 160, background: '#f5f5f5' }} />
        )}
        <div style={{ padding: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{r.name}</div>
          <div style={{ color: '#555', fontSize: 14 }}>{r.cuisine || 'Various'}</div>
          {r.description ? <p style={{ color: '#333', marginTop: 8 }}>{r.description}</p> : null}
        </div>
      </div>
    </Link>
  );
}
