const prisma = require("../prisma/client");

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    res.json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener categorías"
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });

    if (!category) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada"
      });
    }

    res.json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener categoría"
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;

    const category = await prisma.category.create({
      data: {
        nombre
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear categoría"
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { nombre } = req.body;

    const category = await prisma.category.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        nombre
      }
    });

    res.json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar categoría"
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({
      where: {
        id: Number(req.params.id)
      }
    });

    res.json({
      mensaje: "Categoría eliminada"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar categoría"
    });
  }
};