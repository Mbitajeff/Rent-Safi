const Property = require('../models/Property');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const { validationResult } = require('express-validator');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Property.find(JSON.parse(queryStr)).populate('landlord', 'name email phone');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const properties = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlord', 'name email phone');

    if (!property) {
      return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Increment view count
    await property.incrementViewCount();

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Landlords only)
exports.createProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Add landlord to req.body
    req.body.landlord = req.user.id;

    const property = await Property.create(req.body);

    // Add property to landlord's properties array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { properties: property._id },
    });

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Landlord only)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is property owner
    if (property.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this property`, 401));
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Landlord only)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is property owner
    if (property.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this property`, 401));
    }

    await property.remove();

    // Remove property from landlord's properties array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { properties: property._id },
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload property images
// @route   PUT /api/properties/:id/images
// @access  Private (Landlord only)
exports.uploadPropertyImages = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is property owner
    if (property.landlord.toString() !== req.user.id) {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to upload images for this property`, 401));
    }

    if (!req.file) {
      return next(new ErrorResponse('Please upload an image', 400));
    }

    // Add image to property
    property.images.push({
      url: req.file.path,
      publicId: req.file.filename,
    });

    await property.save();

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
exports.searchProperties = async (req, res, next) => {
  try {
    const { q, location, minPrice, maxPrice, propertyType, bedrooms } = req.query;

    let query = { isAvailable: true };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Location filter
    if (location) {
      query['location.area'] = { $regex: location, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Property type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Bedrooms
    if (bedrooms) {
      query.bedrooms = { $gte: parseInt(bedrooms) };
    }

    const properties = await Property.find(query)
      .populate('landlord', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add property to user's favorites (cart)
// @route   POST /api/properties/:id/favorite
// @access  Private (Tenant only)
exports.addToFavorites = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.favorites.includes(propertyId)) {
      return res.status(400).json({ success: false, error: 'Property already in favorites' });
    }
    user.favorites.push(propertyId);
    await user.save();
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from user's favorites (cart)
// @route   DELETE /api/properties/:id/favorite
// @access  Private (Tenant only)
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    user.favorites = user.favorites.filter(fav => fav.toString() !== propertyId);
    await user.save();
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all favorite properties for current user
// @route   GET /api/properties/favorites
// @access  Private (Tenant only)
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: { path: 'landlord', select: 'name email' }
    });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
}; 