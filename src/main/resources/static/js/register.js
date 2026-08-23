const API = "/api/auth/register";

document.getElementById("registerForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const data = {

            name: document.getElementById("name").value.trim(),

            email: document.getElementById("email").value.trim(),

            password: document.getElementById("password").value,

            role: document.getElementById("role").value

        };

        try {

            const response = await axios.post(API, data);

            console.log("Registration successful:", response.data);

            // ==========================================
            // SAVE LOGIN INFORMATION
            // ==========================================

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            localStorage.setItem(
                "name",
                response.data.name
            );

            localStorage.setItem(
                "email",
                data.email
            );

            // ==========================================
            // REGISTRATION SUCCESS
            // ==========================================

            alert("Registration Successful! Welcome to HFUR Pharma.");

            // ==========================================
            // OPEN CUSTOMER ACCOUNT DIRECTLY
            // ==========================================

            window.location.href = "/customer";

        }

        catch (error) {

            console.error("REGISTER ERROR:", error);

            if (error.response) {

                console.log(
                    "STATUS:",
                    error.response.status
                );

                console.log(
                    "DATA:",
                    error.response.data
                );

                const message =
                    typeof error.response.data === "string"
                        ? error.response.data
                        : "Registration Failed";

                alert(message);

            } else {

                alert(
                    "Unable to connect to server. Please try again."
                );

            }

        }

    });