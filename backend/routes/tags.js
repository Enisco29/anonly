const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// GET /api/tags - Fetch available tags/categories
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find()
      .sort({ count: -1 })
      .select('name count')
      .lean();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

