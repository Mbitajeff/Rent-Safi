import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Profile
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            User Profile
          </h2>
          <p className="text-gray-600 mb-4">
            Profile management will be implemented here.
          </p>
          <p className="text-sm text-gray-500">
            Current user: {user?.name} ({user?.email})
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile 