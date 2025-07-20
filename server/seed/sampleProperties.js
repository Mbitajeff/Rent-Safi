const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Property = require('../models/Property');
const User = require('../models/User');

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create landlord and tenant users with hashed passwords
    const landlordPassword = await bcrypt.hash('landlord123', 10);
    const tenantPassword = await bcrypt.hash('tenant123', 10);

    // Remove existing users and properties
    await User.deleteMany({});
    await Property.deleteMany({});

    const landlord = await User.create({
      name: 'Sample Landlord',
      email: 'landlord@example.com',
      password: landlordPassword,
      phone: '+254700000001',
      role: 'landlord',
      isVerified: true,
    });
    const tenant = await User.create({
      name: 'Sample Tenant',
      email: 'tenant@example.com',
      password: tenantPassword,
      phone: '+254700000002',
      role: 'tenant',
      isVerified: true,
    });

    const sampleProperties = [
      {
        title: 'Modern 2BR Apartment in Kilimani',
        description: 'Spacious and modern 2 bedroom apartment in the heart of Kilimani, Nairobi. Close to Yaya Centre and public transport.',
        price: 75000,
        location: {
          area: 'Kilimani',
          city: 'Nairobi',
          coordinates: { lat: -1.2921, lng: 36.7831 },
          address: 'Kilimani Road, Nairobi',
        },
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        size: 1200,
        amenities: ['parking', 'security', 'water', 'internet', 'balcony'],
        images: [],
        virtualTour: '',
        isAvailable: true,
        isVerified: true,
        isFeatured: true,
        leaseTerm: 'monthly',
        deposit: 75000,
        contactPhone: '+254712345678',
        contactEmail: 'landlord1@example.com',
        availableFrom: new Date(),
        landlord: landlord._id,
      },
      {
        title: 'Cozy Bedsitter in Westlands',
        description: 'Affordable bedsitter ideal for students or young professionals. Secure and close to Sarit Centre.',
        price: 20000,
        location: {
          area: 'Westlands',
          city: 'Nairobi',
          coordinates: { lat: -1.2647, lng: 36.8008 },
          address: 'Westlands Road, Nairobi',
        },
        propertyType: 'bedsitter',
        bedrooms: 0,
        bathrooms: 1,
        size: 350,
        amenities: ['water', 'security'],
        images: [],
        virtualTour: '',
        isAvailable: true,
        isVerified: true,
        isFeatured: false,
        leaseTerm: 'monthly',
        deposit: 20000,
        contactPhone: '+254798765432',
        contactEmail: 'landlord2@example.com',
        availableFrom: new Date(),
        landlord: landlord._id,
      },
      {
        title: 'Luxury Maisonette in Lavington',
        description: 'Elegant 4 bedroom maisonette with garden and pool. Perfect for families seeking comfort and security.',
        price: 250000,
        location: {
          area: 'Lavington',
          city: 'Nairobi',
          coordinates: { lat: -1.2927, lng: 36.7762 },
          address: 'Lavington Green, Nairobi',
        },
        propertyType: 'maisonette',
        bedrooms: 4,
        bathrooms: 3,
        size: 3000,
        amenities: ['parking', 'security', 'pool', 'garden', 'balcony', 'kitchen'],
        images: [],
        virtualTour: '',
        isAvailable: true,
        isVerified: true,
        isFeatured: true,
        leaseTerm: 'yearly',
        deposit: 250000,
        contactPhone: '+254700112233',
        contactEmail: 'landlord3@example.com',
        availableFrom: new Date(),
        landlord: landlord._id,
      },
      {
        title: 'Studio Apartment in South B',
        description: 'Neat studio apartment, close to CBD and public transport. Secure and affordable.',
        price: 30000,
        location: {
          area: 'South B',
          city: 'Nairobi',
          coordinates: { lat: -1.3123, lng: 36.8500 },
          address: 'South B, Nairobi',
        },
        propertyType: 'studio',
        bedrooms: 0,
        bathrooms: 1,
        size: 400,
        amenities: ['water', 'security', 'internet'],
        images: [],
        virtualTour: '',
        isAvailable: true,
        isVerified: true,
        isFeatured: false,
        leaseTerm: 'monthly',
        deposit: 30000,
        contactPhone: '+254701234567',
        contactEmail: 'landlord4@example.com',
        availableFrom: new Date(),
        landlord: landlord._id,
      },
    ];

    await Property.insertMany(sampleProperties);
    console.log('Sample users and properties inserted!');
    console.log('Landlord login: landlord@example.com / landlord123');
    console.log('Tenant login: tenant@example.com / tenant123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 