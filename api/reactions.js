const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('./models/Post');
const rateLimit = require('express-rate-limit');

const reactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 reactions per minute
  message: 'Too many reactions, please try again later.'
});

// POST /api/react - Add anonymous reaction to a post
router.post(
  '/',
  reactionLimiter,
  [
    body('postId').notEmpty().withMessage('Post ID is required'),
    body('type')
      .isIn(['like', 'love', 'laugh', 'wow', 'sad', 'angry'])
      .withMessage('Invalid reaction type')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { postId, type } = req.body;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Increment reaction count
      const currentCount = post.reactions.get(type) || 0;
      post.reactions.set(type, currentCount + 1);
      await post.save();

      res.json({ 
        postId, 
        type, 
        count: post.reactions.get(type),
        reactions: Object.fromEntries(post.reactions)
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;

