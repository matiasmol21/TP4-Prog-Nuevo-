import "./style.css";

const API = "http://localhost:3000";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "/login.html";
}

const isAdmin = user.rol === "admin";
const isSuperAdmin = user.rol === "superadmin";
const isCliente = user.rol === "cliente";

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  if (isCliente) {
    document.getElementById("formAgregar")?.style.display = "none";
    document.getElementById("formActualizar")?.style.display = "none";
  }
});

// =========================
// CARGAR PRODUCTOS (TODOS)
// =========================
async function cargarProductos() {
  try {
    const res = await fetch(`${API}/productos`);
    const data = await res.json();

    document.getElementById("listaProductos").innerHTML = data
      .map(
        (p) => `
        <div class="card" data-id="${p.id}">
          <img src="${p.imagen || "https://placehold.co/400x250?text=Gamer"}">
          <div class="card-body">
            <h3>${p.nombre}</h3>
            <p class="precio">$${p.precio}</p>
            <p>📦 ${p.stock}</p>
            <p>🎮 ${p.category?.nombre || "Sin categoría"}</p>
          </div>
        </div>
      `
      )
      .join("");

    // click para editar (solo admin)
    if (isAdmin || isSuperAdmin) {
      document.querySelectorAll(".card").forEach((card, index) => {
        card.addEventListener("click", () => {
          const p = data[index];

          document.getElementById("idActualizar").value = p.id;
          document.getElementById("nombreActualizar").value = p.nombre;
          document.getElementById("precioActualizar").value = p.precio;
          document.getElementById("stockActualizar").value = p.stock;
        });
      });
    }

  } catch (e) {
    console.log(e);
  }
}

// =========================
// AGREGAR PRODUCTO (ADMIN)
// =========================
document.getElementById("formAgregar")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!isAdmin && !isSuperAdmin) return;

  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const imagen = document.getElementById("imagen").value;
  const categoria = document.getElementById("categoria").value;

  await fetch(`${API}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      imagen,
      categoryId: Number(categoria)
    })
  });

  cargarProductos();
});

// =========================
// VENDER (ADMIN)
// =========================
document.getElementById("vender")?.addEventListener("click", async () => {
  if (!isAdmin && !isSuperAdmin) return;

  let id = idActualizar.value;
  let stock = Number(stockActualizar.value);

  if (!id || stock <= 0) return alert("Sin stock");

  await fetch(`${API}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock: stock - 1 })
  });

  cargarProductos();
});

// =========================
// ACTUALIZAR PRODUCTO
// =========================
document.getElementById("formActualizar")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!isAdmin && !isSuperAdmin) return;

  await fetch(`${API}/productos/${idActualizar.value}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: nombreActualizar.value,
      precio: Number(precioActualizar.value),
      stock: Number(stockActualizar.value)
    })
  });

  cargarProductos();
});