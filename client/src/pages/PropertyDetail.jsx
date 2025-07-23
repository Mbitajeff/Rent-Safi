import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data.data || data.property);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Property not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{property.title}</h1>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
          <img src={property.imageUrl || property.images?.[0]?.url || '/placeholder-property.jpg'} alt={property.title} className="w-full h-64 object-cover rounded" />
          <div className="text-lg font-semibold">Price: KES {property.price}</div>
          <div>City: {property.city}</div>
          <div>Area: {property.area}</div>
          <div>Description: {property.description}</div>
        </div>
      </div>
    </div>
  );
} 