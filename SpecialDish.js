const mongoose = require('mongoose');

const specialDishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  availabilityDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpecialDish', specialDishSchema);
