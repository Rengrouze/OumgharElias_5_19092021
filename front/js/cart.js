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
   if (noCart) {
      alert("Votre panier est vide");
      return;
   } else {
      var cart = JSON.parse(localStorage.getItem("cart"));
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const city = document.getElementById("city").value;
      const address = document.getElementById("address").value;
      //check if in firstName, lastName and City, there is a number, if it is, return
      if (firstName.match(/\d/) || lastName.match(/\d/) || city.match(/\d/)) {
         alert("Votre nom, prénom et ville ne doivent pas contenir de chiffres");
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
            const data = await response.json();
            localStorage.removeItem("cart");
            window.location.href = `confirmation.html?id=${data.orderId}`;
         })();
      }
   }
});
