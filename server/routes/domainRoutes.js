const express = require('express');
const { checkDomain } = require('../controllers/domainController');

const router = express.Router();

router.get('/', checkDomain);

module.exports = router;
