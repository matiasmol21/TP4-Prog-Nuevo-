
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function crearAdmin() {
  try {
    const usuario = "admin";
    const passwordPlano = "admin123";

    // hash de la contraseña
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    // crear o actualizar admin (evita errores de duplicados)
    const admin = await prisma.user.upsert({
      where: { usuario },
      update: {
        password: passwordHash,
        rol: "admin"
      },
      create: {
        usuario,
        password: passwordHash,
        rol: "admin"
      }
    });

    console.log("✔ Admin creado o actualizado:", admin);

  } catch (error) {
    console.log("❌ Error creando admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

crearAdmin();