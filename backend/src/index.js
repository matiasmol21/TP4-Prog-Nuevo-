const express = require("express");
const cors = require("cors");
const session = require("express-session");

const productosRoutes = require("./routes/productos.routes");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    session({
        secret: "mi_secreto_tp",
        resave: false,
        saveUninitialized: false
    })
);

// RUTAS
app.use("/productos", productosRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});