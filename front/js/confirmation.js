/* script pour confirmer à l'utilisateur que sa commande est bien passée et lui transmettre son numéro de commande*/

// le numéro de commande est dans l'url
const searchUrl = window.location.search; // on récupère l'url
const urlParams = new URLSearchParams(searchUrl); // on crée un objet URLSearchParams
const id = urlParams.get("id"); // on récupère l'id
document.getElementById("orderId").innerHTML = id; // on affiche l'id dans le html

// Language : javascript
// Programmeur : Elias Oumghar
