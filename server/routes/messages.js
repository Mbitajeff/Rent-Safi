const express = require('express');
const { createMessage } = require('../controllers/messages');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create a new message (viewing request)
router.post('/', protect, createMessage);

module.exports = router; 