//get what's in the cart and display it
var cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);
cart.forEach((product) => {
   console.log(product);
   document.getElementById("cart__items").innerHTML += `
    <article class="cart__item" data-id="${product.id}">
    <div class="cart__item__img">
       <img src="${product.imageUrl}" alt="${product.altTxt}" />
    </div>
    <div class="cart__item__content">
       <div class="cart__item__content__titlePrice">
          <h2>${product.name} -- Couleur : ${product.selectedColor}</h2>
          <p>${product.price} €</p>
       </div>
       <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
             <p>Qté :</p>
             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.selectedQuantity}" />
          </div>
          <div class="cart__item__content__settings__delete">
             <p class="deleteItem">Supprimer</p>
          </div>
       </div>
    </div>
 </article>
           `;
});
//get the total items of the cart
var totalItems = 0;
cart.forEach((product) => {
   totalItems += product.selectedQuantity;
});
document.getElementById("totalQuantity").innerHTML = `${totalItems}`;
//get the total price of the cart
var totalPrice = 0;
cart.forEach((product) => {
   totalPrice += product.price * product.selectedQuantity;
});
document.getElementById("totalPrice").innerHTML = `${totalPrice} €`;

//if the user click on the delete button, delete the item from the cart and update the cart and localStorage
document.querySelectorAll(".deleteItem").forEach((deleteItem) => {
   //for each delete button
   deleteItem.addEventListener("click", () => {
      //when the user click on the delete button
      var id = deleteItem.parentElement.parentElement.parentElement.dataset.id; //get the id of the product
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