const Reservation = require('../models/Reservation');
const Customer = require('../models/Customer'); // Import the Customer model

// Get all reservations
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('customer');
    console.log("Fetched Reservations:", reservations); 
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm a reservation
const confirmReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status: 'reserved' },
      { new: true }
    ).populate('customer');

    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update table assignment
const assignTableToReservation = async (req, res) => {
  const { id } = req.params;
  const { tableNumber } = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { tableNumber },
      { new: true }
    ).populate('customer');

    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track table occupancy
const getOccupancy = async (req, res) => {
  try {
    const occupancy = await Reservation.aggregate([
      { $match: { status: { $in: ['reserved', 'completed'] } } },
      { $group: { _id: '$tableNumber', count: { $sum: 1 } } }
    ]);
    res.json(occupancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Count reservations
const countReservations = async (req, res) => {
  try {
    // Count reservations
    const todayReservationsCount = await Reservation.countDocuments({});

    res.json({ todayReservations: todayReservationsCount });
  } catch (error) {
    res.status(500).json({ message: 'Error counting today\'s reservations', error });
  }
};



// Create a new reservation
const createReservation = async (req, res) => {
  const { email, name, tableNumber, date, time } = req.body;

  try {
    // Convert date string to Date object if needed
    const reservationDate = new Date(date); // This will create a proper Date object
    if (isNaN(reservationDate)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm (24-hour format)
    if (!timeRegex.test(time)) {
      return res.status(400).json({ error: "Invalid time format. Expected HH:mm." });
    }

    // Find or create the customer
    let customer = await Customer.findOne({ email });

    if (!customer) {
      customer = await Customer.create({ name, email });
    }

    // Create a new reservation
    const newReservation = new Reservation({
      customer: customer._id,
      tableNumber,
      date: reservationDate, // Store the Date object in the database
      time,
      status: 'reserved', // Default status
    });

    await newReservation.save();

    res.status(201).json(newReservation); // Send the newly created reservation as a response
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: error.message });
  }
};
;

// Get reservations for a specific email
const getReservationsByEmail = async (req, res) => {
  const { email } = req.query; // Extract email from query parameters

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const reservations = await Reservation.find({ "customer.email": email });
    if (reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found for this email" });
    }
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reservations", error: error.message });
  }
};

// Cancel a reservation by ID
const cancelReservation = async (req, res) => {
  const { id } = req.params; // Extract reservation ID from URL parameters

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await reservation.remove(); // Delete the reservation from the database
    res.status(200).json({ message: "Reservation canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel reservation", error: error.message });
  }
};

module.exports = {
  getReservations,
  confirmReservation,
  assignTableToReservation,
  getOccupancy,
  countReservations,
  createReservation,getReservationsByEmail, cancelReservation
};
