const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  ingredientName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  threshold: { type: Number, default: 10 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);
