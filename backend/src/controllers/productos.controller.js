const prisma = require("../prisma/client");

/* =========================
   GET TODOS
========================= */
const obtenerProductos = async (req, res) => {
  try {
    const productos = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

/* =========================
   GET POR ID
========================= */
const obtenerProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al buscar producto" });
  }
};

/* =========================
   CREATE PRODUCTO
========================= */
const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, categoryId, imagen } = req.body;

    const catId = Number(categoryId);

    if (!nombre || isNaN(precio) || isNaN(stock)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    if (isNaN(catId)) {
      return res.status(400).json({ error: "categoryId inválido" });
    }

    const producto = await prisma.product.create({
      data: {
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        categoryId: catId,
        imagen,
      },
    });

    res.status(201).json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

/* =========================
   UPDATE
========================= */
const actualizarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        nombre: req.body.nombre,
        precio: Number(req.body.precio),
        stock: Number(req.body.stock),
        imagen: req.body.imagen,
        ...(req.body.categoryId ? { categoryId: Number(req.body.categoryId) } : {})
      }
    });

    res.json(producto);

  } catch (error) {
    console.log("ERROR ACTUALIZAR:", error);
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   DELETE
========================= */
const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

const venderProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const nuevoStock = producto.stock - 1;

    if (nuevoStock <= 0) {
      await prisma.product.delete({
        where: { id: Number(id) }
      });

      return res.json({ mensaje: "Producto eliminado por stock 0" });
    }

    const actualizado = await prisma.product.update({
      where: { id: Number(id) },
      data: { stock: nuevoStock }
    });

    res.json(actualizado);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al vender producto" });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  venderProducto
};