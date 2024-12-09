//this is the schema for admin
const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin'], default: 'superadmin' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Admin', adminSchema);