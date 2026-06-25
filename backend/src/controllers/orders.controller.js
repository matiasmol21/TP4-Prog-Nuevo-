const prisma = require("../prisma/client");

const crearOrden = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "No autenticado" });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "El carrito está vacío" });
    const productos = await prisma.product.findMany({ where: { id: { in: items.map(i => Number(i.productId)) } } });
    const mapa = new Map(productos.map(p => [p.id, p]));
    for (const item of items) {
      const prod = mapa.get(Number(item.productId));
      const cantidad = Number(item.cantidad);
      if (!prod) return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
      if (!cantidad || cantidad < 1) return res.status(400).json({ error: "Cantidad inválida" });
      if (prod.stock < cantidad) return res.status(400).json({ error: `Stock insuficiente para ${prod.nombre}` });
    }
    const order = await prisma.$transaction(async (tx) => {
      const nuevaOrden = await tx.order.create({ data: { userId } });
      for (const item of items) {
        const productId = Number(item.productId);
        const cantidad = Number(item.cantidad);
        await tx.orderitem.create({ data: { orderId: nuevaOrden.id, productId, cantidad } });
        await tx.product.update({ where: { id: productId }, data: { stock: { decrement: cantidad } } });
      }
      return tx.order.findUnique({ where: { id: nuevaOrden.id }, include: { orderitem: true } });
    });
    res.status(201).json({ ok: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la orden" });
  }
};
module.exports = { crearOrden };
