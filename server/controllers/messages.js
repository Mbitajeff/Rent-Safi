const Message = require('../models/Message');
const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Create a new message (including viewing requests)
// @route   POST /api/messages
// @access  Private
exports.createMessage = async (req, res, next) => {
  try {
    const { receiver, property, subject, content, type, viewingRequest } = req.body;
    if (!receiver || !property || !subject || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    // Optionally, validate property and receiver exist
    const prop = await Property.findById(property);
    if (!prop) return res.status(404).json({ success: false, error: 'Property not found' });
    const user = await User.findById(receiver);
    if (!user) return res.status(404).json({ success: false, error: 'Receiver not found' });

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      property,
      subject,
      content,
      type: type || 'inquiry',
      viewingRequest,
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages between current user and another user
// @route   GET /api/messages?user=USER_ID
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const otherUserId = req.query.user;
    if (!otherUserId) return res.status(400).json({ success: false, error: 'Missing user id' });
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ]
    }).sort('createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
}; 