// Déclenchement de l'événement quand le document HTML est complètement chargé
document.addEventListener("DOMContentLoaded", () => {
  // Filtres de la galerie
  const apiCategories = "http://localhost:5678/api/categories";
  const filterContainer = document.getElementById("filterContainer");

  fetch(apiCategories)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.map((item) => {
        const button = document.createElement("button");
        button.textContent = item.name;
        button.id = "button" + item.id;

        filterContainer.appendChild(button);
      });
    })
    .catch((error) => console.error("Error :", error));

  //Definition URL API Works
  const apiUrl = "http://localhost:5678/api/works";
  const cardContainer = document.getElementById("cardContainer");

  // Fetch de l'API pour récupérer les ressources
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      return response.json();
    })
    // Méthode map pour créer un tableau avec les résultats de l'appel d'une fonction
    .then((data) => {
      data.map((item) => {
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
    // Catch les erreurs du code précédemment écrit
    .catch((error) => {
      console.error("Error :", error);
    });
});

// 1. Créer un filtre (sur la création de la gallery (ou card))
// 2. Doit être basé sur le bouton actif -- Bouton "Tous" actif par défaut
// 3. Gérer les clicks -- addEventListener
