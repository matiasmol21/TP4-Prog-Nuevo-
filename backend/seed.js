const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

    // 🔐 hash de contraseña
    const hash = await bcrypt.hash("1234", 10);

    // 👤 ADMIN (sin romper si ya existe)
    const admin = await prisma.user.upsert({
        where: {
            usuario: "admin"
        },
        update: {},
        create: {
            usuario: "admin",
            password: hash
        }
    });

    // 📦 CATEGORÍAS (también con upsert para evitar errores)
    const mouse = await prisma.category.upsert({
        where: { nombre: "Mouse" },
        update: {},
        create: { nombre: "Mouse" }
    });

    const teclado = await prisma.category.upsert({
        where: { nombre: "Teclado" },
        update: {},
        create: { nombre: "Teclado" }
    });

    const auriculares = await prisma.category.upsert({
        where: { nombre: "Auriculares" },
        update: {},
        create: { nombre: "Auriculares" }
    });

    // 🛒 PRODUCTOS
    await prisma.product.createMany({
        data: [
            {
                nombre: "Mouse Redragon",
                precio: 25000,
                stock: 10,
                imagen: "https://redragon.es/content/uploads/2021/04/GRIFFIN-B-1.png",
                categoryId: mouse.id
            },
            {
                nombre: "Teclado HyperX",
                precio: 45000,
                stock: 5,
                imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_934535-MLA32722027938_102019-F.webp",
                categoryId: teclado.id
            },
            {
                nombre: "Auriculares Logitech",
                precio: 38000,
                stock: 8,
                imagen: "https://resource.logitechg.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/gaming/en/products/g733/gallery/g733-black-gallery-1.png",
                categoryId: auriculares.id
            }
        ]
    });

    console.log("✅ Datos cargados correctamente");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });