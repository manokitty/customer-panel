const Inventory = require('../models/Inventory');

// Get all inventory items
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add or update an inventory item
const upsertInventoryItem = async (req, res) => {
  const { ingredientName, quantity, unit, threshold } = req.body;

  try {
    const inventoryItem = await Inventory.findOneAndUpdate(
      { ingredientName },
      { quantity, unit, threshold, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check for low inventory items
const checkLowInventory = async (req, res) => {
  try {
    const lowInventoryItems = await Inventory.find({ quantity: { $lt: '$threshold' } });
    res.json(lowInventoryItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reduce inventory (e.g., after an order)
const reduceInventory = async (req, res) => {
  const { ingredientName, quantityUsed } = req.body;

  try {
    const inventoryItem = await Inventory.findOne({ ingredientName });

    if (!inventoryItem) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    if (inventoryItem.quantity < quantityUsed) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    inventoryItem.quantity -= quantityUsed;
    inventoryItem.lastUpdated = new Date();
    await inventoryItem.save();

    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInventory,
  upsertInventoryItem,
  checkLowInventory,
  reduceInventory
};
