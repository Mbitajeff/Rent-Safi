import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandlordDashboard() {
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/properties?mine=true', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setProperties(data.data || []));
    fetch('/api/appointments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setAppointments(data.appointments || []));
  }, []);

  const handleApprove = async (id) => {
    await fetch(`/api/appointments/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setAppointments(a => a.map(appt => appt._id === id ? { ...appt, status: 'approved' } : appt));
  };

  const handleDelete = async (id) => {
    await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProperties(props => props.filter(p => p._id !== id));
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Landlord Dashboard</h1>
      <button onClick={() => navigate('/create-property')}>Add New Property</button>
      <h2>My Properties</h2>
      <ul>
        {properties.map(p => (
          <li key={p._id}>
            {p.title} - {p.city} - {p.price}
            <button onClick={() => navigate(`/edit-property/${p._id}`)}>Edit</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Appointments</h2>
      <ul>
        {appointments.map(a => (
          <li key={a._id}>
            {a.property?.title} - {a.tenant?.name} - {a.status}
            {a.status === 'pending' && (
              <button onClick={() => handleApprove(a._id)}>Approve</button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
    </div>
  );
} 