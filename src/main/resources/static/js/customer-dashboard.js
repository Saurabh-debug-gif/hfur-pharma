const token = localStorage.getItem("token");
const name = localStorage.getItem("name");

if (!token) {
    window.location.href = "/login";
}

document.getElementById("customerName").textContent = name;