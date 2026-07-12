// ================================
// HUFUR PHARMA LOGIN
// ================================

const API_URL = "http://localhost:8080/api/auth/login";

const loginForm = document.getElementById("loginForm");

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const loginBtn = document.getElementById("loginBtn");

/* ======================================
      SHOW / HIDE PASSWORD
====================================== */

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.classList.remove("fa-eye");

        togglePassword.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        togglePassword.classList.remove("fa-eye-slash");

        togglePassword.classList.add("fa-eye");

    }

});

/* ======================================
            LOGIN
====================================== */

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    loginBtn.disabled = true;

    loginBtn.innerHTML = "Logging in...";

    const loginData = {

        email: document.getElementById("email").value.trim(),

        password: passwordInput.value

    };

    try {

        const response = await axios.post(API_URL, loginData);

        const data = response.data;

        // Save Login Information

        localStorage.setItem("token", data.token);

        localStorage.setItem("role", data.role);

        localStorage.setItem("name", data.name);

        // Redirect

        if (data.role === "ADMIN") {

            window.location.href="/admin/dashboard";

        }

        else if (data.role === "MR") {

            window.location.href="/mr/dashboard";

        }

        else {

            window.location.href = "/customer/dashboard";

        }

    }

    catch (error) {

        console.error(error);

        let message = "Login Failed";

        if (error.response && error.response.data) {

            message = error.response.data;

        }

        alert(message);

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Login";

    }

});