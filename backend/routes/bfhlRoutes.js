// routes/bfhlRoutes.js

const express = require("express");
const router = express.Router();

const { handleBFHL } = require("../controllers/bfhlController");

router.post("/", handleBFHL);

module.exports = router;