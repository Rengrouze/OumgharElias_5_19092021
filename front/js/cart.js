/* Script pour afficher le panier, le modifier, le supprimer, et passer commande */

/* Section 1 : Afficher le panier */
//a : l'Api est t'il disponible ?
var apiOnline = false;
(async () => {
   // fonction asynchrone
   try {
      const response = await fetch("http://localhost:3000/api/products"); // on tente juste de se connecter à l'API
      const data = await response.json();
      console.log(data);
      apiOnline = true; // si on arrive ici, c'est que l'API est disponible
   } catch (error) {
      console.log(error);
      apiOnline = false; // si on arrive ici, c'est que l'API n'est pas disponible
      alert("Erreur : impossible de contacter l'API, le panier s'affichera avec des erreurs et il sera impossible de passer commande.");
   }
})();

//  b : le Panier est t'il vide ? si c'est le cas, envoyer une alerte

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
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}" />
             </div>
             <div class="cart__item__content__settings__delete">
                <p class="deleteItem" id="${product.id}${product.color}">Supprimer</p>
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
      // on récupère la couleur du produit
      var cart = JSON.parse(localStorage.getItem("cart")); //get the cart
      cart.forEach((product, index) => {
         //for each product in the cart
         if (product.id + product.color == id) {
            //if the product id is the same as the id of the product we want to delete
            cart.splice(index, 1); //delete the product
            if (cart.length == 0) {
               //if the cart is empty
               localStorage.removeItem("cart"); //remove the cart from the localStorage
               location.reload(); //reload the page
            } else {
               localStorage.setItem("cart", JSON.stringify(cart)); //update the cart in the localStorage
            }
         }
      });
   });
});

//This function is used to update the cart and localStorage when the user change the quantity of the item
document.querySelectorAll(".itemQuantity").forEach((itemQuantity) => {
   //for each quantity input
   itemQuantity.addEventListener("change", () => {
      //when the user change the quantity
      //check first if quantity set is a negative number
      if (itemQuantity.value < 1) {
         //if the quantity is negative
         itemQuantity.value = 1; //set the quantity to 1
      }
      var id = itemQuantity.parentElement.parentElement.parentElement.parentElement.dataset.id; //get the id of the product
      var cart = JSON.parse(localStorage.getItem("cart")); //get the cart
      cart.forEach((product, index) => {
         //for each product in the cart
         if (product.id == id) {
            //if the product id is the same as the id of the product we want to update
            cart[index].quantity = parseInt(itemQuantity.value); //update the quantity
         }
      });
      localStorage.setItem("cart", JSON.stringify(cart)); //update the cart in the localStorage
      location.reload(); //reload the page
   });
});

//when the user click on "commander" button, the script check if the cart is empty or not, if the form is valid, then it send the data to the server and display the order confirmation
document.getElementById("order").addEventListener("click", (event) => {
   event.preventDefault();
   if (!apiOnline) {
      alert("Erreur : impossible de contacter l'API");
      return;
   }
   //first we check the fields of the form
   const firstName = document.getElementById("firstName").value;
   const lastName = document.getElementById("lastName").value;
   const email = document.getElementById("email").value;
   const city = document.getElementById("city").value;
   const address = document.getElementById("address").value;

   //in case of reload, we clear all error messages and borders
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

   //we also reset the error status
   var formError = false;

   //now we check each individual fields for errors (no numbers in firstName, lastName, city and no empty fields)
   if (firstName == "") {
      document.getElementById("firstName").style.border = "solid 1px red";
      document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez entrer votre prénom";
      formError = true;
   }
   if (firstName.match(/\d/)) {
      document.getElementById("firstName").style.border = "solid 1px red";
      document.getElementById("firstNameErrorMsg").innerHTML = "Votre prénom ne peut pas contenir de chiffre";
      formError = true;
   }
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
   if (email == "") {
      document.getElementById("email").style.border = "solid 1px red";
      document.getElementById("emailErrorMsg").innerHTML = "Veuillez entrer votre email";
      formError = true;
   }
   //check if the email is valid and if it contains an @
   if (
      email.match(
         /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      ) == null
   ) {
      document.getElementById("email").style.border = "solid 1px red";
      document.getElementById("emailErrorMsg").innerHTML = "Votre email n'est pas valide";
      formError = true;
   }
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
   if (address == "") {
      document.getElementById("address").style.border = "solid 1px red";
      document.getElementById("addressErrorMsg").innerHTML = "Veuillez entrer votre adresse";
      formError = true;
   }

   //end of the check of the fields

   //now we check the noCart Value, if it is true, then we display an error message and we stop the script if not, we continue
   if (noCart) {
      alert("Votre panier est vide");
      return;
   } else {
      //now we check if the form is valid or not, if it is not valid, we stop the script etc.
      if (formError == true) {
         return;
      } else {
         //both the form and the cart are valid, we cand send the data to the server
         var contact = {
            firstName,
            lastName,
            email,
            address,
            city,
         };
         var cart = JSON.parse(localStorage.getItem("cart"));

         var order = {
            contact: contact,
            products: cart.map((product) => {
               //the api only needs the id of the product
               return product.id;
            }),
         };
         (async () => {
            //we use async to wait for the response from the server
            try {
               const response = await fetch("http://localhost:3000/api/products/order", {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify(order),
               });
               const data = await response.json();
               localStorage.removeItem("cart");
               window.location.href = `confirmation.html?id=${data.orderId}`;
            } catch (error) {
               console.log(error);
               alert("Erreur : impossible de contacter l'API");
            }
            //check reponse status
         })();
      }
   }
});
