const express = require('express');
const {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { verifyToken } = require('../middleware/auth');
const { requireUser } = require('../middleware/role');

const router = express.Router();

// Public routes
router.get('/', getProperties);

// Private routes (specific path before dynamic :id path)
router.get('/mine', verifyToken, getMyProperties);
router.post('/', verifyToken, requireUser, createProperty);
router.put('/:id', verifyToken, requireUser, updateProperty);
router.delete('/:id', verifyToken, requireUser, deleteProperty);

// Public dynamic route (kept last so it doesn't shadow '/mine')
router.get('/:id', getPropertyById);

module.exports = router;
