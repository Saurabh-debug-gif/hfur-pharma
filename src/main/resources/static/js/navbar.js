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
    const navbar = document.querySelector(".navbar");
    const navbarToggler = navbar?.querySelector(".navbar-toggler");
    const navbarMenu = document.getElementById("navbarNav");

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

    /* Bootstrap's JavaScript bundle is not loaded on every page in the
       project. This fallback keeps the shared mobile navigation functional
       everywhere without interfering on pages where Bootstrap is available. */
    if (navbarToggler && navbarMenu && !window.bootstrap) {

        const setMenuState = (open) => {
            navbarMenu.classList.toggle("show", open);
            navbarToggler.setAttribute("aria-expanded", String(open));
            navbarToggler.setAttribute(
                "aria-label",
                open ? "Close navigation menu" : "Open navigation menu"
            );
        };

        navbarToggler.addEventListener("click", () => {
            setMenuState(!navbarMenu.classList.contains("show"));
        });

        navbarMenu.querySelectorAll("a.nav-link").forEach(link => {
            link.addEventListener("click", () => setMenuState(false));
        });

        document.addEventListener("click", event => {
            if (navbarMenu.classList.contains("show") && !navbar.contains(event.target)) {
                setMenuState(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 992) setMenuState(false);
        });
    }

})();
