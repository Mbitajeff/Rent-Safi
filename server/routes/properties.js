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
const { uploadSingle, uploadMultiple } = require('../utils/upload');

const router = express.Router();

// Validation rules
const propertyValidation = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').optional(),
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

// --- PUBLIC ROUTES (must come first) ---
router.get('/search', searchProperties);
router.get('/', getProperties);
router.get('/:id', getProperty);

// --- PROTECTED ROUTES ---
router.use(protect);

// Favorites (cart) routes - must come before any dynamic :id routes
router.get('/favorites', getFavorites);
router.post('/:id/favorite', addToFavorites);
router.delete('/:id/favorite', removeFromFavorites);

// Landlord only routes
router.post('/', isLandlord, uploadMultiple, propertyValidation, createProperty);
router.put('/:id', isLandlord, propertyValidation, updateProperty);
router.delete('/:id', isLandlord, deleteProperty);
router.put('/:id/images', isLandlord, uploadMultiple, uploadPropertyImages);

module.exports = router; 