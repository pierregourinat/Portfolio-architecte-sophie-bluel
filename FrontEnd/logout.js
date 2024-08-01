document.addEventListener("DOMContentLoaded", () => {
  const linkLogout = document.getElementById("linkLogout");

  linkLogout.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("authToken");
    window.location.href = "index.html";
  });
});
