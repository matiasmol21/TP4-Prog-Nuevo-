const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { crearOrden } = require("../controllers/orders.controller");
router.post("/", auth, crearOrden);
module.exports = router;
