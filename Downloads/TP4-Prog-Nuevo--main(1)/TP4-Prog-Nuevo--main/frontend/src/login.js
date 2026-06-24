async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  if (!usuario || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({
        usuario,
        password,
      }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);

    if (!res.ok) {
      alert(data.error || "Error al iniciar sesión");
      return;
    }

    console.log("Login OK:", data);

    // redirigir al home o dashboard
    window.location.href = "/index.html";

  } catch (error) {
    console.error(error);
    alert("Error de conexión con el servidor");
  }
}