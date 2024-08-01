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
  console.log(authToken);
  const linkLogout = document.getElementById("linkLogout");
  const linkLogin = document.getElementById("linkLogin");

  if (authToken) {
    // Admin est connecté
    linkLogout.classList.remove("d-none");
    linkLogin.classList.add("d-none");
  } else {
    // Admin n'est pas connecté
    linkLogout.classList.add("d-none");
    linkLogin.classList.remove("d-none");
  }

  // IDENTIFIANTS
  // email: sophie.bluel@test.tld

  // password: S0phie

  //  TODO Recup le lien à masquer > ajouter une classe "d-none" > dans le CSS je défini cette classe en display none
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE /works/{id}

function deleteImage(buttonId) {
  const imageId = buttonId.replace("deleteButton", "");
  const deleteUrl = apiUrl + "/" + imageId;

  fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then(() => {
      console.log(`Image with ID ${id} deleted succesfully.`);
      createCards();
    })
    .catch((error) => {
      console.error("Error deleting image", error);
    });
}

function createCardsModal() {
  cardList.map((item) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const deleteButton = document.createElement("button");

    img.src = item.imageUrl;
    img.alt = item.title;

    deleteButton.id = `deleteButton${item.id}`;
    deleteButton.addEventListener("click", () => deleteImage(deleteButton.id));

    figure.appendChild(img);
    figure.appendChild(deleteButton);

    cardContainer.appendChild(figure);

    // <figure>
    //   <img src="item.imageUrl" alt=" item.title"></img>
    //   <button id="deleteButton2" onClick={deleteImage(id)}></button>
    // </figure>
  });
}
