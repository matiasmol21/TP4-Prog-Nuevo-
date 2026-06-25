const session = require("express-session");
app.use(session({

    secret:process.env.SESSION_SECRET,

    resave:false,

    saveUninitialized:false,

    cookie:{
        secure:false
    }

}));
const express = require("express");
const cors = require("cors");

const productosRoutes = require("./routes/productos.routes");

const app = express();

app.use(cors());

app.use(express.json());


// RUTAS
app.use("/productos", productosRoutes);


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const authRoutes = require("./routes/auth.routes");

app.use(authRoutes);
