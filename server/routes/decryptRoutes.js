const express = require("express");
const { decrypt } = require("../controllers/decryptController");

const router = express.Router();

router.post("/", decrypt);

module.exports = router;
