import { useEffect, useState } from 'react';
import api from '../axiosConfig';
import RestaurantCard from '../components/RestaurantCard';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/restaurants')
      .then(res => setRestaurants(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Restaurants</h2>
      {loading ? <div>Loading...</div> : null}
      {!loading && !restaurants.length ? <div>No restaurants yet.</div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {restaurants.map(r => <RestaurantCard key={r._id} r={r} />)}
      </div>
    </div>
  );
}
