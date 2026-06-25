const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { onlyAdmin } = require("../middleware/roles");

const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  venderProducto
} = require("../controllers/productos.controller");

router.get("/", obtenerProductos);
router.get("/:id", obtenerProducto);

router.post("/", auth, onlyAdmin, crearProducto);
router.put("/:id", auth, onlyAdmin, actualizarProducto);
router.delete("/:id", auth, onlyAdmin, eliminarProducto);
router.put("/vender/:id", auth, onlyAdmin, venderProducto);


module.exports = router;