const Staff = require('../models/Staff')

//Get all staff members

const getAllStaffMembers = async (req,res) => {
  try{
    const staffMembers = await Staff.find({});
    res.status(201).json({message:"Staff retrieved successfully", staffMembers})
  } catch (err){
    res.status(500).json({message:'Error retrieving staff', err})
  }
}

// Add Staff
const addStaff = async (req, res) => {
  const { name, role, email, contactNumber, salary, imgPath } = req.body;

  try {
    const staff = new Staff({ name, role, email, contactNumber, salary, imgPath });
    await staff.save();
    res.status(201).json({ message: 'Staff added successfully', staff });
  } catch (error) {
    res.status(500).json({ message: 'Error adding staff', error });
  }
};

// Update Staff
const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, role, email, contactNumber, salary, imgPath } = req.body;

  try {
    const staff = await Staff.findByIdAndUpdate(id, { name, role, email, contactNumber, salary, imgPath }, { new: true });
    res.json({ message: 'Staff updated successfully', staff });
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff', error });
  }
};

// Delete Staff
const deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    await Staff.findByIdAndDelete(id);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff', error });
  }
};

module.exports = { 
  addStaff,
  updateStaff, 
  deleteStaff,
  getAllStaffMembers };
