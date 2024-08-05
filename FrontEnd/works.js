document.addEventListener("DOMContentLoaded", () => {
  const apiCategories = "http://localhost:5678/api/categories";
  const apiUrl = "http://localhost:5678/api/works";
  const cardContainer = document.getElementById("cardContainer");
  const filterContainer = document.getElementById("filterContainer");
  let category = "";
  let cardList = [];

  if (cardList) {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error");
        }
        return response.json();
      })
      .then((data) => {
        cardList = data;
      })
      .catch((error) => console.log("Error: ", error));
  }

  fetch(apiCategories)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then((data) => {
      // Création des boutons en fonction des catégories récupérées sur l'API
      data.map((item) => {
        const button = document.createElement("button");
        button.textContent = item.name;
        button.id = "button" + item.id;

        filterContainer.appendChild(button);
      });

      const filterButtons = document.querySelectorAll(
        "#filterContainer button"
      );
      // Boucle qui gère les clics sur les boutons
      filterButtons.forEach((button) =>
        button.addEventListener("click", () => {
          category = button.textContent;
          console.log("category updated to :", category);
          filterButtons.forEach((btn) => {
            btn.classList.remove("button_selected");
          });
          button.classList.add("button_selected");
          createCards();
        })
      );

      // Gestion du bouton "Tous"
      const button0 = document.getElementById("button0");
      button0.addEventListener("click", () => {
        category = "";
        filterButtons.forEach((btn) => {
          btn.classList.remove("button_selected");
        });
        button0.classList.add("button_selected");
        createCards();
      });
      // Initialisation des cartes lors du premier chargement
      createCards();
    })
    .catch((error) => console.log("Error: ", error));

  function createCards() {
    let filteredData = [];
    if (category) {
      filteredData = cardList.filter((item) => item.category.name === category);
    } else {
      filteredData = cardList;
    }

    // Vider le container pour afficher le nouveau contenu
    cardContainer.innerHTML = "";

    // Afficher les cartes filtrées
    filteredData.map((item) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");

      img.src = item.imageUrl;
      img.alt = item.title;

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = item.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      cardContainer.appendChild(figure);
    });
  }

  //-----------ADMIN LOGIN SECTION----------//

  // LocalStorage du token d'authentification
  const authToken = localStorage.getItem("authToken");

  const linkLogout = document.getElementById("linkLogout");
  const linkLogin = document.getElementById("linkLogin");
  const editButton = document.getElementById("editButton");
  const editModBar = document.getElementById("editMod");
  const editButtonIcon = document.getElementById("editButtonIcon");

  if (authToken) {
    // Admin est connecté
    linkLogin.classList.add("d-none");
    filterContainer.classList.add("d-none");
    editButtonIcon.classList.remove("d-none");
    linkLogout.classList.remove("d-none");
    editButton.classList.remove("d-none");
    editModBar.classList.remove("d-none");
  } else {
    // Admin n'est pas connecté
    linkLogin.classList.remove("d-none");
    filterContainer.classList.remove("d-none");
    editButtonIcon.classList.add("d-none");
    linkLogout.classList.add("d-none");
    editButton.classList.add("d-none");
    editModBar.classList.add("d-none");
  }

  // IDENTIFIANTS
  // email: sophie.bluel@test.tld
  // password: S0phie

  console.log("linkLogin classes:", linkLogin.className);
  console.log("filterContainer classes:", filterContainer.className);
  console.log("linkLogout classes:", linkLogout.className);
  console.log("editButton classes:", editButton.className);
  console.log("editModBar classes:", editModBar.className);

  // GESTION DE LA MODAL AJOUT DE PHOTO ------------------------------------------------------------------

  const modalOverlay = document.getElementById("modalOverlay");
  const closeModalIcon = document.getElementById("closeModalIcon");

  editButton.addEventListener("click", () => {
    modalOverlay.style.display = "block";
  });
  closeModalIcon.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });
});
