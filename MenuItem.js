const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  dietaryOptions: [{ type: String }], // e.g., vegan, gluten-free
  isSpecial: { type: Boolean, default: false },
  status: { type: String, enum: ['available', 'out of stock'], default: 'available' },
  imgPath: {type: String},
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true } // e.g., grams, ml, pieces
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
