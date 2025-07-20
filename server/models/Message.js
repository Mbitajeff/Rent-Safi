const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      maxlength: [100, 'Subject cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide message content'],
      maxlength: [1000, 'Message cannot be more than 1000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    // Message type for filtering
    type: {
      type: String,
      enum: ['inquiry', 'response', 'general'],
      default: 'inquiry',
    },
    // For scheduling viewings
    viewingRequest: {
      requestedDate: Date,
      requestedTime: String,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending',
      },
      notes: String,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, isRead: 1 });

module.exports = mongoose.model('Message', MessageSchema); 