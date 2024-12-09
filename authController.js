const Admin = require('../models/admin');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Unified Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email });
    let role = 'admin';
    if (!user) {
      user = await Staff.findOne({ email });
      role = user ? 'staff' : null;
    }

    if (!user) {
      user = await Customer.findOne({ email });
      role = user ? 'customer' : null;
    }
    const bool = await bcrypt.compare(password, user.password);
    if (user && bool ) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
        token: generateToken(user._id, role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// Register Admin Function
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ role: 'superadmin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'An admin already exists. Registration is not allowed.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: 'superadmin'
    });

    // Save admin to database
    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully', admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = { loginUser, registerAdmin };
