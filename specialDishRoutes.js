const express = require('express');
const {
  createSpecialDish,
  getSpecialDishes,
  getSpecialDishReport
} = require('../controllers/specialDishController');

const router = express.Router();

// Create a special dish
router.post('/', createSpecialDish);

// Get all special dishes
router.get('/', getSpecialDishes);

// Generate a report for a specific special dish
router.get('/:id/report', getSpecialDishReport);

module.exports = router;
