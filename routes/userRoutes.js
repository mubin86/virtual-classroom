const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

//**this route will be placed in the teacher route */
router.post('/login', authController.login);

module.exports = router;