const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Category = require('../models/Category');

// GET /api/categories - get all categories for user
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ isDefault: -1, name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/categories - add custom category
router.post(
  '/',
  auth,
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const existing = await Category.findOne({ user: req.user.id, name: new RegExp(`^${name}$`, 'i') });
      if (existing) {
        return res.status(400).json({ message: 'Category already exists' });
      }

      const category = await Category.create({ user: req.user.id, name });
      res.status(201).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT /api/categories/:id - update category
router.put(
  '/:id',
  auth,
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      category.name = req.body.name;
      await category.save();
      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE /api/categories/:id - delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
