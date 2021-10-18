//get order id from url
const searchUrl = window.location.search; // get base url
const urlParams = new URLSearchParams(searchUrl); // get params
const id = urlParams.get("id");
document.getElementById("orderId").innerHTML = id;
