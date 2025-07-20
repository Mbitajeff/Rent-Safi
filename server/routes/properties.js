const express = require('express');
const { body } = require('express-validator');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  searchProperties,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} = require('../controllers/properties');
const { protect, authorize, isLandlord } = require('../middleware/auth');
const { uploadMultiple } = require('../utils/upload');

const router = express.Router();

// Validation rules
const propertyValidation = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('location.area').notEmpty().withMessage('Area is required'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('propertyType').isIn(['apartment', 'house', 'studio', 'bedsitter', 'maisonette', 'penthouse']).withMessage('Invalid property type'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a positive number'),
  body('bathrooms').isInt({ min: 0 }).withMessage('Bathrooms must be a positive number'),
  body('size').isNumeric().withMessage('Size must be a number'),
  body('contactPhone').notEmpty().withMessage('Contact phone is required'),
  body('contactEmail').isEmail().withMessage('Please provide a valid contact email'),
  body('availableFrom').isISO8601().withMessage('Please provide a valid date'),
];

// Public routes
router.get('/', getProperties);
router.get('/search', searchProperties);
router.get('/:id', getProperty);

// Protected routes
router.use(protect);

// Landlord only routes
router.post('/', isLandlord, propertyValidation, createProperty);
router.put('/:id', isLandlord, propertyValidation, updateProperty);
router.delete('/:id', isLandlord, deleteProperty);
router.put('/:id/images', isLandlord, uploadMultiple, uploadPropertyImages);

// Favorites (cart) routes
router.post('/:id/favorite', protect, addToFavorites);
router.delete('/:id/favorite', protect, removeFromFavorites);
router.get('/favorites', protect, getFavorites);

module.exports = router; 