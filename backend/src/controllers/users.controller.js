
const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");

const crearUsuario = async (req, res) => {
  try {
    const { usuario, password, rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.user.create({
      data: {
        usuario,
        password: hashedPassword,
        rol
      }
    });

    res.status(201).json({
      id: nuevoUsuario.id,
      usuario: nuevoUsuario.usuario,
      rol: nuevoUsuario.rol
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

const obtenerUsuarios = async (req, res) => {
  const usuarios = await prisma.user.findMany({
    select: {
      id: true,
      usuario: true,
      rol: true
    }
  });

  res.json(usuarios);
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  const usuario = await prisma.user.update({
    where: {
      id: Number(id)
    },
    data: {
      rol
    }
  });

  res.json(usuario);
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: {
      id: Number(id)
    }
  });

  res.json({
    mensaje: "Usuario eliminado"
  });
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
};