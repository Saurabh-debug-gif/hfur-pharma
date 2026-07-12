const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const adminName = localStorage.getItem("name");

if (!token) {
    window.location.href = "/login";
}

if (role !== "ADMIN") {
    alert("Access Denied");
    window.location.href = "/login";
}

document.getElementById("adminName").textContent = adminName;