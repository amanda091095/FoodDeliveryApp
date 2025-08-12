import { useState } from 'react';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminAddRestaurant() {
  const { token } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '',
    cuisine: '',
    description: '',
    imageUrl: '',
    address: ''
  });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.post('/restaurants', form, { headers });
      setMsg('✅ Created! Redirecting to Home…');
      setTimeout(() => nav('/'), 800);
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Failed to create');
    }
  };

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Add Restaurant</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={onChange('name')} style={{ width:'100%', padding:8, marginBottom:8 }} required />
        <input placeholder="Cuisine" value={form.cuisine} onChange={onChange('cuisine')} style={{ width:'100%', padding:8, marginBottom:8 }} />
        <input placeholder="Image URL" value={form.imageUrl} onChange={onChange('imageUrl')} style={{ width:'100%', padding:8, marginBottom:8 }} />
        <input placeholder="Address" value={form.address} onChange={onChange('address')} style={{ width:'100%', padding:8, marginBottom:8 }} />
        <textarea placeholder="Description" value={form.description} onChange={onChange('description')} rows={4} style={{ width:'100%', padding:8, marginBottom:8 }} />
        <button type="submit" style={{ padding: '8px 12px', borderRadius: 8, border: 0, background: '#2563eb', color: '#fff' }}>
          Create
        </button>
      </form>
      {msg && <div style={{ marginTop: 10 }}>{msg}</div>}
    </div>
  );
}
