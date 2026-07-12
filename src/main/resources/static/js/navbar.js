(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const loginNav = document.getElementById("loginNav");
    const registerNav = document.getElementById("registerNav");
    const dashboardNav = document.getElementById("dashboardNav");
    const logoutNav = document.getElementById("logoutNav");
    const dashboardLink = document.getElementById("dashboardLink");
    const cartNav = document.getElementById("cartNav");
    const enquiryNav = document.getElementById("enquiryNav");

    if (token) {

        loginNav?.classList.add("d-none");
        registerNav?.classList.add("d-none");

        dashboardNav?.classList.remove("d-none");
        logoutNav?.classList.remove("d-none");

        if (role === "CUSTOMER") {
            cartNav?.classList.remove("d-none");
            enquiryNav?.classList.remove("d-none");
        }

        if (dashboardLink) {

            switch(role){

                case "ADMIN":
                    dashboardLink.href="/admin/dashboard";
                    break;

                case "CUSTOMER":
                    dashboardLink.href="/customer/dashboard";
                    break;

                case "MR":
                    dashboardLink.href="/mr/dashboard";
                    break;
            }

        }

    }

    window.logout = function(){

        localStorage.clear();

        window.location.href="/login";

    };

})();