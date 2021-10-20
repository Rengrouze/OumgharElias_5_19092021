/* script pour confirmer à l'utilisateur que sa commande est bien passée et lui transmettre son numéro de commande*/

// le numéro de commande est dans l'url
const searchUrl = window.location.search; // on récupère l'url
const urlParams = new URLSearchParams(searchUrl); // on crée un objet URLSearchParams
var id = urlParams.get("id"); // on récupère l'id
if (id === null) {
   // il est possible que l'utilisateur arrive sur la page sans être passé par le panier

   document.getElementById("orderId").innerHTML = "Une erreur est survenue, vous allez être redirigé vers la page d'accueil"; // si l'id n'existe pas, on affiche une erreur et on redirige vers la page d'accueil
   setTimeout(function () {
      // on crée un timeout pour rediriger vers la page d'accueil
      window.location.href = "index.html"; //
   }, 5000); // on définit le temps de redirection, 5 secondes
} else {
   document.getElementById("orderId").innerHTML = id; // si on trouve l'id alors on affiche le numéro de commande
}

// Language : javascript
// Programmeur : Elias Oumghar
