const express = require('express');
const {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getUsers,
  deleteUser,
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

const router = express.Router();

// All routes here require a logged-in admin
router.use(verifyToken, requireAdmin);

router.get('/properties/pending', getPendingProperties);
router.put('/properties/:id/approve', approveProperty);
router.put('/properties/:id/reject', rejectProperty);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
