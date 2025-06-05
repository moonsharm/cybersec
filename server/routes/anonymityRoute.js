const express = require('express');
const { getClientIPInfo } = require('../controllers/anonymityController');

const router = express.Router();
router.get('/', getClientIPInfo);
module.exports = router;
