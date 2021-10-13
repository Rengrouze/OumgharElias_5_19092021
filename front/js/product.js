const searchUrl = window.location.search; // get base url
const urlParams = new URLSearchParams(searchUrl); // get params
const id = urlParams.get("id"); // get product id
(async () => {
   const response = await fetch("http://localhost:3000/api/products/" + id); // get product by id
   if (response.status != 200) {
      // if status is not 200  send an error
      alert("Error: " + response.status);
   }
   const data = await response.json();
   // get data from response then display them
   document.getElementById("image").src = data.imageUrl; // set image
   document.getElementById("image").alt = data.altText; // set alt text
   document.getElementById("title").innerHTML = data.name; // set title
   document.getElementById("price").innerHTML = data.price; // set price
   document.getElementById("description").innerHTML = data.description; // set description
   data.colors.forEach((color) => {
      // loop through colors
      document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`; // add color to select
   });
})();

// when the user click on add to cart button, check the cart in local storage, if the product with the same id and selected color is already in the cart, just increment the selected quantity, otherwise add the product to the cart with the name, price, id, description,  selected color and selected quantity
document.getElementById("addToCart").addEventListener("click", () => {
   let cart = JSON.parse(localStorage.getItem("cart")); // get cart from local storage
   if (cart == null) {
      // if cart is null
      cart = []; // create new cart
   }
   let found = false; // found is false
   cart.forEach((product) => {
      // loop through the cart
      if (product.id == id && product.color == document.getElementById("colors").value) {
         // if the product with the same id and selected color is already in the cart
         selectedQuantity = parseInt(document.getElementById("quantity").value); // get selected quantity
         //add selected quantity to the product in the cart
         product.quantity += selectedQuantity;

         found = true; // found is true
      }
   });
   if (!found) {
      // if the product with the same id and selected color is not in the cart
      cart.push({
         // add the product to the cart with the name, price, id, description,  selected color and selected quantity
         name: document.getElementById("title").innerHTML,
         price: document.getElementById("price").innerHTML,
         id: id,
         imageUrl: document.getElementById("image").src, // set image
         altText: document.getElementById("image").alt,
         description: document.getElementById("description").innerHTML,
         color: document.getElementById("colors").value,
         quantity: parseInt(document.getElementById("quantity").value),
      });
   }
   localStorage.setItem("cart", JSON.stringify(cart)); // set cart in local storage
   alert("Le produit a bien été ajouté au panier !"); // alert the user
});
