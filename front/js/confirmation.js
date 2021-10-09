//get order id from local storage and display it
var orderId = localStorage.getItem("orderId");
document.getElementById("orderId").innerHTML = orderId;
//clear local storage
localStorage.clear();
