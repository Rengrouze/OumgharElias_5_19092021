//get what's in the cart in local storage and check if it's empty, if it is, send an alert, if not display the cart
var noCart = false;
var cart = JSON.parse(localStorage.getItem("cart"));
if (cart == null) {
   noCart = true;
} else {
   displayCart();
   noCart = false;
}
function displayCart() {
   var cart = JSON.parse(localStorage.getItem("cart"));
   cart.forEach((product) => {
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
                <p class="deleteItem" id="${product.id}">Supprimer</p>
             </div>
          </div>
       </div>
    </article>
              `;
      var totalItems = 0;
      cart.forEach((product) => {
         totalItems += product.quantity;
      });
      document.getElementById("totalQuantity").innerHTML = `${totalItems}`;
      //get the total price of the cart
      var totalPrice = 0;
      cart.forEach((product) => {
         totalPrice += product.price * product.quantity;
      });
      document.getElementById("totalPrice").innerHTML = `${totalPrice} `;
   });
}
//if the user click on the delete button, delete the item from the cart and update the cart and localStorage
document.querySelectorAll(".deleteItem").forEach((deleteItem) => {
   //for each delete button
   deleteItem.addEventListener("click", () => {
      //when the user click on the delete button
      var id = deleteItem.id; //get the id of the product
      var cart = JSON.parse(localStorage.getItem("cart")); //get the cart
      cart.forEach((product, index) => {
         //for each product in the cart
         if (product.id == id) {
            //if the product id is the same as the id of the product we want to delete
            cart.splice(index, 1); //delete the product
         }
      });
      localStorage.setItem("cart", JSON.stringify(cart)); //update the cart in the localStorage
      location.reload(); //reload the page
   });
});

//if the user change the quantity of the item, update the cart and localStorage
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

//when the user click on "commander" button, post the order to the API with the cart and the contact information then redirect the user to the confirmation page
document.getElementById("order").addEventListener("click", (event) => {
   event.preventDefault();

   const firstName = document.getElementById("firstName").value;
   const lastName = document.getElementById("lastName").value;
   const email = document.getElementById("email").value;
   const city = document.getElementById("city").value;
   const address = document.getElementById("address").value;

   //clear red border and error message
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

   var formError = false;
   //check individual fields for errors
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

   if (noCart) {
      alert("Votre panier est vide");
      return;
   } else {
      var cart = JSON.parse(localStorage.getItem("cart"));
      //check if in firstName, lastName and City, there is a number, if it is, return
      if (formError == true) {
         return;
      } else if (
         //form is empty
         firstName == "" ||
         lastName == "" ||
         email == "" ||
         city == "" ||
         address == ""
      ) {
         alert("Veuillez remplir tous les champs");
         return;
      } else {
         var contact = {
            firstName,
            lastName,
            email,
            address,
            city,
         };

         var order = {
            contact: contact,
            products: cart.map((product) => {
               return product.id;
            }),
         };
         (async () => {
            const response = await fetch("http://localhost:3000/api/products/order", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(order),
            });
            //check reponse status
            if ((response.status = !200)) {
               alert("Une erreur est survenue");
            } else {
               const data = await response.json();
               localStorage.removeItem("cart");
               window.location.href = `confirmation.html?id=${data.orderId}`;
            }
         })();
      }
   }
});
