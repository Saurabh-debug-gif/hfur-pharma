const name = localStorage.getItem("name");

if(!localStorage.getItem("token")){

    window.location.href="/login";

}

document.getElementById("customerName").innerHTML=name;