
const API = "http://localhost:3000";

const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.rol !== "superadmin") {
  window.location.href = "/login.html";
}

const token = localStorage.getItem("token");

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  window.location.href = "/login.html";
}

async function cargarUsuarios() {

  const res = await fetch(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const usuarios = await res.json();

  const tabla = document.getElementById("tablaUsuarios");

  tabla.innerHTML = usuarios.map(usuario => `
    <tr>

      <td>${usuario.id}</td>

      <td>${usuario.usuario}</td>

      <td>
        <select id="rol-${usuario.id}">
          <option value="cliente" ${usuario.rol === "cliente" ? "selected" : ""}>Cliente</option>
          <option value="admin" ${usuario.rol === "admin" ? "selected" : ""}>Admin</option>
          <option value="superadmin" ${usuario.rol === "superadmin" ? "selected" : ""}>SuperAdmin</option>
        </select>
      </td>

      <td>

        <button onclick="actualizarRol(${usuario.id})">
          Guardar
        </button>

        <button onclick="eliminarUsuario(${usuario.id})">
          Eliminar
        </button>

      </td>

    </tr>
  `).join("");
}

async function actualizarRol(id) {

  const rol = document.getElementById(`rol-${id}`).value;

  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ rol })
  });

  if (res.ok) {
    alert("Rol actualizado");
    cargarUsuarios();
  } else {
    alert("Error al actualizar");
  }
}

async function eliminarUsuario(id) {

  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.ok) {
    alert("Usuario eliminado");
    cargarUsuarios();
  } else {
    alert("Error al eliminar");
  }
}

  document.getElementById("formUsuario")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        usuario: usuario.value,
        password: password.value,
        rol: rol.value
      })
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      alert("Error al crear usuario");
      return;
    }

    alert("Usuario creado ✔");
    cargarUsuarios();
  });

cargarUsuarios();