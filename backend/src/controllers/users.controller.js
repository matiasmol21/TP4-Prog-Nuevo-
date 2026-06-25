
const prisma = require("../prisma/client");

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
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
};