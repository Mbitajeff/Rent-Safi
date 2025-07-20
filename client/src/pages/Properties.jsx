import { useState, useEffect } from 'react';
import axios from 'axios';
import MapGL, { Marker, Popup } from 'react-map-gl';
import placeholderImg from '/placeholder-property.png';
import { useAuth } from '../context/AuthContext';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94dXNlciIsImEiOiJja2x4b2Z2b3gwMDFwMnBvN2F2b2Z6b2JzIn0.2Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [filters, setFilters] = useState({});
  const [viewport, setViewport] = useState({
    latitude: -1.2921,
    longitude: 36.8219,
    zoom: 11,
    width: '100%',
    height: 400,
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalProperty, setModalProperty] = useState(null);
  const [viewingDate, setViewingDate] = useState('');
  const [viewingTime, setViewingTime] = useState('');
  const [viewingMessage, setViewingMessage] = useState('');
  const { user } = useAuth ? useAuth() : { user: null };
  const [favorites, setFavorites] = useState([]);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      q: search,
      propertyType: type,
      minPrice,
      maxPrice,
      bedrooms,
    });
  };

  // Fetch properties when filters change
  useEffect(() => {
    const fetchProperties = async () => {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      const res = await axios.get('/api/properties/search', { params });
      setProperties(res.data.data || res.data.properties || res.data);
    };
    fetchProperties();
  }, [filters]);

  // Fetch user's favorites on mount (if logged in)
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/properties/favorites', { headers: { Authorization: `Bearer ${token}` } });
        setFavorites(res.data.favorites.map(fav => fav._id));
      } catch (err) {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [user]);

  // Add to cart handler
  const handleAddToCart = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/properties/${propertyId}/favorite`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(prev => [...prev, propertyId]);
    } catch (err) {
      alert('Failed to add to cart.');
    }
  };

  // Remove from cart handler
  const handleRemoveFromCart = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/properties/${propertyId}/favorite`, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(prev => prev.filter(id => id !== propertyId));
    } catch (err) {
      alert('Failed to remove from cart.');
    }
  };

  // Modal submit handler (integrated with backend)
  const handleViewingRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to request a viewing.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/messages',
        {
          receiver: modalProperty.landlord?._id || modalProperty.landlord,
          property: modalProperty._id,
          subject: 'Viewing Request',
          content: viewingMessage || `Requesting a viewing for ${viewingDate} at ${viewingTime}`,
          type: 'inquiry',
          viewingRequest: {
            requestedDate: viewingDate,
            requestedTime: viewingTime,
            status: 'pending',
            notes: viewingMessage,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setModalProperty(null);
      setViewingDate('');
      setViewingTime('');
      setViewingMessage('');
      alert('Viewing request submitted! The landlord will be notified.');
    } catch (err) {
      alert('Failed to submit viewing request. Please try again.');
    }
  };

  return (
    <div>
      <h1>Find Properties in Nairobi</h1>
      {/* Search Bar & Filters */}
      <form
        style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search area, address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 2, minWidth: 180, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ minWidth: 120, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="studio">Studio</option>
          <option value="bedsitter">Bedsitter</option>
          <option value="maisonette">Maisonette</option>
          <option value="penthouse">Penthouse</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          style={{ width: 100, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          style={{ width: 100, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Bedrooms"
          value={bedrooms}
          onChange={e => setBedrooms(e.target.value)}
          style={{ width: 100, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: '8px 20px', borderRadius: 4, background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Search
        </button>
      </form>

      {/* Map Section */}
      <div style={{ marginBottom: 24 }}>
        <img
          src="/nairobi-map.png"
          alt="Nairobi Map"
          style={{ width: '100%', maxWidth: 800, height: 400, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
        />
      </div>

      {/* Property List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {properties.map((property, idx) => {
          const imgSrc = property.images && property.images.length > 0 && property.images[0].url
            ? property.images[0].url
            : placeholderImg;
          const isFavorite = favorites.includes(property._id);
          return (
            <div
              key={property._id || idx}
              style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 260, maxWidth: 320, background: selectedProperty && selectedProperty._id === property._id ? '#f0fdf4' : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={() => {
                if (property.location?.coordinates?.lat && property.location?.coordinates?.lng) {
                  setViewport(v => ({ ...v, latitude: property.location.coordinates.lat, longitude: property.location.coordinates.lng, zoom: 14 }));
                  setSelectedProperty(property);
                }
              }}
            >
              <img
                src={imgSrc}
                alt={property.title}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 8, border: '1px solid #ddd' }}
              />
              <h3 style={{ margin: '8px 0 4px 0', fontSize: 18 }}>{property.title}</h3>
              <div style={{ color: '#555', marginBottom: 4 }}>{property.location.area}, {property.location.city}</div>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: 4 }}>KES {property.price.toLocaleString()}</div>
              <div style={{ fontSize: 14 }}>{property.bedrooms} BR, {property.bathrooms} Bath</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>Type: {property.propertyType}</div>
              <div style={{ fontSize: 13, color: property.isAvailable ? '#10b981' : '#ef4444' }}>
                Available: {property.isAvailable ? 'Yes' : 'No'}
              </div>
              {user && user.role === 'tenant' && (
                isFavorite ? (
                  <button
                    style={{ marginTop: 8, padding: '6px 16px', borderRadius: 4, background: '#ef4444', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveFromCart(property._id);
                    }}
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    style={{ marginTop: 8, padding: '6px 16px', borderRadius: 4, background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation();
                      handleAddToCart(property._id);
                    }}
                  >
                    Add to Cart
                  </button>
                )
              )}
              <button
                style={{ marginTop: 10, padding: '6px 16px', borderRadius: 4, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation();
                  setShowModal(true);
                  setModalProperty(property);
                }}
              >
                Request Viewing
              </button>
            </div>
          );
        })}
      </div>

      {/* Viewing Request Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <h2>Request Viewing for {modalProperty?.title}</h2>
            <form onSubmit={handleViewingRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              <label>
                Date:
                <input type="date" value={viewingDate} onChange={e => setViewingDate(e.target.value)} required style={{ marginLeft: 8 }} />
              </label>
              <label>
                Time:
                <input type="time" value={viewingTime} onChange={e => setViewingTime(e.target.value)} required style={{ marginLeft: 8 }} />
              </label>
              <label>
                Message (optional):
                <textarea value={viewingMessage} onChange={e => setViewingMessage(e.target.value)} rows={2} style={{ width: '100%', marginTop: 4 }} />
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Submit</button>
                <button type="button" style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties; 