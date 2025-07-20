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