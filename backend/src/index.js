const express = require("express");
const cors = require("cors");
const session = require("express-session");

const productosRoutes = require("./routes/productos.routes");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const usersRoutes = require("./routes/users.routes");
const ordersRoutes = require("./routes/orders.routes");


const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

  
app.use(
  session({
    secret: "mi_secreto_tp",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true solo en HTTPS
      maxAge: 1000 * 60 * 60, // 1 hora
    },
  })
);

// RUTAS
app.use("/productos", productosRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});