document.addEventListener("DOMContentLoaded", () => {
  const apiCategories = "http://localhost:5678/api/categories";
  const apiUrl = "http://localhost:5678/api/works";
  const cardContainer = document.getElementById("cardContainer");
  const filterContainer = document.getElementById("filterContainer");
  let category = "";

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

  // Affichage des travaux (cards) en fonction du filtre sélectionné
  function createCards() {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error");
        }
        return response.json();
      })
      .then((data) => {
        let filteredData = "";
        if (category) {
          filteredData = data.filter((item) => item.category.name === category);
        } else {
          filteredData = data;
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
      })
      .catch((error) => console.log("Error: ", error));
  }
});
