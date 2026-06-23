const prisma = require("../prisma/client");

// GET TODOS
const obtenerProductos = async (req, res) => {
    try {

        const productos = await prisma.product.findMany({
            include: {
                category: true
            }
        });

        res.json(productos);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error al obtener productos"
        });

    }
};

// GET POR ID
const obtenerProducto = async (req, res) => {

    const { id } = req.params;

    try {

        const producto = await prisma.product.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                category: true
            }
        });

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error al buscar producto"
        });

    }

};

// POST
const crearProducto = async (req, res) => {

    const { nombre, precio, stock, categoryId } = req.body;

    try {

        const producto = await prisma.product.create({
            data: {
                nombre,
                precio: Number(precio),
                stock: Number(stock),
                categoryId: Number(categoryId)
            }
        });

        res.status(201).json(producto);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error al crear producto"
        });

    }

};

// PUT
const actualizarProducto = async (req, res) => {

    const { id } = req.params;

    try {

        const producto = await prisma.product.update({

            where: {
                id: Number(id)
            },

            data: {
                ...req.body,
                categoryId: req.body.categoryId
                    ? Number(req.body.categoryId)
                    : undefined
            }

        });

        res.json(producto);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error al actualizar producto"
        });

    }

};

// DELETE
const eliminarProducto = async (req, res) => {

    const { id } = req.params;

    try {

        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        });

        res.json({
            mensaje: "Producto eliminado"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error al eliminar producto"
        });

    }

};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};