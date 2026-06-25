const API = "http://localhost:3000";

// =========================
// TOGGLE LOGIN / REGISTER
// =========================
function toggle() {
  const login = document.getElementById("loginForm");
  const register = document.getElementById("registerForm");
  const title = document.getElementById("title");

  if (login.style.display !== "none") {
    login.style.display = "none";
    register.style.display = "block";
    title.innerText = "Register";
  } else {
    login.style.display = "block";
    register.style.display = "none";
    title.innerText = "Login";
  }
}

// =========================
// LOGIN
// =========================
async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.mensaje);
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));

  if (data.rol === "cliente") window.location.href = "../index.html";
  if (data.rol === "admin") window.location.href = "../pages/admin.html";
  if (data.rol === "superadmin") window.location.href = "../pages/superadmin.html"; 
}

// =========================
// REGISTER
// =========================
async function register() {
  const usuario = document.getElementById("regUsuario").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.mensaje);
    return;
  }

  alert("Usuario creado correctamente");

  // volver a login
  toggle();
}