const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function run() {
  const passwordHash = await bcrypt.hash("super123", 10);

  await prisma.user.upsert({
    where: { usuario: "superadmin" },
    update: {},
    create: {
      usuario: "superadmin",
      password: passwordHash,
      rol: "superadmin"
    }
  });

  console.log("Superadmin listo");
}

console.log("DB URL:", process.env.DATABASE_URL);
run();