const express = require('express');
const { getClientIPInfo } = require('../controllers/anonimityController');

const router = express.Router();
router.get('/', getClientIPInfo);
module.exports = router;
