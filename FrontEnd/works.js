document.addEventListener("DOMContentLoaded", () => {
  //Definition  URL API
  const apiUrl = "http://localhost:5678/api/works";
  const cardContainer = document.getElementById("cardContainer");

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      return response.json();
    })
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
      // console.log(data);
      // outputElement.textContent = JSON.stringify(data, null, 2);
    })
    .catch((error) => {
      console.error("Error :", error);
    });
});

// async function fetchWorks() {
//   const r = await fetch("http://localhost:5678/api/works", {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//     },
//   });
//   if (r.ok === true) {
//     return r.json();
//   }
//   throw new Error("Impossible de contacter le serveur");
// }

// fetchWorks().then((works) => console.log(users));

// fetch("http://localhost:5678/api/works")
//   .then((r) => r.json())
//   .then((body) => console.log(body));

// const content = await reponse.json();

// export function ajoutAddWork() {
//   const galleryElements = document.querySelectorAll(".gallery figure");

//   for (let i = 0; i < galleryElements.length; i++) {
//     piecesElements[i].addEventListener("click", async function (event) {});
//   }
// }
