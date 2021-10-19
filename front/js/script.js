/* Script pour afficher la liste des produits disponibles */

// on veut récupérer les données de l'API

(async () => {
   // on utilise une fonction asynchrone pour éviter les problèmes de chargement
   try {
      // on essaie de récupérer les données
      const response = await fetch("http://localhost:3000/api/products"); // on récupère les données
      const data = await response.json(); // on transforme les données en JSON
      data.forEach((product) => {
         // on parcours le tableau et pour chaque élément on crée un élément HTML
         console.log(product); // on affiche les données
         document.getElementById("items").innerHTML += `
            <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt=${product.altTxt}>
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
            </a>
                `; // on affiche les données dans le DOM
      }); // on ferme le forEach
   } catch (error) {
      // on catch les erreurs
      console.log(error); // on affiche les erreurs dans la console
      alert("Erreur : impossible de contacter l'API"); // on affiche un message d'erreur
   }
})();

// Language : javascript
// Programmeur : Elias Oumghar
