# 🎮 PrograMATE - Proyecto Full Stack

PrograMATE es una aplicación web tipo tienda online de productos gamer (mouses, teclados, auriculares), desarrollada como proyecto académico. Permite gestionar productos con operaciones CRUD, autenticación básica y conexión a base de datos MySQL usando Prisma.

---

## 🚀 Tecnologías utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Vite

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- bcrypt
- express-session
- cors

---

## 📁 Estructura del proyecto

backend/
  src/
    controllers/
    routes/
    prisma/
  index.js

frontend/
  src/
    main.js
    style.css
  index.html

---

## ⚙️ Funcionalidades

### 👤 Autenticación
- Login de usuario admin
- Validación de credenciales
- Sesiones con express-session

### 📦 Productos
- Crear productos
- Listar productos
- Actualizar productos
- Eliminar productos
- Control de stock

### 🛒 Lógica de negocio
- Productos asociados a categorías
- Al vender se descuenta stock
- Si el stock llega a 0, el producto se elimina automáticamente

### 🗂 Categorías
- Mouse
- Teclado
- Auriculares

Relación: 1 categoría → muchos productos

---

## 🧠 Base de datos (Prisma + MySQL)

Modelos principales:
- user
- product
- category
- order
- orderitem

---

## ▶️ Instalación y ejecución

### Clonar proyecto
git clone <URL_DEL_REPO>

### Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
node index.js

### Frontend
cd frontend
npm install
npm run dev

---

## 🔐 Variables de entorno (.env)

DATABASE_URL="mysql://root:password@localhost:3306/productos_gamers"
ADMIN_PASSWORD=1234
SESSION_SECRET=mi_secreto_tp

---

## 📌 Notas importantes

- Prisma genera la estructura con migraciones
- El login usa sesiones
- Proyecto pensado para entorno local

---

## 👨‍💻 Autores

Facundo Murillo
Matias Molina
Santiago Thomas
---
