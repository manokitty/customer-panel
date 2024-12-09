const SpecialDish = require('../models/SpecialDish');

// Create a special dish
const createSpecialDish = async (req, res) => {
  const { name, description, price, availabilityDate } = req.body;

  try {
    const specialDish = new SpecialDish({
      name,
      description,
      price,
      availabilityDate
    });

    await specialDish.save();
    res.status(201).json(specialDish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all special dishes
const getSpecialDishes = async (req, res) => {
  try {
    const specialDishes = await SpecialDish.find();
    res.json(specialDishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate report for a specific special dish
const getSpecialDishReport = async (req, res) => {
  const { id } = req.params;

  try {
    const specialDish = await SpecialDish.findById(id);

    if (!specialDish) {
      return res.status(404).json({ error: 'Special dish not found' });
    }

    // Generate a simple report
    const report = {
      name: specialDish.name,
      description: specialDish.description,
      price: specialDish.price,
      availabilityDate: specialDish.availabilityDate,
      createdAt: specialDish.createdAt,
      createdDaysAgo: Math.ceil((new Date() - new Date(specialDish.createdAt)) / (1000 * 60 * 60 * 24))
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSpecialDish,
  getSpecialDishes,
  getSpecialDishReport
};
