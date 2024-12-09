const express = require('express');
const { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getMenuItems );
router.post('/add', addMenuItem);
router.put('/update/:id', updateMenuItem);
router.delete('/delete/:id', deleteMenuItem);

module.exports = router;
