const express = require('express');
const { addStaff, updateStaff, deleteStaff, getAllStaffMembers } = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllStaffMembers)
router.post('/add',  addStaff);
router.put('/update/:id', updateStaff);
router.delete('/delete/:id', deleteStaff);

module.exports = router;
