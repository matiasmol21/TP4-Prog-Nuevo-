import "./style.css";

const API = "http://localhost:3000";
const PLACEHOLDER = "https://placehold.co/400x250?text=Sin+imagen";

const user = JSON.parse(localStorage.getItem("user") || "null");
const token = localStorage.getItem("token");

const isCliente = user?.rol === "cliente";
const isAdmin = user?.rol === "admin";
const isSuperAdmin = user?.rol === "superadmin";

const CART_KEY = "carrito";
let productos = [];
let carrito = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

document.addEventListener("DOMContentLoaded", () => {
  renderHeaderActions();
  configurarCarrito();
  cargarProductos();
});

function renderHeaderActions() {
  const authBox = document.getElementById("authBox");
  if (!authBox) return;

  if (!user) {
    authBox.innerHTML = `<a href="/pages/login.html" class="login-link">Ingresar</a>`;
    return;
  }

  let extra = "";
  if (isAdmin) extra = `<a href="/pages/admin.html" class="panel-link">Panel admin</a>`;
  if (isSuperAdmin) extra = `<a href="/pages/superadmin.html" class="panel-link">Panel superadmin</a>`;

  authBox.innerHTML = `
    ${isCliente ? `<button id="btnAbrirCarrito" class="cart-button">🛒 <span id="cartCount">0</span></button>` : ""}
    ${extra}
    <span class="user-badge">${user.usuario} (${user.rol})</span>
    <button id="btnLogout" class="logout mini">Salir</button>
  `;

  document.getElementById("btnLogout")?.addEventListener("click", logout);
  document.getElementById("btnAbrirCarrito")?.addEventListener("click", toggleCarrito);
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem(CART_KEY);
  location.reload();
}

async function cargarProductos() {
  try {
    const res = await fetch(`${API}/productos`);
    productos = await res.json();

    const perifericos = productos.filter(
      p => p.category?.nombre?.toLowerCase() === "periféricos" ||
           p.category?.nombre?.toLowerCase() === "perifericos"
    );

    const placas = productos.filter(
      p => p.category?.nombre?.toLowerCase() === "placas de video"
    );

    renderLista("listaPerifericos", perifericos, "No hay periféricos cargados.");
    renderLista("listaPlacas", placas, "No hay placas de video cargadas.");

    renderCarrito();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

function renderLista(containerId, items, emptyText) {
  const lista = document.getElementById(containerId);
  if (!lista) return;

  if (!items.length) {
    lista.innerHTML = `<p class="empty-products">${emptyText}</p>`;
    return;
  }

  lista.innerHTML = items.map(p => `
    <article class="card">
      <img 
        src="${p.imagen || PLACEHOLDER}" 
        alt="${p.nombre}" 
        onerror="this.onerror=null;this.src='${PLACEHOLDER}'"
      />
      <div class="card-body">
        <h3>${p.nombre}</h3>
        <p class="precio">$${Number(p.precio).toFixed(2)}</p>
        <p>📦 Stock: ${p.stock}</p>
        <p>🎮 ${p.category?.nombre || "Sin categoría"}</p>
        ${
          isCliente
            ? `<button class="btn-add-cart" data-id="${p.id}" ${p.stock < 1 ? "disabled" : ""}>
                Agregar al carrito
              </button>`
            : ""
        }
      </div>
    </article>
  `).join("");

  if (isCliente) {
    lista.querySelectorAll(".btn-add-cart").forEach(btn => {
      btn.addEventListener("click", () => agregarAlCarrito(Number(btn.dataset.id)));
    });
  }
}

function configurarCarrito() {
  renderCarrito();
  document.getElementById("cerrarCarrito")?.addEventListener("click", toggleCarrito);
  document.getElementById("btnComprar")?.addEventListener("click", comprarCarrito);
}

function toggleCarrito() {
  document.getElementById("carritoPanel")?.classList.toggle("open");
}

function guardarCarrito() {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  renderCarrito();
}

function agregarAlCarrito(productId) {
  const producto = productos.find(p => p.id === productId);
  if (!producto || producto.stock < 1) return;

  const existente = carrito.find(i => i.productId === productId);

  if (existente) {
    if (existente.cantidad >= producto.stock) {
      return alert("No hay más stock disponible");
    }
    existente.cantidad += 1;
  } else {
    carrito.push({ productId, cantidad: 1 });
  }

  guardarCarrito();
}

function cambiarCantidad(productId, delta) {
  const item = carrito.find(i => i.productId === productId);
  const prod = productos.find(p => p.id === productId);
  if (!item || !prod) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => i.productId !== productId);
  }

  if (item.cantidad > prod.stock) {
    item.cantidad = prod.stock;
  }

  guardarCarrito();
}

function eliminarDelCarrito(productId) {
  carrito = carrito.filter(i => i.productId !== productId);
  guardarCarrito();
}

function renderCarrito() {
  const itemsBox = document.getElementById("carritoItems");
  const totalBox = document.getElementById("carritoTotal");
  const countBox = document.getElementById("cartCount");

  if (!itemsBox || !totalBox) return;

  const detalle = carrito
    .map(item => {
      const prod = productos.find(p => p.id === item.productId);
      return prod ? { ...item, nombre: prod.nombre, precio: Number(prod.precio) } : null;
    })
    .filter(Boolean);

  itemsBox.innerHTML = detalle.length
    ? detalle.map(item => `
        <div class="cart-item">
          <div>
            <strong>${item.nombre}</strong>
            <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
          </div>
          <div class="cart-actions">
            <button data-op="restar" data-id="${item.productId}">-</button>
            <button data-op="sumar" data-id="${item.productId}">+</button>
            <button data-op="borrar" data-id="${item.productId}">x</button>
          </div>
        </div>
      `).join("")
    : "<p>Tu carrito está vacío.</p>";

  totalBox.textContent = `$${detalle.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}`;

  if (countBox) {
    countBox.textContent = String(carrito.reduce((a, b) => a + b.cantidad, 0));
  }

  itemsBox.querySelectorAll("button").forEach(btn => {
    const id = Number(btn.dataset.id);
    const op = btn.dataset.op;

    btn.addEventListener("click", () => {
      if (op === "sumar") cambiarCantidad(id, 1);
      if (op === "restar") cambiarCantidad(id, -1);
      if (op === "borrar") eliminarDelCarrito(id);
    });
  });
}

async function comprarCarrito() {
  if (!user || !isCliente) return alert("Tenés que iniciar sesión como cliente");
  if (!carrito.length) return alert("El carrito está vacío");

  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items: carrito })
  });

  const data = await res.json();

  if (!res.ok) return alert(data.error || "No se pudo completar la compra");

  alert("Compra realizada con éxito");
  carrito = [];
  guardarCarrito();
  toggleCarrito();
  cargarProductos();
}