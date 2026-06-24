
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

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

        req.session.usuario = user.id;

        res.json({
            ok: true,
            usuario: user.usuario
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });

    }
};