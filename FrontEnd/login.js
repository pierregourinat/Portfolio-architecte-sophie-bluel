document.addEventListener("DOMContentLoaded", () => {
  const apiLogin = "http://localhost:5678/api/users/login";
  const formLogin = document.getElementById("formLogin");
  console.log(formLogin);

  formLogin.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailLogin = document.getElementById("email").value;
    const passwordLogin = document.getElementById("password").value;

    fetch(apiLogin, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ emailLogin, passwordLogin }),
    })
      .then(response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          window.location.href = "/users/admin";
        } else {
          alert("Erreur de connexion");
        }
      });
  });
});
