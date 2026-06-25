function onlyAdmin(req, res, next) {
  if (req.user.rol !== "admin" && req.user.rol !== "superadmin") {
    return res.status(403).json({ mensaje: "No autorizado" });
  }
  next();
}

function onlySuperAdmin(req, res, next) {
  if (req.user.rol !== "superadmin") {
    return res.status(403).json({ mensaje: "Solo superadmin" });
  }
  next();
}

module.exports = { onlyAdmin, onlySuperAdmin };