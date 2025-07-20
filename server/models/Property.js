const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a rental price'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      area: {
        type: String,
        required: [true, 'Please provide the area'],
      },
      city: {
        type: String,
        required: [true, 'Please provide the city'],
        default: 'Nairobi',
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
      address: {
        type: String,
        required: [true, 'Please provide the address'],
      },
    },
    propertyType: {
      type: String,
      required: [true, 'Please provide property type'],
      enum: ['apartment', 'house', 'studio', 'bedsitter', 'maisonette', 'penthouse'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please provide number of bedrooms'],
      min: [0, 'Bedrooms cannot be negative'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please provide number of bathrooms'],
      min: [0, 'Bathrooms cannot be negative'],
    },
    size: {
      type: Number, // in square feet
      required: [true, 'Please provide property size'],
    },
    amenities: [{
      type: String,
      enum: [
        'parking', 'security', 'water', 'electricity', 'internet', 'gym',
        'pool', 'garden', 'balcony', 'air-conditioning', 'furnished',
        'kitchen', 'laundry', 'elevator', 'backup-power'
      ],
    }],
    images: [{
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    }],
    virtualTour: {
      type: String, // YouTube URL
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    // Lease terms
    leaseTerm: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly',
    },
    deposit: {
      type: Number,
      default: 0,
    },
    // Contact information
    contactPhone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    // Availability
    availableFrom: {
      type: Date,
      required: true,
    },
    // Reports
    reports: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: {
        type: String,
        required: true,
      },
      description: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    // Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create slug from title before saving
PropertySchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
    
  next();
});

// Virtual for property URL
PropertySchema.virtual('url').get(function () {
  return `/properties/${this.slug}`;
});

// Method to increment view count
PropertySchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to add to favorites
PropertySchema.methods.addToFavorites = function () {
  this.favoriteCount += 1;
  return this.save();
};

// Method to remove from favorites
PropertySchema.methods.removeFromFavorites = function () {
  this.favoriteCount = Math.max(0, this.favoriteCount - 1);
  return this.save();
};

// Method to add a report
PropertySchema.methods.addReport = function (userId, reason, description) {
  this.reports.push({ user: userId, reason, description });
  return this.save();
};

module.exports = mongoose.model('Property', PropertySchema); 