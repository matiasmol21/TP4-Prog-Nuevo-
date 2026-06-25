const jwt = require("jsonwebtoken");

const SECRET = "mi_secreto_super_seguro";

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ mensaje: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const data = jwt.verify(token, SECRET);
    req.user = data; // 👈 acá queda el rol
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}

module.exports = auth;