
const express = require("express");
const router = express.Router();


const auth = require("../middleware/auth");
const { onlySuperAdmin } = require("../middleware/roles");

const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require("../controllers/users.controller");

router.post("/", auth, onlySuperAdmin, crearUsuario);
router.get("/", auth, onlySuperAdmin, obtenerUsuarios);
router.put("/:id", auth, onlySuperAdmin, actualizarUsuario);
router.delete("/:id", auth, onlySuperAdmin, eliminarUsuario);

module.exports = router;