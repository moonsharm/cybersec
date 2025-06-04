const express = require("express");
const { processFile } = require("../controllers/metaController");

const router = express.Router();

router.post("/", processFile);

module.exports = router;
