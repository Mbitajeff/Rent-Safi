import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

const roleColors = {
  landlord: 'bg-blue-100 text-blue-700',
  tenant: 'bg-green-100 text-green-700',
};

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const userData = data.data || data;
        setUser(userData);
      });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-400 h-32 relative">
          <div className="absolute left-1/2 top-20 transform -translate-x-1/2">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-full border-4 border-white shadow"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center shadow">
                <FiUser className="text-gray-400 text-5xl" />
              </div>
            )}
          </div>
        </div>
        {/* Card Body */}
        <div className="pt-20 pb-8 px-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>{user.role}</span>
          <div className="w-full flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-2 text-gray-700">
              <FiMail className="text-primary-500" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <FiPhone className="text-primary-500" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 