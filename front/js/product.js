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

//get colors of product and display them in a list
//add item to cart and put data in localstorage
document.getElementById("addToCart").addEventListener("click", async () => {
   // add event listener to add to cart button
   const response = await fetch("http://localhost:3000/api/products/" + id); // get product by id
   const data = await response.json(); // get data from response
   const selectedColor = document.getElementById("colors").value; // get selected color
   const selectedQuantity = document.getElementById("quantity").value; // get selected quantity
   const product = {
      // create product object
      id: data._id, // set id
      name: data.name, // set name
      price: data.price, // set price
      imageUrl: data.imageUrl, // set image url
      altText: data.altText, // set alt text
      selectedColor: selectedColor, // set selected color
      selectedQuantity: parseInt(selectedQuantity), // set selected quantity
   };
   const cart = localStorage.getItem("cart"); // get cart from localstorage
   if (cart) {
      // if cart is not empty
      const cartData = JSON.parse(cart); // get data from localstorage
      cartData.push(product); // add new product to cart
      localStorage.setItem("cart", JSON.stringify(cartData)); // set new data to localstorage
   } else {
      // if cart is empty
      const cartData = []; // create new array
      cartData.push(product); // add new product to cart
      localStorage.setItem("cart", JSON.stringify(cartData)); // set new data to localstorage
   }
   alert("Le produit a bien été ajouté au panier !"); // alert user
});
// display cart in console log in json format
console.log(localStorage.getItem("cart"));
