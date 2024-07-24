// Déclenchement de l'événement quand le document HTML est complètement chargé
document.addEventListener("DOMContentLoaded", () => {
  // Filtres de la galerie
  const apiCategories = "http://localhost:5678/api/categories";
  const filterContainer = document.getElementById("filterContainer");

  //Récupération des catégories de l'API
  fetch(apiCategories)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.map((item) => {
        //Créer un bouton pour chaque catégories
        const button = document.createElement("button");
        button.textContent = item.name;
        button.id = "button" + item.id;

        filterContainer.appendChild(button);
      });
      const filterButtons = document.querySelectorAll(
        "#filterContainer button"
      );
      filterButtons.forEach((button) => {
        //Pour chaque bouton, créer un écouteur d'événement
        button.addEventListener("click", () => {
          const category = button.textContent; //Récupération du texte du bouton cliqué
          filterButtons.forEach((btn) => {
            btn.classList.remove("button_selected");
            button.classList.add("button_selected");
          });

          filter(category); // Filtrer les images en fonction de la category sélectionnée
        });
      });
    })
    .catch((error) => console.error("Error :", error));

  //Definition URL API Works
  const apiUrl = "http://localhost:5678/api/works";
  const cardContainer = document.getElementById("cardContainer");

  // Fetch de l'API pour récupérer les ressources Works
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
        img.setAttribute("data-category", item.category.name); // Stockage des catégories de chaque image
        console.log(item.category.name);
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = item.title;
        figure.dataset.category = item.category.name; // Ajout de la catégorie de l'image à l'attribut data-category de l'élément figure

        figure.appendChild(img);
        figure.appendChild(figcaption);

        cardContainer.appendChild(figure);
      });
    })
    // Catch les erreurs du code précédemment écrit
    .catch((error) => {
      console.error("Error :", error);
    });

  function filter(category) {
    console.log("Filtrer des images par catégorie :", category);

    const galleryItems = document.querySelectorAll("#cardContainer figure");

    galleryItems.forEach((item) => {
      const itemCategory = item.dataset.category;

      if (itemCategory === category || category === "Tous") {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
});

// 1. Créer un filtre (sur la création de la gallery (ou card))
// 2. Doit être basé sur le bouton actif -- Bouton "Tous" actif par défaut
// 3. Gérer les clicks -- addEventListener
