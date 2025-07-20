[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19877262&assignment_repo_type=AssignmentRepo)
# 🏠 RentSafi - Housing Rental Platform

RentSafi is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed to connect landlords and tenants in Kenya—specifically Nairobi—without using brokers or agents. The platform eliminates viewership fees and creates a fair, transparent, and efficient house-hunting experience.

## 🚀 Features

### For Landlords
- **User Registration & Authentication**: Secure JWT-based authentication
- **Property Management**: Create, edit, and delete rental listings
- **Image Upload**: Upload multiple property images with Cloudinary integration
- **Virtual Tours**: Add YouTube walkthrough videos
- **Inquiry Management**: View and respond to tenant inquiries
- **Dashboard**: Manage all properties and inquiries in one place

### For Tenants
- **Property Discovery**: Browse and search listings with advanced filters
- **Location-based Search**: Filter by area, price, and property type
- **Virtual Tours**: View images and YouTube walkthroughs
- **Direct Messaging**: Contact landlords directly without intermediaries
- **Favorites**: Save properties to a personal favorites list
- **Reporting**: Report suspicious or fake listings

### Technical Features
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **JWT Authentication**: Secure user authentication and authorization
- **MongoDB Atlas**: Cloud database for scalability
- **Cloudinary Integration**: Image upload and management
- **Real-time Updates**: Optimistic UI updates for better UX
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image upload service
- **express-validator** - Input validation
- **multer** - File upload handling

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## 📁 Project Structure

```
rentsafi/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Client dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── index.html          # HTML template
├── server/                 # Express.js backend
│   ├── config/             # Configuration files
│   │   ├── database.js     # MongoDB connection
│   │   └── cloudinary.js   # Cloudinary configuration
│   ├── controllers/        # Route controllers
│   │   ├── auth.js         # Authentication controller
│   │   └── properties.js   # Property controller
│   ├── models/             # Mongoose models
│   │   ├── User.js         # User model
│   │   ├── Property.js     # Property model
│   │   └── Message.js      # Message model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   └── properties.js   # Property routes
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # Authentication middleware
│   │   └── error.js        # Error handling middleware
│   ├── utils/              # Utility functions
│   │   ├── errorResponse.js # Error response class
│   │   └── upload.js       # File upload utilities
│   ├── server.js           # Main server file
│   ├── package.json        # Server dependencies
│   └── env.example         # Environment variables example
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rentsafi
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the server directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/rentsafi
   # For production: mongodb+srv://username:password@cluster.mongodb.net/rentsafi

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the development servers**

   Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

   Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+254700000000",
  "role": "tenant"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication)

### Property Endpoints

#### GET /api/properties
Get all properties with optional filters
```
GET /api/properties?page=1&limit=10&location=nairobi&minPrice=10000&maxPrice=50000
```

#### GET /api/properties/:id
Get a specific property by ID

#### POST /api/properties
Create a new property (landlords only)
```json
{
  "title": "Modern 2-Bedroom Apartment",
  "description": "Beautiful apartment in Westlands",
  "price": 45000,
  "location": {
    "area": "Westlands",
    "city": "Nairobi",
    "address": "123 Westlands Road"
  },
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 1,
  "size": 1200,
  "amenities": ["parking", "security", "water"],
  "contactPhone": "+254700000000",
  "contactEmail": "landlord@example.com",
  "availableFrom": "2024-01-01"
}
```

#### PUT /api/properties/:id
Update a property (landlord only)

#### DELETE /api/properties/:id
Delete a property (landlord only)

#### GET /api/properties/search
Search properties
```
GET /api/properties/search?q=westlands&location=nairobi&minPrice=10000
```

## 🎨 UI Components

The application uses a component-based architecture with reusable UI components:

- **Layout**: Main layout with navigation and footer
- **Navbar**: Responsive navigation with user menu
- **PropertyCard**: Display property information
- **PropertyForm**: Create/edit property forms
- **SearchFilters**: Advanced search functionality
- **ImageGallery**: Property image display
- **MessageForm**: Contact landlord form

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for data validation
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Vercel or Netlify

### Backend (Render/Railway)
1. Set environment variables
2. Deploy to Render or Railway
3. Update frontend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: Jeff Mbita
- **Project**: RentSafi - MERN Final project

## 📞 Support

For support, email info@rentsafi.co.ke or create an issue in the repository.

---

**RentSafi** - Making house hunting in Kenya transparent and efficient! 🏠✨ 