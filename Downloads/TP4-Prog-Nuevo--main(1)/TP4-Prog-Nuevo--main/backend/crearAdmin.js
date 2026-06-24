const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("1234", 10);

  await prisma.user.upsert({
    where: {
      usuario: "admin",
    },
    update: {
      password: hash,
    },
    create: {
      usuario: "admin",
      password: hash,
    },
  });

  console.log("Administrador creado o actualizado");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });