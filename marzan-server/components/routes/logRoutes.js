const express = require("express");
const { getLogs } = require("../controllers/logController");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const router = express.Router();

router.get("/", authentication, authorization("Admin"), getLogs);

module.exports = router;
