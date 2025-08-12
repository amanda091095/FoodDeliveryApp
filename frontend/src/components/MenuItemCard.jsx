export default function MenuItemCard({ item, onAdd }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 16, overflow: 'hidden' }}>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
      ) : (
        <div style={{ height: 140, background: '#f5f5f5' }} />
      )}
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            {item.description ? <div style={{ fontSize: 13, color: '#555' }}>{item.description}</div> : null}
          </div>
          <div style={{ fontWeight: 700 }}>${Number(item.price).toFixed(2)}</div>
        </div>
        <button
          onClick={onAdd}
          style={{ marginTop: 10, width: '100%', background: '#2563eb', color: '#fff', border: 0, padding: '8px 12px', borderRadius: 10, cursor: 'pointer' }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
