const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Post = require('./models/Post');
const Tag = require('./models/Tag');
const authMiddleware = require('./middleware/auth');
const { postLimiter } = require('./middleware/rateLimiter');

// Sanitize HTML
const sanitizeHtml = (str) => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// POST /api/posts - Submit a new anonymous post
router.post(
  '/',
  postLimiter,
  [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ max: 500 })
      .withMessage('Content must be 500 characters or less'),
    body('tag')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Tag must be 50 characters or less')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content, tag = 'general' } = req.body;
      const sanitizedContent = sanitizeHtml(content);
      const sanitizedTag = tag.toLowerCase().trim();

      // Create or update tag count
      await Tag.findOneAndUpdate(
        { name: sanitizedTag },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );

      const post = new Post({
        content: sanitizedContent,
        tag: sanitizedTag
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// GET /api/posts - Fetch all posts with pagination and filtering
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('tag').optional().trim(),
    query('search').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const tag = req.query.tag?.toLowerCase().trim();
      const search = req.query.search?.trim();

      // Build query
      const query = {};
      if (tag) {
        query.tag = tag;
      }
      if (search) {
        query.content = { $regex: search, $options: 'i' };
      }

      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Post.countDocuments(query);

      res.json({
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// GET /api/posts/:id - Fetch a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/posts/:id - Admin-only endpoint to delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Decrement tag count
    await Tag.findOneAndUpdate(
      { name: post.tag },
      { $inc: { count: -1 } }
    );

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

