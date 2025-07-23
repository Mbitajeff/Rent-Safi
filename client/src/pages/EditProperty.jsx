import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', price: '', city: '', area: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        const p = data.data || data.property;
        setForm({
          title: p.title || '',
          price: p.price || '',
          city: p.city || '',
          area: p.area || '',
          description: p.description || ''
        });
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMessage('Property updated!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setMessage('Failed to update property');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
          <input name="title" value={form.title} onChange={handleChange} className="input" />
          <input name="price" value={form.price} onChange={handleChange} className="input" />
          <input name="city" value={form.city} onChange={handleChange} className="input" />
          <input name="area" value={form.area} onChange={handleChange} className="input" />
          <textarea name="description" value={form.description} onChange={handleChange} className="input" />
          <button type="submit" className="btn btn-primary">Update Property</button>
          {message && <div className="text-center text-green-600">{message}</div>}
        </form>
      </div>
    </div>
  );
} 