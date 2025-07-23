import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TenantDashboard() {
  const [cart, setCart] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/cart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setCart(data.cart || []));
    fetch('/api/appointments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setAppointments(data.appointments || []));
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Tenant Dashboard</h1>
      <button
        style={{ marginBottom: 24, padding: '10px 24px', borderRadius: 6, background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
        onClick={() => navigate('/properties')}
      >
        Browse Properties
      </button>
      <h2>My Favorites</h2>
      <ul>
        {cart.map(p => (
          <li key={p._id}>{p.title} - {p.city} - {p.price}</li>
        ))}
      </ul>
      <h2>My Appointments</h2>
      <ul>
        {appointments.map(a => (
          <li key={a._id}>{a.property?.title} - {a.status}</li>
        ))}
      </ul>
      <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
    </div>
  );
} 