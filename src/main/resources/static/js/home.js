/* ================================
   HFUR PHARMA — HOME PAGE ENHANCEMENTS
   Scroll reveal, animated counters,
   floating WhatsApp button, back-to-top.
   Purely presentational — does not touch
   any existing data, numbers, or logic.
================================ */

/* ================================
   CINEMATIC INTRO
   Runs once per browser session and
   automatically respects reduced motion.
================================ */

(() => {
    const intro = document.getElementById("siteIntro");
    if (!intro) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let introSeen = false;

    try {
        introSeen = sessionStorage.getItem("hfurIntroSeen") === "true";
    } catch (error) {
        introSeen = false;
    }

    if (reduceMotion || introSeen) {
        intro.remove();
        return;
    }

    document.body.classList.add("intro-active");

    const closeIntro = () => {
        if (!intro.isConnected || intro.classList.contains("intro-exit")) return;

        intro.classList.add("intro-exit");
        document.body.classList.remove("intro-active");

        try {
            sessionStorage.setItem("hfurIntroSeen", "true");
        } catch (error) {
            // The animation still works when browser storage is unavailable.
        }

        window.setTimeout(() => intro.remove(), 800);
    };

    window.setTimeout(closeIntro, 2050);
    intro.addEventListener("click", closeIntro);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeIntro();
    }, { once: true });
})();

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

    const escapeHtml = value => String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const safeImageUrl = value => {
        const url = String(value ?? "").trim();
        if (url.startsWith("/") || /^https?:\/\//i.test(url)) return escapeHtml(url);
        return "https://dummyimage.com/300x300/08271e/e8ca78&text=Medicine";
    };

    const activateMedicineCards = () => {
        const cards = document.querySelectorAll("[data-medicine-card]");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion || !("IntersectionObserver" in window)) {
            cards.forEach(card => card.classList.add("is-visible"));
        } else {
            const cardObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const delay = Number(entry.target.dataset.cardIndex || 0) * 80;
                    window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
                    cardObserver.unobserve(entry.target);
                });
            }, { threshold: 0.16, rootMargin: "0px 0px -35px 0px" });

            cards.forEach(card => cardObserver.observe(card));
        }

        if (window.matchMedia("(pointer: fine)").matches) {
            cards.forEach(card => {
                card.addEventListener("pointermove", event => {
                    const bounds = card.getBoundingClientRect();
                    card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
                    card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
                });
            });
        }
    };

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

            topContainer.innerHTML = medicines.slice(0, 8).map((medicine, index) => {
                const id = Number(medicine.id);
                const stock = Number(medicine.stock) || 0;
                const inStock = stock > 0;
                const category = medicine.category?.name || "Pharmaceutical Care";

                return `
                    <div class="col-xl-3 col-lg-4 col-md-6 medicine-grid-item">
                        <article class="medicine-card medicine-vault-card"
                                 data-medicine-card
                                 data-card-index="${index}">
                            <span class="medicine-scan" aria-hidden="true"></span>

                            <div class="medicine-card-topline">
                                <span class="medicine-label">
                                    <i class="fa-solid fa-microscope"></i> Featured Medicine
                                </span>
                                <span class="medicine-stock ${inStock ? "is-available" : "is-enquiry"}">
                                    <i></i>${inStock ? "In stock" : "Enquire"}
                                </span>
                            </div>

                            <div class="medicine-image-stage">
                                <span class="medicine-orbit" aria-hidden="true"></span>
                                <img src="${safeImageUrl(medicine.imageUrl)}"
                                     alt="${escapeHtml(medicine.name || "Medicine")}"
                                     loading="lazy"
                                     onerror="this.onerror=null;this.src='https://dummyimage.com/300x300/08271e/e8ca78&text=Medicine'">
                            </div>

                            <div class="medicine-card-body d-flex flex-column">
                                <span class="medicine-category">${escapeHtml(category)}</span>
                                <h5>${escapeHtml(medicine.name || "Medicine")}</h5>
                                <p>${escapeHtml(medicine.brand || "")}</p>

                                <div class="medicine-card-footer">
                                    <div class="price">₹${escapeHtml(medicine.price)}</div>
                                    <a href="/medicine/${id}"
                                       class="btn btn-success"
                                       aria-label="View ${escapeHtml(medicine.name || "medicine")} details">
                                        View Details <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </a>
                                </div>
                            </div>
                        </article>
                    </div>`;
            }).join("");

            activateMedicineCards();

        }

        // -----------------------------
        // Medicine Slider
        // -----------------------------

        if (sliderContainer) {

            sliderContainer.innerHTML = "";

            const sliderMedicines = medicines.length ? [...medicines, ...medicines] : [];

            sliderContainer.innerHTML = sliderMedicines.map((medicine, index) => `
                <a class="slider-card"
                   href="/medicine/${Number(medicine.id)}"
                   ${index >= medicines.length ? 'aria-hidden="true" tabindex="-1"' : ""}>
                    <span class="slider-card-glow" aria-hidden="true"></span>
                    <img src="${safeImageUrl(medicine.imageUrl)}"
                         alt="${escapeHtml(medicine.name || "Medicine")}"
                         loading="lazy"
                         onerror="this.onerror=null;this.src='https://dummyimage.com/250x250/08271e/e8ca78&text=Medicine'">
                    <span class="slider-card-copy">
                        <h6>${escapeHtml(medicine.name || "Medicine")}</h6>
                        <span class="slider-price">₹${escapeHtml(medicine.price)}</span>
                    </span>
                </a>`).join("");

        }

    }

    catch (e) {

        console.error("Unable to load medicines", e);

    }

})();
