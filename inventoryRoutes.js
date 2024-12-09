const express = require('express');
const {
  getInventory,
  upsertInventoryItem,
  checkLowInventory,
  reduceInventory
} = require('../controllers/inventoryController');

const router = express.Router();

// Get all inventory items
router.get('/', getInventory);

// Add or update an inventory item
router.post('/', upsertInventoryItem);

// Check for low inventory items
router.get('/low', checkLowInventory);

// Reduce inventory for an item
router.patch('/reduce', reduceInventory);

module.exports = router;
