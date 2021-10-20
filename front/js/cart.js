/* Script pour afficher le panier, le modifier ou supprimer son contenu et passer sa commande */

/* Section 1 : Afficher le panier */
//a : l'Api est t'il disponible ?

(async () => {
   // fonction asynchrone
   try {
      const response = await fetch("http://localhost:3000/api/products"); // on tente juste de se connecter à l'API
      const data = await response.json();
      console.log(data);
   } catch (error) {
      console.log(error);
      alert("Erreur : impossible de contacter l'API, le panier s'affichera avec des erreurs et il sera impossible de passer commande.");
   }
})();

//  b : le Panier est t'il vide ?

var noCart = false; // on crée une variable
var cart = JSON.parse(localStorage.getItem("cart")); // on récupère le panier dans le localStorage
if (cart == null) {
   // si le panier est vide
   noCart = true; // on met la variable à true
} else {
   // si le panier n'est pas vide
   displayCart(); // on appelle la fonction pour afficher le panier
   noCart = false; // on met la variable à false
}

// Fonction pour afficher le panier
function displayCart() {
   var cart = JSON.parse(localStorage.getItem("cart")); // on récupère le panier dans le localStorage
   cart.forEach((product) => {
      // pour chaque produit dans le panier
      console.log(product);
      document.getElementById("cart__items").innerHTML += `
       <article class="cart__item" data-id="${product.id}">
       <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}" />
       </div>
       <div class="cart__item__content">
          <div class="cart__item__content__titlePrice">
             <h2>${product.name} -- Couleur : ${product.color}</h2>
             <p>${product.price} €</p>
          </div>
          <div class="cart__item__content__settings">
             <div class="cart__item__content__settings__quantity">
                <p>Qté :</p>
                <input type="number" class="itemQuantity ${product.id} ${product.color}"  name="itemQuantity" min="1" max="100" value="${product.quantity}" />
             </div>
             <div class="cart__item__content__settings__delete">
                <p class="deleteItem ${product.color}" id="${product.id}">Supprimer</p>
             </div>
          </div>
       </div>
    </article>
              `;

      // on calcule le nombre de produits dans le panier
      var totalItems = 0;
      cart.forEach((product) => {
         totalItems += product.quantity;
      });
      document.getElementById("totalQuantity").innerHTML = `${totalItems}`;

      //on calcule le prix total du panier
      var totalPrice = 0;
      cart.forEach((product) => {
         totalPrice += product.price * product.quantity;
      });
      document.getElementById("totalPrice").innerHTML = `${totalPrice} `;
   });
}

/* Section 2 : Modifier le panier */

// a : Supprimer un produit du panier

document.querySelectorAll(".deleteItem").forEach((deleteItem) => {
   // on récupère tous les éléments qui ont la classe deleteItem
   deleteItem.addEventListener("click", () => {
      // on ajoute un évènement au clic sur l'élément
      var id = deleteItem.id; // on récupère l'id du produit
      var color = deleteItem.classList[1]; // on récupère la couleur du produit
      var cart = JSON.parse(localStorage.getItem("cart")); // on récupère le panier dans le localStorage
      cart.forEach((product, index) => {
         // pour chaque produit dans le panier
         if (product.id == id && product.color == color) {
            // si le produit dans le panier correspond à l'id et la couleur
            cart.splice(index, 1); // on supprime le produit du panier
            if (cart.length == 0) {
               // si le panier est vide
               localStorage.removeItem("cart"); // on supprime le panier du localStorage
               location.reload(); // on recharge la page
            } else {
               //si le panier n'est pas vide
               localStorage.setItem("cart", JSON.stringify(cart)); // on met à jour le panier dans le localStorage
               location.reload(); // on recharge la page
            }
         }
      });
   });
});

// b : Modifier la quantité d'un produit du panier

document.querySelectorAll(".itemQuantity").forEach((itemQuantity) => {
   // on récupère tous les éléments qui ont la classe itemQuantity
   itemQuantity.addEventListener("change", () => {
      // on ajoute un évènement au changement de valeur
      // "never trust user input" on vérifie que la valeur n'est pas un nombre négatif
      if (itemQuantity.value < 1) {
         // si la valeur est inférieure à 1
         itemQuantity.value = 1; // on met la valeur à 1 pour ne pas avoir a supprimer le produit du panier (dans le cas d'une erreur il vaut mieux que la valeur soit 1)
         alert("La quantité doit être supérieure à 0"); // on affiche une alerte
      }
      if (itemQuantity.value > 100) {
         // si la valeur est supérieure à 100
         itemQuantity.value = 100; // on met la valeur à 100
         alert("La quantité ne peut dépasser 100"); // on affiche une alerte
      }

      // si la valeur est correcte on peut modifier le panier
      var id = itemQuantity.classList[1]; // on récupère l'id du produit
      var color = itemQuantity.classList[2]; // on récupère la couleur du produit
      var cart = JSON.parse(localStorage.getItem("cart")); // on récupère le panier dans le localStorage
      cart.forEach((product, index) => {
         // pour chaque produit dans le panier
         if (product.id == id && product.color == color) {
            // si le produit dans le panier correspond à l'id et la couleur
            cart[index].quantity = parseInt(itemQuantity.value); // on met à jour la quantité du produit dans le panier
         }
      });
      localStorage.setItem("cart", JSON.stringify(cart)); // on met à jour le panier dans le localStorage
      location.reload(); // on recharge la page pour afficher les modifications
   });
});

/* Section 3 : Passer sa commande */

// !!!!! Beaucoup de choses se passent ici !!!!!

document.getElementById("order").addEventListener("click", (event) => {
   // on ajoute un évènement au clic sur le bouton
   event.preventDefault(); // on empêche le comportement par défaut du bouton "Commander !"

   //a : Le formulaire :

   // Dans un premier temps on va récuperer les données du formulaire
   const firstName = document.getElementById("firstName").value;
   const lastName = document.getElementById("lastName").value;
   const email = document.getElementById("email").value;
   const city = document.getElementById("city").value;
   const address = document.getElementById("address").value;

   // : Ensuite on remet à zéro les potentielles alertes visuelles d'erreur comme les bordures rouges et le texte d'alerte
   document.getElementById("firstName").style.border = "none";
   document.getElementById("firstNameErrorMsg").innerHTML = "";
   document.getElementById("lastName").style.border = "none";
   document.getElementById("lastNameErrorMsg").innerHTML = "";
   document.getElementById("email").style.border = "none";
   document.getElementById("emailErrorMsg").innerHTML = "";
   document.getElementById("city").style.border = "none";
   document.getElementById("cityErrorMsg").innerHTML = "";
   document.getElementById("address").style.border = "none";
   document.getElementById("addressErrorMsg").innerHTML = "";

   // on va aussi remettre la valeur formError à false
   var formError = false;

   /*On va vérifier individuellement chaque champ du formulaire pour voir s'il y a une erreur comme des chiffres dans le prénom, nom et ville,
   si le mail n'est pas valide ou encore un champ vide */

   //prénom
   if (firstName == "") {
      // Si le champ est vide
      document.getElementById("firstName").style.border = "solid 1px red"; // on met une bordure rouge
      document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez entrer votre prénom"; // on affiche un message d'erreur
      formError = true; // on met la variable formError à true
   }
   if (firstName.match(/\d/)) {
      // Si le champ contient un chiffre
      document.getElementById("firstName").style.border = "solid 1px red"; // on met une bordure rouge
      document.getElementById("firstNameErrorMsg").innerHTML = "Votre prénom ne peut pas contenir de chiffre"; // on affiche un message d'erreur
      formError = true; // on met la variable formError à true
   }

   // ceci sera le même processus pour touter les champs du formulaire

   //nom
   if (lastName == "") {
      document.getElementById("lastName").style.border = "solid 1px red";
      document.getElementById("lastNameErrorMsg").innerHTML = "Veuillez entrer votre nom";
      formError = true;
   }
   if (lastName.match(/\d/)) {
      document.getElementById("lastName").style.border = "solid 1px red";
      document.getElementById("lastNameErrorMsg").innerHTML = "Votre nom ne peut pas contenir de chiffre";
      formError = true;
   }

   //email
   if (email == "") {
      document.getElementById("email").style.border = "solid 1px red";
      document.getElementById("emailErrorMsg").innerHTML = "Veuillez entrer votre email";
      formError = true;
   }
   if (
      // on vérifie que l'email est valide
      email.match(
         /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      ) == null
   ) {
      document.getElementById("email").style.border = "solid 1px red";
      document.getElementById("emailErrorMsg").innerHTML = "Votre email n'est pas valide";
      formError = true;
   }

   //ville
   if (city == "") {
      document.getElementById("city").style.border = "solid 1px red";
      document.getElementById("cityErrorMsg").innerHTML = "Veuillez entrer votre ville";
      formError = true;
   }
   if (city.match(/\d/)) {
      document.getElementById("city").style.border = "solid 1px red";
      document.getElementById("cityErrorMsg").innerHTML = "Votre ville ne peut pas contenir de chiffre";
      formError = true;
   }

   //adresse
   if (address == "") {
      document.getElementById("address").style.border = "solid 1px red";
      document.getElementById("addressErrorMsg").innerHTML = "Veuillez entrer votre adresse";
      formError = true;
   }

   //Les données de l'utilisateur ont été vérifiées

   //b : reste du processus de commande :

   if (noCart) {
      // On vérifie si le panier est vide
      alert("Votre panier est vide"); // si oui on affiche un message d'erreur et on arrête le processus de commande
      return;
   } else {
      if (formError) {
         // on reprends notre variable formError qui était à false et qui est à true si au moins un champ du formulaire n'est pas valide
         return; // on arrête le processus de commande
      } else {
         // Si tout est bon on envoie les données à l'API
         var contact = {
            // on crée un objet contact qui contient les données de l'utilisateur
            firstName,
            lastName,
            email,
            address,
            city,
         };
         var cart = JSON.parse(localStorage.getItem("cart")); // on récupère le panier dans le localStorage

         var order = {
            // on crée un objet order qui contient les données de la commande
            contact: contact, // on y met les données de l'utilisateur
            products: cart.map((product) => {
               // on ne récupère que l'id des produits du panier
               return product.id;
            }),
         };
         (async () => {
            // on crée une fonction asynchrone

            try {
               // on essaie de faire la requête
               const response = await fetch("http://localhost:3000/api/products/order", {
                  // on envoie la requête
                  method: "POST", // on utilise la méthode POST
                  headers: {
                     "Content-Type": "application/json", // on précise le type de données envoyées
                  },
                  body: JSON.stringify(order), // on y met les données de la commande
               });
               const data = await response.json(); // on attends de recevoir les données de la requête
               localStorage.removeItem("cart"); // on supprime le panier du localStorage
               window.location.href = `confirmation.html?id=${data.orderId}`; // on redirige l'utilisateur vers la page de confirmation avec l'id de la commande
            } catch (error) {
               // si la requête échoue
               console.log(error); // on affiche l'erreur
               alert("Erreur : impossible de contacter l'API"); // on affiche un message d'erreur
            }
         })();
      }
   }
});

// Language : javascript
// Programmeur : Elias Oumghar
