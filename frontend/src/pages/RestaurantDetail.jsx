import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axiosConfig';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/restaurants/${id}`),
      api.get(`/menu-items/restaurant/${id}`)
    ]).then(([r1, r2]) => {
      setRestaurant(r1.data);
      setMenu(r2.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!restaurant) return <div style={{ padding: 16 }}>Restaurant not found.</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
      <div style={{ border: '1px solid #eee', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{restaurant.name}</h2>
        <div style={{ color: '#666' }}>{restaurant.cuisine || ''}</div>
        {restaurant.description ? <p style={{ marginTop: 8 }}>{restaurant.description}</p> : null}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {menu.map(m => (
          <MenuItemCard
            key={m._id}
            item={m}
            onAdd={() => add({ menuItemId: m._id, name: m.name, price: m.price, restaurantId: restaurant._id, quantity: 1 })}
          />
        ))}
      </div>
    </div>
  );
}
