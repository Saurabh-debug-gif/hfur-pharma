const adminName = localStorage.getItem("name");

if (adminName) {

    document.getElementById("adminName").textContent = adminName;

}

// Prevent non-admin users from opening the page

const role = localStorage.getItem("role");

if (role !== "ADMIN") {

    alert("Access Denied");

    window.location.href = "/login";

}