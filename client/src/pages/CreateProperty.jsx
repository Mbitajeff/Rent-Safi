import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  title: '',
  description: '',
  price: '',
  area: '',
  city: '',
  address: '',
  propertyType: 'apartment',
  bedrooms: '',
  bathrooms: '',
  size: '',
  amenities: [],
  contactPhone: '',
  contactEmail: '',
  availableFrom: '',
  images: [],
};

const propertyTypes = ['apartment', 'house', 'studio', 'bedsitter', 'maisonette', 'penthouse'];
const amenitiesList = [
  'parking', 'security', 'water', 'electricity', 'internet', 'gym',
  'pool', 'garden', 'balcony', 'air-conditioning', 'furnished',
  'kitchen', 'laundry', 'elevator', 'backup-power'
];

export default function CreateProperty() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [createdProperty, setCreatedProperty] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'images') {
      setForm(f => ({ ...f, images: Array.from(files) }));
    } else if (name === 'amenities') {
      setForm(f => ({
        ...f,
        amenities: checked
          ? [...f.amenities, value]
          : f.amenities.filter(a => a !== value)
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setErrors([]);
    setCreatedProperty(null);
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('location[area]', form.area);
    data.append('location[city]', form.city);
    data.append('location[address]', form.address);
    data.append('propertyType', form.propertyType);
    data.append('bedrooms', form.bedrooms);
    data.append('bathrooms', form.bathrooms);
    data.append('size', form.size);
    data.append('contactPhone', form.contactPhone);
    data.append('contactEmail', form.contactEmail);
    data.append('availableFrom', form.availableFrom);
    form.amenities.forEach(a => data.append('amenities[]', a));
    if (form.images && form.images.length > 0) {
      form.images.forEach(file => data.append('images', file));
    }
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: data
    });
    const result = await res.json();
    if (res.ok) {
      setMessage('Property created!');
      setForm(initialForm);
      setCreatedProperty(result.data);
      // Redirect to property detail page after short delay
      setTimeout(() => {
        if (result.data && result.data._id) {
          navigate(`/properties/${result.data._id}`);
        }
      }, 1200);
    } else {
      setMessage('Failed to create property');
      setErrors(result.errors || [result.error || 'Unknown error']);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">List Your Property</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="input" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="input" />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="input" />
          <input name="area" placeholder="Area" value={form.area} onChange={handleChange} required className="input" />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="input" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="input" />
          <select name="propertyType" value={form.propertyType} onChange={handleChange} required className="input">
            {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <input name="bedrooms" type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} required className="input" />
          <input name="bathrooms" type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange} required className="input" />
          <input name="size" type="number" placeholder="Size (sq ft)" value={form.size} onChange={handleChange} required className="input" />
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map(a => (
              <label key={a} className="flex items-center gap-1">
                <input type="checkbox" name="amenities" value={a} checked={form.amenities.includes(a)} onChange={handleChange} />
                {a}
              </label>
            ))}
          </div>
          <input name="contactPhone" placeholder="Contact Phone" value={form.contactPhone} onChange={handleChange} required className="input" />
          <input name="contactEmail" type="email" placeholder="Contact Email" value={form.contactEmail} onChange={handleChange} required className="input" />
          <input name="availableFrom" type="date" placeholder="Available From" value={form.availableFrom} onChange={handleChange} required className="input" />
          <input name="images" type="file" accept="image/*" multiple onChange={handleChange} className="input" />
          <button type="submit" className="btn btn-primary">Create Property</button>
          {message && <div className="text-center text-green-600">{message}</div>}
          {errors.length > 0 && (
            <div className="text-center text-red-600">
              {errors.map((err, i) => <div key={i}>{typeof err === 'string' ? err : err.msg}</div>)}
            </div>
          )}
        </form>
        {createdProperty && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded p-4">
            <h2 className="text-xl font-bold mb-2">Property Created!</h2>
            <div><strong>Title:</strong> {createdProperty.title}</div>
            <div><strong>Price:</strong> {createdProperty.price}</div>
            <div><strong>Location:</strong> {createdProperty.location?.area}, {createdProperty.location?.city}</div>
            <div><strong>Description:</strong> {createdProperty.description}</div>
            {createdProperty.images && createdProperty.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {createdProperty.images.map((img, idx) => (
                  <img key={idx} src={img.url} alt={createdProperty.title} className="w-32 h-32 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 