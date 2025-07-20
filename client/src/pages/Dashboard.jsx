import { useAuth } from '../context/AuthContext'
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import placeholderImg from '/placeholder-property.png';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function Dashboard() {
  const { user } = useAuth();
  // Real-time chat state
  const [socket, setSocket] = useState(null);
  const [recipientId, setRecipientId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch user list for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [user]);

  // Fetch tenant's favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || user.role !== 'tenant') return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/properties/favorites', { headers: { Authorization: `Bearer ${token}` } });
        setFavorites(res.data.favorites);
      } catch (err) {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [user]);

  // Helper to generate a unique room for two users (sorted)
  const getPrivateRoomId = (id1, id2) => {
    return ['private', ...[id1, id2].sort()].join(':');
  };

  // Join private room when recipientId changes
  useEffect(() => {
    if (!user?._id || !recipientId) return;
    const privateRoom = getPrivateRoomId(user._id, recipientId);
    setRoomId(privateRoom);
    setMessages([]); // Clear messages when switching room
  }, [user?._id, recipientId]);

  useEffect(() => {
    if (!roomId) return;
    const s = io(SOCKET_URL, { withCredentials: true });
    setSocket(s);
    s.emit('joinRoom', roomId);
    s.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => s.disconnect();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && socket && roomId) {
      const data = {
        roomId,
        message,
        from: user?._id,
        to: recipientId,
      };
      socket.emit('sendMessage', data);
      setMessages((prev) => [...prev, { ...data, self: true }]);
      setMessage('');
    }
  };

  // Remove from cart handler (reuse from Properties page logic)
  const handleRemoveFromCart = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/properties/${propertyId}/favorite`, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(prev => prev.filter(p => p._id !== propertyId));
    } catch (err) {
      alert('Failed to remove from cart.');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Private Messaging Demo */}
      <div style={{ border: '1px solid #ccc', padding: 16, marginTop: 24, maxWidth: 400 }}>
        <h2>Private Chat</h2>
        <div style={{ marginBottom: 8 }}>
          <label>
            Select User to Chat With:{' '}
            <select
              value={recipientId}
              onChange={e => setRecipientId(e.target.value)}
              style={{ width: 220 }}
            >
              <option value="">-- Select a user --</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </label>
        </div>
        {roomId && (
          <>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Room: {roomId}</div>
            <div style={{ height: 200, overflowY: 'auto', background: '#f9f9f9', marginBottom: 8, padding: 8 }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ textAlign: msg.self ? 'right' : 'left', color: msg.self ? '#10b981' : '#333' }}>
                  <span style={{ fontSize: 12, color: '#aaa' }}>{msg.from === user?._id ? 'You' : 'Them'}: </span>
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1 }}
                disabled={!recipientId}
              />
              <button type="submit" disabled={!recipientId}>Send</button>
            </form>
          </>
        )}
      </div>

      {/* Tenant's Cart/Favorites */}
      {user && user.role === 'tenant' && (
        <div style={{ marginTop: 40 }}>
          <h2>Your Cart (Favorites)</h2>
          {favorites.length === 0 ? (
            <div style={{ color: '#888', marginTop: 12 }}>You have no properties in your cart yet.</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
              {favorites.map((property, idx) => {
                const imgSrc = property.images && property.images.length > 0 && property.images[0].url
                  ? property.images[0].url
                  : placeholderImg;
                return (
                  <div key={property._id || idx} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 260, maxWidth: 320, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    <button
                      style={{ marginTop: 8, padding: '6px 16px', borderRadius: 4, background: '#ef4444', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => handleRemoveFromCart(property._id)}
                    >
                      Remove from Cart
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard; 