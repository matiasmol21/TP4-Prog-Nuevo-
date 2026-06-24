const express = require("express");
const cors = require("cors");

const productosRoutes = require("./routes/productos.routes");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true,
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