const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const SECRET = "mi_secreto_super_seguro";

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const existe = await prisma.user.findUnique({
      where: { usuario }
    });

    if (existe) {
      return res.status(400).json({ mensaje: "Usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        usuario,
        password: hash,
        rol: "cliente"
      }
    });

    res.json({
      ok: true,
      user: {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ mensaje: "Error en register" });
  }
};

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { usuario }
    });

    if (!user) {
      return res.status(401).json({ mensaje: "Usuario incorrecto" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol
      },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      id: user.id,
      usuario: user.usuario,
      rol: user.rol
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ mensaje: "Error login" });
  }
};