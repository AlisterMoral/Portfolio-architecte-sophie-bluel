document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form_container");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.querySelector(".form_container-input[type='email']").value;
    const password = document.querySelector(".form_container-input[type='password']").value;

    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("authToken", token);
      window.location.href = "../index.html";
    } else {
      window.alert("Erreur dans l’identifiant ou le mot de passe");
    }
  });
});