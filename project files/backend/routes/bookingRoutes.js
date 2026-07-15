const express = require('express');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');
const { requireUser } = require('../middleware/role');

const router = express.Router();

router.post('/', verifyToken, requireUser, createBooking);
router.get('/mine', verifyToken, requireUser, getMyBookings);
router.put('/:id/cancel', verifyToken, requireUser, cancelBooking);

module.exports = router;
