import "./style.css";

fetch("http://localhost:3000/productos")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    document.querySelector("#app").innerHTML = `
      <h1>Productos</h1>

      ${data
        .map(
          (producto) => `
            <div>

              <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
                width="200"
              />

              <h2>${producto.nombre}</h2>

              <p>$${producto.precio}</p>

            </div>
          `
        )
        .join("")}
    `;
  })
  .catch((error) => console.log(error));

document.getElementById("formAgregar").addEventListener("submit", async (e) => {

  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);
  const categoria = document.getElementById("categoria").value;
  const imagen = document.getElementById("imagen").value;

  const respuesta = await fetch("http://localhost:3000/productos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre,
      precio,
      stock,
      categoria,
      imagen
    })
  });

  const datos = await respuesta.json();

  console.log(datos);

});

// MOSTRAR PRODUCTOS

document.getElementById("mostrarProductos").addEventListener("click", async () => {

  const respuesta = await fetch("http://localhost:3000/productos");

  const productos = await respuesta.json();

  const lista = document.getElementById("listaProductos");

  lista.innerHTML = "";

  productos.forEach(producto => {

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
  <img src="${producto.imagen || 'https://placehold.co/400x250?text=Gamer'}">

<div class="card-body">

<h3>${producto.nombre}</h3>

<p class="precio">$${producto.precio}</p>

<p>📦 Stock: ${producto.stock}</p>

<p>🎮 ${producto.categoria}</p>

</div>

`;

    card.addEventListener("click", () => {

      document.getElementById("idActualizar").value = producto.id;

      document.getElementById("nombreActualizar").value = producto.nombre;

      document.getElementById("precioActualizar").value = producto.precio;

      document.getElementById("stockActualizar").value = producto.stock;

    });

    lista.appendChild(card);

  });

});
// CARGAR PRODUCTO EN FORMULARIO DE ACTUALIZAR
function cargarProducto(id, nombre, precio, stock) {

  document.getElementById("idActualizar").value = id;
  document.getElementById("nombreActualizar").value = nombre;
  document.getElementById("precioActualizar").value = precio;
  document.getElementById("stockActualizar").value = stock;

}

// VENDER PRODUCTO
document.getElementById("vender").addEventListener("click", async () => {
  const id = document.getElementById("idActualizar").value;
  let stock = parseInt(document.getElementById("stockActualizar").value);
  if (stock <= 0) {
    alert("Sin stock");
    return;
  }
  stock--;
  await fetch(`http://localhost:3000/productos/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      stock
    })

  });

  document.getElementById("stockActualizar").value = stock;
  document.getElementById("mostrarProductos").click();
});

// ACTUALIZAR

document.getElementById("formActualizar")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const id =
      document.getElementById("idActualizar").value;

    const nombre =
      document.getElementById("nombreActualizar").value;

    const precio =
      document.getElementById("precioActualizar").value;

    await fetch(
      `http://localhost:3000/productos/${id}`,
      {

        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          nombre,
          precio
        })

      }
    );

    alert("Producto actualizado");

  });