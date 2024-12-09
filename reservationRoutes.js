const express = require('express');
const {
  getReservations,
  confirmReservation,
  assignTableToReservation,
  getOccupancy,
  countReservations,createReservation,getReservationsByEmail, cancelReservation
} = require('../controllers/reservationController');

const router = express.Router();

// Get all reservations
router.get('/', getReservations);

// Confirm a reservation
router.patch('/:id/confirm', confirmReservation);

// Assign a table to a reservation
router.patch('/:id/assign-table', assignTableToReservation);

// Get table occupancy
router.get('/occupancy', getOccupancy);

router.get('/count-reservations', countReservations);

// Create a new reservation
router.post('/', createReservation); // Add the POST route
router.get("/", getReservationsByEmail);
// Cancel a reservation by ID
router.delete("/:id", cancelReservation);

module.exports = router;
