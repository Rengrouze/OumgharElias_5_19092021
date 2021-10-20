/* Script pour afficher les produits dans la page produit.html et pour les ajouter au panier */

/* Section 1 : Afficher les produits dans la page produit.html */

//on veut regarder dans l'url l'id du produit

var apiOnline = false; // variable pour savoir si l'api est en ligne (sera utile plus bas)
const searchUrl = window.location.search; // recupere l'url
const urlParams = new URLSearchParams(searchUrl); // transforme l'url en objet
const id = urlParams.get("id"); // recupere l'id du produit
(async () => {
   try {
      // on essaie de faire la requete
      const response = await fetch("http://localhost:3000/api/products/" + id); // on recupere la reponse de la requete mais on ne recupere que le produit avec l'id
      const data = await response.json(); // on recupere les donnees du produit
      document.title = data.name; // on met le titre de la page avec le nom du produit
      document.getElementById("image").src = data.imageUrl; // on affiche l'image du produit
      document.getElementById("image").alt = data.altText; // on affiche l'alt de l'image
      document.getElementById("title").innerHTML = data.name; // on affiche le nom du produit
      document.getElementById("price").innerHTML = data.price; // on affiche le prix du produit
      document.getElementById("description").innerHTML = data.description; // on affiche la description du produit
      data.colors.forEach((color) => {
         // on parcourt les couleurs du produit
         document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`; // on affiche les différentes couleurs du produit
      });
      apiOnline = true; // on indique que l'api est en ligne
   } catch (error) {
      // si la requete echoue
      console.log(error);
      apiOnline = false;
      alert("Erreur : impossible de contacter l'API"); // on affiche un message d'erreur dans la console et dans la page
   }
})();

/* Section 2 : Ajouter les produits au panier */

// d'abord on crée un event listener sur le bouton
document.getElementById("addToCart").addEventListener("click", () => {
   if (!apiOnline) {
      // si l'api n'est pas disponible il vaut mieux stopper l'execution du script
      alert("Erreur : impossible de contacter l'API"); // on affiche un message d'erreur dans la console et dans la page
      return;
   }
   //"never trust user input" on va donc vérifier que les champs sont correctement remplis

   // l'utilisateur a t'il demandé une quantitée négative ? si oui on affiche un message d'erreur si non on continue
   if (document.getElementById("quantity").value <= 0) {
      alert("Veuillez séléctionnez une quantité valide");
      return;
   }
   // l'utilisateur a t'il demandé trop de produits ? si oui on affiche un message d'erreur si non on continue
   if (document.getElementById("quantity").value > 100) {
      alert("Veuillez séléctionnez une quantité inférieure à 100");
      return;
   }
   // l'utilisateur a t'il oublié de préciser la couleur ? si oui on affiche un message d'erreur si non on continue
   if (document.getElementById("colors").value == "") {
      alert("Veuillez séléctionnez une couleur");
      return;
   }

   //les champs sont correctement remplis, on peut donc ajouter le produit au panier

   let cart = JSON.parse(localStorage.getItem("cart")); // on recupere le panier en local storage
   if (cart == null) {
      // Si le Panier n'existe pas encore, on le crée
      cart = [];
   }

   // l'utilisateur a t'il déjà ajouté le produit avec la même couleur ? si oui on se contente de modifier la quantité si non on ajoute le produit au panier

   let alreadyExist = false; // on crée une variable qui va nous permettre de savoir si le produit existe déjà dans le panier
   cart.forEach((product) => {
      // on parcourt le panier
      if (product.id == id && product.color == document.getElementById("colors").value) {
         // si un produit avec le même id et la même couleur existe déjà dans le panier
         selectedQuantity = parseInt(document.getElementById("quantity").value); // on recupere la quantité choisie par l'utilisateur
         // et on l'incrémente
         if (selectedQuantity + product.quantity > 100) {
            // si la quantité choisie est supérieure à 100
            alert("Vous ne pouvez pas commander plus de 100 article du même type");
            alreadyExist = true;
            return;
         } else {
            product.quantity += selectedQuantity; // on incrémente la quantité qye l'utilisateur a choisi
            alreadyExist = true; // on indique que le produit existe déjà
            localStorage.setItem("cart", JSON.stringify(cart)); // on met à jour le panier en local storage
            alert("La quantité demandée a bien été ajoutée au panier"); // on affiche un message de confirmation
         }
      }
   });
   if (!alreadyExist) {
      // si le produit n'existe pas déjà dans le panier
      cart.push({
         // on ajoute le produit au panier avec les informations suivantes
         name: document.getElementById("title").innerHTML, // le nom du produit
         price: document.getElementById("price").innerHTML, // le prix du produit
         id: id, // l'id du produit
         imageUrl: document.getElementById("image").src, // l'url de l'image du produit
         altText: document.getElementById("image").alt, // l'alt de l'image du produit
         description: document.getElementById("description").innerHTML, // la description du produit
         color: document.getElementById("colors").value, // la couleur du produit
         quantity: parseInt(document.getElementById("quantity").value), // la quantité du produit
      });
      alert("Le produit a bien été ajouté au panier !"); // on affiche un message de confirmation à l'utilisateur pour lui dire que le produit a bien été ajouté au panier
      localStorage.setItem("cart", JSON.stringify(cart)); // on met à jour le panier en local storage
      // on reset les champs du formulaire
      document.getElementById("quantity").value = 1; // on remet la quantité à 1
      document.getElementById("colors").value = ""; // on remet la couleur à ""
   }
});

// Language : javascript
// Programmeur : Elias Oumghar
