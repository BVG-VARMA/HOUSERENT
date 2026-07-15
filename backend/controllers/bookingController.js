const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @route   POST /api/bookings
// @desc    Create a booking request for a property
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { propertyId, moveInDate, message } = req.body;

    if (!propertyId || !moveInDate) {
      return res.status(400).json({ success: false, message: 'propertyId and moveInDate are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.status !== 'approved' || !property.isAvailable) {
      return res.status(400).json({ success: false, message: 'Property is not currently available for booking' });
    }

    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book your own property' });
    }

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      moveInDate,
      message,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/bookings/mine
// @desc    Bookings made by the logged-in user
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate({
        path: 'property',
        select: 'title location price images owner',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private (tenant who made it, or admin)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.tenant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };
