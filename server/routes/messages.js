const express = require('express');
const { createMessage, getMessages } = require('../controllers/messages');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create a new message (viewing request)
router.post('/', protect, createMessage);
// Get all messages between current user and another user
router.get('/', protect, getMessages);

module.exports = router; 