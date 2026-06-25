const API = "http://localhost:3000";

const user = JSON.parse(localStorage.getItem("user"));

if (!user || (user.rol !== "admin" && user.rol !== "superadmin")) {
  window.location.href = "/login.html";
}

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
async function cargarProductos() {
  try {
    const res = await fetch(`${API}/productos`);
    const productos = await res.json();

    const lista = document.getElementById("listaProductos");

    lista.innerHTML = productos.map(producto => `
      <div class="card">

        <div class="card-body">
          <h3>${producto.nombre}</h3>

          <p>Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock}</p>
          <p>ID: ${producto.id}</p>

          <div class="admin-actions">

            <button class="btn-delete" onclick="eliminarProducto(${producto.id})">
              Eliminar
            </button>

          </div>
        </div>

      </div>
    `).join("");

  } catch (error) {
    console.log(error);
    alert("Error al cargar productos");
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
async function eliminarProducto(id) {

  const confirmDelete = confirm("¿Seguro que querés eliminar este producto?");

  if (!confirmDelete) return;

  const res = await fetch(`${API}/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.ok) {
    alert("Producto eliminado");
    cargarProductos();
  } else {
    alert("Error al eliminar");
  }
}

/* =========================
   INIT
========================= */
cargarProductos();