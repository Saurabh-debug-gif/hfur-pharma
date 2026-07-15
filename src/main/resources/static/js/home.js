/* ================================
   HFUR PHARMA — HOME PAGE ENHANCEMENTS
   Scroll reveal, animated counters,
   floating WhatsApp button, back-to-top.
   Purely presentational — does not touch
   any existing data, numbers, or logic.
================================ */

(() => {

    /* ============================
       SCROLL REVEAL
    ============================ */

    const revealSelectors = [
        ".mfg-card",
        ".feature-card",
        ".testimonial-card",
        ".process-step",
        ".faq-item",
        ".capability-card",
        ".location-card",
        ".about-copy",
        ".about-visual",
        "[data-reveal]"
    ];

    const revealEls = document.querySelectorAll(revealSelectors.join(","));

    revealEls.forEach(el => el.classList.add("reveal-init"));

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry, i) => {

                if (entry.isIntersecting) {

                    setTimeout(() => {
                        entry.target.classList.add("reveal-in");
                    }, (i % 4) * 90);

                    observer.unobserve(entry.target);
                }

            });

        }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

        revealEls.forEach(el => observer.observe(el));

    } else {
        revealEls.forEach(el => el.classList.add("reveal-in"));
    }

    /* ============================
       ANIMATED STAT COUNTERS
       (animates the existing number,
       never changes the final value)
    ============================ */

    const counterEls = document.querySelectorAll(".hero-stats .stat b, .about-stat-card b");

    counterEls.forEach(el => {

        const raw = el.textContent.trim();
        const match = raw.match(/^(\d+)(.*)$/);

        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = match[2] || "";

        el.textContent = "0" + suffix;

        let started = false;

        const runCount = () => {

            if (started) return;
            started = true;

            const duration = 1200;
            const startTime = performance.now();

            function tick(now) {

                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(eased * target);

                el.textContent = value + suffix;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }

            requestAnimationFrame(tick);
        };

        if ("IntersectionObserver" in window) {

            const counterObserver = new IntersectionObserver((entries) => {

                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        runCount();
                        counterObserver.unobserve(entry.target);
                    }
                });

            }, { threshold: 0.4 });

            counterObserver.observe(el);

        } else {
            runCount();
        }

    });

    /* ============================
       BACK TO TOP BUTTON
    ============================ */

    const toTop = document.createElement("button");
    toTop.type = "button";
    toTop.className = "back-to-top";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(toTop);

    toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            toTop.classList.add("show");
        } else {
            toTop.classList.remove("show");
        }
    }, { passive: true });

})();
// =====================================================
// LOAD FEATURED MEDICINES ON HOME PAGE
// =====================================================

(async function () {

    const API = "/api/public/medicines";

    const topContainer = document.getElementById("topMedicineContainer");
    const sliderContainer = document.getElementById("sliderContainer");

    if (!topContainer && !sliderContainer) return;

    try {

        const response = await axios.get(API);

        let medicines = [];

        if (Array.isArray(response.data)) {

            medicines = response.data;

        } else if (response.data.content) {

            medicines = response.data.content;

        }

        // -----------------------------
        // Featured Medicines
        // -----------------------------

        if (topContainer) {

            topContainer.innerHTML = "";

            medicines.slice(0, 8).forEach(m => {

                topContainer.innerHTML += `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">

                    <div class="medicine-card">

                        <img
                            src="${m.imageUrl || 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image'}"
                            alt="${m.name || 'Medicine'}"
                            onerror="this.src='https://dummyimage.com/300x300/cccccc/000000&text=No+Image'">

                        <div class="medicine-card-body d-flex flex-column">

                            <h5>${m.name}</h5>

                            <p>${m.brand ?? ""}</p>

                            <div class="price mb-3">₹${m.price}</div>

                            <a href="/medicine/${m.id}"
                               class="btn btn-success mt-auto">

                                View Details

                            </a>

                        </div>

                    </div>

                </div>
                `;

            });

        }

        // -----------------------------
        // Medicine Slider
        // -----------------------------

        if (sliderContainer) {

            sliderContainer.innerHTML = "";

            medicines.forEach(m => {

                sliderContainer.innerHTML += `
                <a class="slider-card" href="/medicine/${m.id}">

                        <img
                            src="${m.imageUrl || 'https://dummyimage.com/250x250/cccccc/000000&text=No+Image'}"
                            alt="${m.name || 'Medicine'}"
                            onerror="this.src='https://dummyimage.com/250x250/cccccc/000000&text=No+Image'">

                    <h6>${m.name}</h6>
                    <span class="slider-price">₹${m.price}</span>
                </a>
                `;

            });

        }

    }

    catch (e) {

        console.error("Unable to load medicines", e);

    }

})();
