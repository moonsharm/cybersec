const express = require("express");
const { encrypt } = require("../controllers/encryptController");

const router = express.Router();

router.post("/", encrypt);

module.exports = router;
