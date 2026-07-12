const API = "https://hfur-pharma-1.onrender.com/api/auth/register";

document.getElementById("registerForm")

    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const data = {

            name: document.getElementById("name").value,

            email: document.getElementById("email").value,

            password: document.getElementById("password").value,

            role: document.getElementById("role").value

        };

        try {

            const response = await axios.post(API, data);

            localStorage.setItem("token", response.data.token);

            alert("Registration Successful");

            window.location.href = "/login";

        }

        catch (error) {

            console.log(error);

            alert(error.response?.data || "Registration Failed");

        }

    });