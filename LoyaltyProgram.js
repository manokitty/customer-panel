const mongoose = require('mongoose');

const loyaltyProgramSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  points: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);
