const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['chef', 'waiter', 'kitchen staff'], required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String },
  salary: {type:Number},
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  imgPath: {type: String},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);
