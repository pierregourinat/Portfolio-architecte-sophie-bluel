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
      body: JSON.stringify({ email: emailLogin, password: passwordLogin }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error");
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          window.location.href = "index.html";
        } else {
          alert("Erreur de connexion. Veuillez vérifier vos identifiants");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
        alert("Erreur lors de la connexion. Veuillez réessayer.");
      });
  });
});
