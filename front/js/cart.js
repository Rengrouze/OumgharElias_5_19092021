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

//get the total price of the cart
var totalPrice = 0;
cart.forEach((product) => {
   totalPrice += product.price * product.selectedQuantity;
});
document.getElementById("totalPrice").innerHTML = `${totalPrice} €`;
