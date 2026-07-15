const Property = require('../models/Property');
const User = require('../models/User');

// @route   GET /api/admin/properties/pending
// @desc    List all pending listings
// @access  Private (admin only)
const getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/properties/:id/approve
// @desc    Approve a pending listing
// @access  Private (admin only)
const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.status = 'approved';
    await property.save();

    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/properties/:id/reject
// @desc    Reject a pending listing
// @access  Private (admin only)
const rejectProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.status = 'rejected';
    await property.save();

    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/users
// @desc    List all users
// @access  Private (admin only)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Admins cannot delete their own account here' });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getUsers,
  deleteUser,
};
