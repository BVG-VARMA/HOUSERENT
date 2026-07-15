const Property = require('../models/Property');

// @route   GET /api/properties
// @desc    List approved properties, supports ?location=&price=&type=
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const { location, price, type, minPrice, maxPrice } = req.query;

    const filter = { status: 'approved', isAvailable: true };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (price) {
      filter.price = { $lte: Number(price) };
    } else if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/properties/mine
// @desc    Properties created by the logged-in user
// @access  Private
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/properties/:id
// @desc    Get a single property by id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/properties
// @desc    Create a new listing (defaults to status: pending)
// @access  Private
const createProperty = async (req, res, next) => {
  try {
    const { title, description, type, price, location, address, bedrooms, bathrooms, images } = req.body;

    if (!title || !description || !type || !price || !location || !address) {
      return res.status(400).json({ success: false, message: 'Missing required property fields' });
    }

    const property = await Property.create({
      title,
      description,
      type,
      price,
      location,
      address,
      bedrooms,
      bathrooms,
      images,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/properties/:id
// @desc    Edit own listing
// @access  Private (owner only)
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const allowedFields = [
      'title',
      'description',
      'type',
      'price',
      'location',
      'address',
      'bedrooms',
      'bathrooms',
      'images',
      'isAvailable',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    // If a non-admin edits a listing, re-submit it for approval
    if (req.user.role !== 'admin') {
      property.status = 'pending';
    }

    await property.save();

    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/properties/:id
// @desc    Delete own listing
// @access  Private (owner or admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await property.deleteOne();

    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
