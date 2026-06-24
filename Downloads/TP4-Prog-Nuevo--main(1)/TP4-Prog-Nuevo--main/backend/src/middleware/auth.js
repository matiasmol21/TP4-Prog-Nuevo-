const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: "No autorizado"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;

        next();

    } catch (err) {

        return res.status(401).json({
            mensaje: "Token inválido"
        });

    }

};