const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require("../controllers/productos.controller");


// GET TODOS
router.get("/", obtenerProductos);

// GET POR ID
router.get("/:id", obtenerProducto);

// POST
router.post("/", auth, crearProducto);

// PUT
router.put("/:id", auth, actualizarProducto);

// DELETE
router.delete("/:id", auth, eliminarProducto);


module.exports = router;