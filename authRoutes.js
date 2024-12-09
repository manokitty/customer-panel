const express = require('express');
const { loginUser , registerAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register-admin', registerAdmin); // Admin registration route
module.exports = router;
