const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

    const hash = await bcrypt.hash("1234",10);

    await prisma.usuario.create({

        data:{
            usuario:"admin",
            password:hash
        }

    });

    console.log("Administrador creado");

}

main()
.finally(()=>prisma.$disconnect());