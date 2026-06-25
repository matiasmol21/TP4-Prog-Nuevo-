const API = "http://localhost:3000";


const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "./login.html";
}

const isAdmin = user.rol === "admin";
const isSuperAdmin = user.rol === "superadmin";
const isCliente = user.rol === "cliente";

const token = localStorage.getItem("token");


/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  window.location.href = "/login.html";
}

/* =========================
   CARGAR PRODUCTOS
========================= */
let productosGlobal = [];

async function cargarProductos() {
  try {
    const res = await fetch(`${API}/productos`);
    const data = await res.json();

    console.log("Productos:", data);

    productosGlobal = data;

    const lista = document.getElementById("listaProductos");

    if (!lista) {
      console.error("No existe #listaProductos");
      return;
    }

    lista.innerHTML = data
      .map(
        (p) => `
          <div class="card" data-id="${p.id}">
            <img src="${p.imagen || "https://placehold.co/400x250?text=Gamer"}">
            <div class="card-body">
              <h3>${p.nombre}</h3>
              <p>$${p.precio}</p>
              <p>Stock: ${p.stock}</p>
            </div>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;

        const p = productosGlobal.find(prod => prod.id == id);

        console.log("Click en:", p);

        if (!p) return;

        document.getElementById("idActualizar").value = p.id;
        document.getElementById("nombreActualizar").value = p.nombre;
        document.getElementById("precioActualizar").value = p.precio;
        document.getElementById("stockActualizar").value = p.stock;
      });
    });

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

/* =========================
   CREAR PRODUCTO
========================= */
async function crearProducto() {

  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const imagen = document.getElementById("imagen").value;
  const categoria = document.getElementById("categoria").value;

  if (!nombre || !precio || !stock || !categoria) {
    return alert("Completa todos los campos");
  }

  const res = await fetch(`${API}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      imagen,
      categoryId: Number(categoria)
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Producto creado correctamente");

    // limpiar inputs
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("imagen").value = "";
    document.getElementById("categoria").value = "";

    cargarProductos();
  } else {
    alert(data.error || "Error al crear producto");
  }
}

/* =========================
   ELIMINAR PRODUCTO
========================= */
document.getElementById("btnEliminar")?.addEventListener("click", async () => {
  const id = document.getElementById("idActualizar").value;
  const token = localStorage.getItem("token");

  if (!id) {
    alert("Selecciona un producto primero");
    return;
  }

  const confirmar = confirm("¿Seguro que querés eliminar este producto?");
  if (!confirmar) return;

  const res = await fetch(`${API}/productos/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  console.log("DELETE:", data);

  if (!res.ok) {
    alert("Error al eliminar");
    return;
  }

  cargarProductos();
  alert("Producto eliminado ✔");

  document.getElementById("idActualizar").value = "";
  document.getElementById("nombreActualizar").value = "";
  document.getElementById("precioActualizar").value = "";
  document.getElementById("stockActualizar").value = "";
});
/* =========================
   INIT
========================= */
cargarProductos();

/* =========================
    ACTUALIZAR PRODUCTO
========================= */

document.getElementById("formActualizar")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const id = document.getElementById("idActualizar").value;

  console.log("ID UPDATE:", id);

  const res = await fetch(`${API}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre: document.getElementById("nombreActualizar").value,
      precio: Number(document.getElementById("precioActualizar").value),
      stock: Number(document.getElementById("stockActualizar").value),
    }),
  });

  const data = await res.json();

  console.log("RESPUESTA BACKEND:", data);

  if (!res.ok) {
    alert("Error al actualizar producto");
    return;
  }

  cargarProductos();

  alert("Producto actualizado ✔");
});

