import { Link } from 'react-router-dom'
import { FiMapPin, FiHome, FiDroplet, FiSquare } from 'react-icons/fi'

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="card card-hover overflow-hidden">
      <div className="relative">
        <img
          src={property.images?.[0]?.url || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {property.propertyType}
          </span>
        </div>
        {property.isFeatured && (
          <div className="absolute top-4 left-4">
            <span className="bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <FiMapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location.area}, {property.location.city}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FiHome className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <FiDroplet className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <FiSquare className="w-4 h-4 mr-1" />
              <span>{property.size} sq ft</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {property.amenities?.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                {amenity}
              </span>
            ))}
            {property.amenities?.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="btn btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard 