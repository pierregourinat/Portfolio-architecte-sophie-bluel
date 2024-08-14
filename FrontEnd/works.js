document.addEventListener("DOMContentLoaded", () => {
  const apiCategories = "http://localhost:5678/api/categories";
  const apiUrl = "http://localhost:5678/api/works";
  const cardContainer = document.getElementById("cardContainer");
  const filterContainer = document.getElementById("filterContainer");
  let category = ""; // Stockage la catégorie actuellement sélectionnée par l'utilisateur
  let cardList = []; // Stockage de la liste complète des travaux récupérés depuis l'API

  // Appel à l'API et récupération des travaux
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then((data) => {
      cardList = data;
      createCards(); // Initialisation des cartes
      createCardsModal(); // Initialisation des cartes de la modal
    })
    .catch((error) => console.log("Error: ", error));

  // Appel les catégories de l'API
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

  // Fonction pour afficher les travaux
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

  //-----------GESTION DE LA MODAL----------//

  const modalOverlay = document.getElementById("modalOverlay");
  const modalWrapper = document.getElementById("modalWrapper");
  const closeModalBtns = document.querySelectorAll(".closeModalBtn");
  const cardContainerModal = document.getElementById("cardContainerModal");
  const addPhotoWrapper = document.getElementById("addPhotoWrapper");
  const previousArrow = document.getElementById("previousArrow");

  // Event clic bouton "modifier"
  editButton.addEventListener("click", () => {
    modalOverlay.classList.remove("d-none");
  });
  //Event clic icone cross pour fermer la modale
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modalOverlay.classList.add("d-none");
    });
  });
  //Event clic sur le bouton "ajouter une photo" pour amener à la page suivante de la modal
  addPhotoBtn.addEventListener("click", () => {
    if (modalWrapper.classList.contains("d-none")) {
      modalWrapper.classList.remove("d-none");
      addPhotoWrapper.classList.add("d-none");
    } else {
      modalWrapper.classList.add("d-none");
      addPhotoWrapper.classList.remove("d-none");
    }
  });
  //Event clic sur la flèche retour en arrière de la 2nde fenetre de la modal
  previousArrow.addEventListener("click", () => {
    modalWrapper.classList.remove("d-none");
    addPhotoWrapper.classList.add("d-none");
  });

  // Fonction pour la supression des images
  function deleteImage(buttonId) {
    const imageId = buttonId.replace("deleteButton", "");
    const deleteUrl = apiUrl + "/" + imageId;

    fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error");
        }
      })
      .then(() => {
        // On filtre cardList pour exclure les items dont l'id est égal à la valeur de imageId convertie en entier
        cardList = cardList.filter((item) => item.id !== parseInt(imageId));
        createCardsModal(); // Refresh de la modal après la supression d'une image
        createCards(); // Refresh de l'index après la supression d'une image
      })
      .catch((error) => {
        console.error("Error deleting image", error);
      });
  }

  function createCardsModal() {
    cardContainerModal.innerHTML = "";
    cardList.forEach((item) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const deleteButton = document.createElement("button");
      const deleteIcon = document.createElement("i");

      img.src = item.imageUrl;
      img.alt = item.title;

      deleteButton.id = `deleteButton${item.id}`;
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", () =>
        deleteImage(deleteButton.id)
      );

      deleteIcon.classList.add("fa-solid", "fa-trash-can");
      deleteButton.appendChild(deleteIcon);

      figure.appendChild(img);
      figure.appendChild(deleteButton);

      cardContainerModal.appendChild(figure);
    });
  }

  // Affichage de la minature lors de l'upload d'une photo
  const photoUpload = document.getElementById("photoUpload");
  const customFileUploadLabel = document.querySelector(".customFileUpload");
  const customFileUploadText = document.querySelector(
    ".customFileUploadWrapper p"
  );
  const thumbnailContainer = document.getElementById("thumbnailContainer");

  photoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "129px";
        img.style.maxHeight = "169px";
        img.style.marginBottom = "5px";
        thumbnailContainer.innerHTML = "";
        thumbnailContainer.parentElement.appendChild(img);

        customFileUploadLabel.classList.add("d-none");
        customFileUploadText.classList.add("d-none");
      };
      reader.readAsDataURL(file);
    }
  });

  // Envoi d'une photo pour l'ajouter à la galerie
  const uploadForm = document.getElementById("uploadForm");

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const title = document.getElementById("title").value.trim();
    const category = parseInt(document.getElementById("category").value, 10);
    const photoUpload = document.getElementById("photoUpload").files[0];

    // Réglage de la taille de la photo
    if (photoUpload.size > 4 * 1024 * 1024) {
      alert(
        "La taille de la photo est trop grande. Veuillez sélectionner une image plus petite."
      );
      return;
    }

    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", photoUpload);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newPhoto = await response.json(); // On s'assure que l'API renvoie les détails de la nouvelle photo
        uploadForm.reset();

        cardList.push(newPhoto); // Ajouter la nouvelle photo à la liste des cartes

        createCards(); // Mettre à jour la galerie

        createCardsModal(); // Mettre à jour la galerie dans la modal
      } else {
        const errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        alert(`Erreur lors de l'upload de la photo. ${errorMessage}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  });

  const validerBtn = document.getElementById("validerBtn");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");
  const photoUploadInput = document.getElementById("photoUpload");

  // Fonction pour vérifier si tous les champs sont remplis
  function checkFormValidity() {
    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const photoUpload = photoUploadInput.files[0];

    if (title && category && photoUpload) {
      validerBtn.style.backgroundColor = "#1D6154";
    } else {
      validerBtn.style.backgroundColor = ""; // Réinitialiser la couleur de fond
    }
  }

  // Ecouteurs d'événements aux champs pour vérifier les changements
  titleInput.addEventListener("input", checkFormValidity);
  categoryInput.addEventListener("input", checkFormValidity);
  photoUploadInput.addEventListener("change", checkFormValidity);
});
