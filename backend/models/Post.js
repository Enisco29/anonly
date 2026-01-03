const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry'],
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
}, { _id: false });

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  tag: {
    type: String,
    trim: true,
    default: 'general'
  },
  reactions: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
postSchema.index({ createdAt: -1 });
postSchema.index({ tag: 1 });

module.exports = mongoose.model('Post', postSchema);

