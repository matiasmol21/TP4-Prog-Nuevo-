
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {

        const { usuario, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                usuario
            }
        });

        if (!user) {
            return res.status(401).json({
                mensaje: "Usuario incorrecto"
            });
        }

        const coincide = await bcrypt.compare(password, user.password);

        if (!coincide) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }



const token = jwt.sign(
    {
        id: user.id,
        usuario: user.usuario
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

res.json({
    ok: true,
    token,
    usuario: user.usuario
});

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });

    }
};