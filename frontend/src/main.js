import "./style.css";

const API = "http://localhost:3000";

// Cargamos los productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});


// CARGAR PRODUCTOS
async function cargarProductos() {
  try {
    const res = await fetch(`${API}/productos`, { credentials: "include" });
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

    document.querySelectorAll(".card").forEach((card, index) => {
      card.addEventListener("click", () => {
        const p = data[index];

        document.getElementById("idActualizar").value = p.id;
        document.getElementById("nombreActualizar").value = p.nombre;
        document.getElementById("precioActualizar").value = p.precio;
        document.getElementById("stockActualizar").value = p.stock;
      });
    });

  } catch (e) {
    console.log(e);
  }
}

// AGREGAR PRODUCTO
document.getElementById("formAgregar")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const imagen = document.getElementById("imagen").value;
  const categoria = document.getElementById("categoria").value;

  await fetch(`${API}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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

document.getElementById("mostrarProductos")?.addEventListener("click", cargarProductos);

document.getElementById("vender")?.addEventListener("click", async () => {
  let id = idActualizar.value;
  let stock = Number(stockActualizar.value);

  if (!id || stock <= 0) return alert("Sin stock");

  await fetch(`${API}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ stock: stock - 1 })
  });

  cargarProductos();
});

document.getElementById("formActualizar")?.addEventListener("submit", async (e) => {
  e.preventDefault();

    
  await fetch(`${API}/productos/${idActualizar.value}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      nombre: nombreActualizar.value,
      precio: Number(precioActualizar.value)
    })
  });

  cargarProductos();
});