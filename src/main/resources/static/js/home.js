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

/* ================================
   FUTURE INTERACTION SYSTEM
   Pointer light, hero depth, section state,
   compact navbar and reading progress.
================================ */

(() => {
    const page = document.body;
    if (!page.classList.contains("home-luxury")) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let scrollFrame = null;

    const updateScrollState = () => {
        const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);

        page.style.setProperty("--scroll-progress", progress.toFixed(4));
        page.classList.toggle("is-page-scrolled", window.scrollY > 36);
        scrollFrame = null;
    };

    updateScrollState();

    window.addEventListener("scroll", () => {
        if (scrollFrame !== null) return;
        scrollFrame = window.requestAnimationFrame(updateScrollState);
    }, { passive: true });

    window.addEventListener("resize", updateScrollState, { passive: true });

    if (finePointer && !reduceMotion) {
        document.addEventListener("pointermove", event => {
            page.style.setProperty("--pointer-x", `${event.clientX}px`);
            page.style.setProperty("--pointer-y", `${event.clientY}px`);

            const card = event.target.closest(
                ".capability-card, .process-step, .mfg-card, .feature-card, .testimonial-card, .location-card"
            );

            if (card) {
                const bounds = card.getBoundingClientRect();
                card.style.setProperty("--card-spot-x", `${event.clientX - bounds.left}px`);
                card.style.setProperty("--card-spot-y", `${event.clientY - bounds.top}px`);
                card.dataset.futureCard = "active";
            }
        }, { passive: true });

        const hero = document.querySelector(".hero");
        const heroVisual = document.querySelector(".hero-visual");

        if (hero && heroVisual) {
            hero.addEventListener("pointermove", event => {
                const bounds = hero.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                heroVisual.style.setProperty("--hero-shift-x", `${x * 13}px`);
                heroVisual.style.setProperty("--hero-shift-y", `${y * 10}px`);
            }, { passive: true });

            hero.addEventListener("pointerleave", () => {
                heroVisual.style.setProperty("--hero-shift-x", "0px");
                heroVisual.style.setProperty("--hero-shift-y", "0px");
            });
        }
    }

    const futureSections = document.querySelectorAll(
        "#featured, .slider-section, .company-system, #about, .process-section, .manufacturing-section, .why-section, .testimonials, .faq-section, .location-section, #contact"
    );

    futureSections.forEach((section, index) => {
        section.dataset.futureSection = String(index + 1).padStart(2, "0");
    });

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle("is-section-active", entry.isIntersecting);
            });
        }, { threshold: 0.08, rootMargin: "-12% 0px -12% 0px" });

        futureSections.forEach(section => sectionObserver.observe(section));
    }
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
        ".section-head",
        ".section-toolbar",
        ".medicine-category-console",
        ".contact-wrap",
        ".cta-banner .inner",
        ".trust-item",
        ".cert-item",
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

    const counterEls = document.querySelectorAll(
        ".hero-stats .stat b, .about-stat-card b, [data-future-counter]"
    );

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

/* ================================
   TESTIMONIAL CAROUSEL
   Controlled movement on desktop and
   native touch swiping on mobile.
================================ */

(() => {
    const track = document.getElementById("testimonialTrack");
    const previous = document.getElementById("testimonialPrev");
    const next = document.getElementById("testimonialNext");

    if (!track || !previous || !next) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let automaticMove = null;

    const cardStep = () => {
        const firstCard = track.firstElementChild;
        if (!firstCard) return track.clientWidth;

        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
        return firstCard.getBoundingClientRect().width + gap;
    };

    const move = direction => {
        const maximum = Math.max(track.scrollWidth - track.clientWidth, 0);
        const nearEnd = track.scrollLeft >= maximum - 8;
        const nearStart = track.scrollLeft <= 8;

        if (direction > 0 && nearEnd) {
            track.scrollTo({ left: 0, behavior: "smooth" });
        } else if (direction < 0 && nearStart) {
            track.scrollTo({ left: maximum, behavior: "smooth" });
        } else {
            track.scrollBy({ left: cardStep() * direction, behavior: "smooth" });
        }
    };

    const stopAutomaticMove = () => {
        if (automaticMove !== null) {
            window.clearInterval(automaticMove);
            automaticMove = null;
        }
    };

    const startAutomaticMove = () => {
        stopAutomaticMove();
        if (reduceMotion) return;
        automaticMove = window.setInterval(() => move(1), 4800);
    };

    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    track.addEventListener("pointerenter", stopAutomaticMove);
    track.addEventListener("pointerleave", startAutomaticMove);
    track.addEventListener("focusin", stopAutomaticMove);
    track.addEventListener("focusout", startAutomaticMove);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAutomaticMove();
        else startAutomaticMove();
    });

    startAutomaticMove();
})();

// =====================================================
// MEDICINE INTELLIGENCE HUB
// Uses the existing public API and medicine detail routes.
// Adds loading, search and category filtering only on the frontend.
// =====================================================

(async function () {
    const API = "/api/public/medicines";
    const topContainer = document.getElementById("topMedicineContainer");
    const sliderContainer = document.getElementById("sliderContainer");
    const liveCount = document.getElementById("medicineLiveCount");
    const searchInput = document.getElementById("medicineSearch");
    const categoryConsole = document.getElementById("medicineCategoryFilters");
    const spotlight = document.getElementById("medicineSpotlight");

    if (!topContainer && !sliderContainer) return;

    let medicines = [];
    let activeCategory = "all";
    let searchTerm = "";
    let searchTimer = null;

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

    const getCategory = medicine => {
        if (medicine?.category && typeof medicine.category === "object") {
            return String(medicine.category.name || "Pharmaceutical Care").trim();
        }

        if (typeof medicine?.category === "string" && medicine.category.trim()) {
            return medicine.category.trim();
        }

        return "Pharmaceutical Care";
    };

    const medicineDetailUrl = medicine => {
        const id = Number(medicine?.id);
        return Number.isFinite(id) ? `/medicine/${id}` : "/medicines";
    };

    const getStockState = medicine => {
        const stock = Number(medicine?.stock) || 0;

        if (stock <= 0) {
            return {
                className: "is-unavailable",
                label: "Unavailable",
                detail: "Contact our team for availability"
            };
        }

        if (stock <= 10) {
            return {
                className: "is-low",
                label: "Low stock",
                detail: `${stock} units currently available`
            };
        }

        return {
            className: "is-available",
            label: "In stock",
            detail: `${stock} units currently available`
        };
    };

    const renderSpotlight = medicine => {
        if (!spotlight) return;

        if (!medicine) {
            spotlight.hidden = true;
            spotlight.innerHTML = "";
            return;
        }

        const medicineName = medicine.name || "Medicine";
        const category = getCategory(medicine);
        const stockState = getStockState(medicine);

        spotlight.hidden = false;
        spotlight.innerHTML = `
            <div class="medicine-spotlight-visual">
                <span class="spotlight-kicker">
                    <i class="fa-solid fa-dna"></i> Featured Medicine Focus
                </span>
                <span class="spotlight-orbit spotlight-orbit-one" aria-hidden="true"></span>
                <span class="spotlight-orbit spotlight-orbit-two" aria-hidden="true"></span>
                <span class="spotlight-scan" aria-hidden="true"></span>
                <img src="${safeImageUrl(medicine.imageUrl)}"
                     alt="${escapeHtml(medicineName)}"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='https://dummyimage.com/500x500/ecf8f1/087b52&text=Medicine'">
            </div>

            <div class="medicine-spotlight-copy">
                <span class="medicine-category">${escapeHtml(category)}</span>
                <h3>${escapeHtml(medicineName)}</h3>
                <p>${escapeHtml(medicine.brand || "Hfur Pharma")}</p>

                <div class="spotlight-assurance">
                    <span class="medicine-stock ${stockState.className}">
                        <i></i>${stockState.label}
                    </span>
                    <span><i class="fa-solid fa-shield-heart"></i> Quality verified</span>
                    <small>${escapeHtml(stockState.detail)}</small>
                </div>

                <div class="spotlight-footer">
                    <div>
                        <small>Medicine price</small>
                        <strong>₹${escapeHtml(medicine.price)}</strong>
                    </div>
                    <a href="${medicineDetailUrl(medicine)}"
                       class="btn btn-success"
                       aria-label="View ${escapeHtml(medicineName)} details">
                        Explore Medicine <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>`;
    };

    const updateCount = (visible, total = medicines.length) => {
        if (!liveCount) return;

        if (!total) {
            liveCount.textContent = "No medicines are currently listed";
        } else if (visible !== total) {
            liveCount.textContent = `${visible} matching medicines · ${total} total online`;
        } else {
            liveCount.textContent = `${total} medicines online · Quality verified`;
        }
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
                    const delay = Number(entry.target.dataset.cardIndex || 0) * 70;
                    window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
                    cardObserver.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });

            cards.forEach(card => cardObserver.observe(card));
        }

        if (window.matchMedia("(pointer: fine)").matches) {
            cards.forEach(card => {
                card.addEventListener("pointermove", event => {
                    const bounds = card.getBoundingClientRect();
                    const pointerX = event.clientX - bounds.left;
                    const pointerY = event.clientY - bounds.top;
                    const rotateY = ((pointerX / bounds.width) - 0.5) * 9;
                    const rotateX = -((pointerY / bounds.height) - 0.5) * 7;

                    card.style.setProperty("--spot-x", `${pointerX}px`);
                    card.style.setProperty("--spot-y", `${pointerY}px`);
                    card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
                    card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
                }, { passive: true });

                card.addEventListener("pointerleave", () => {
                    card.style.setProperty("--tilt-x", "0deg");
                    card.style.setProperty("--tilt-y", "0deg");
                });
            });
        }
    };

    const getFilteredMedicines = () => medicines.filter(medicine => {
        const category = getCategory(medicine);
        const matchesCategory = activeCategory === "all" || category === activeCategory;
        const searchable = `${medicine?.name || ""} ${medicine?.brand || ""} ${category}`.toLowerCase();
        const matchesSearch = !searchTerm || searchable.includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    const renderFeatured = () => {
        if (!topContainer) return;

        const filtered = getFilteredMedicines();
        const featured = filtered.slice(0, 8);
        updateCount(filtered.length);
        renderSpotlight(filtered[0]);

        if (!featured.length) {
            topContainer.innerHTML = `
                <div class="col-12 medicine-result-state">
                    <i class="fa-solid fa-capsules" aria-hidden="true"></i>
                    <strong>No matching medicine found</strong>
                    <span>Try another medicine name or category.</span>
                </div>`;
            return;
        }

        topContainer.innerHTML = featured.map((medicine, index) => {
            const stockState = getStockState(medicine);
            const category = getCategory(medicine);
            const medicineName = medicine.name || "Medicine";

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
                            <span class="medicine-stock ${stockState.className}">
                                <i></i>${stockState.label}
                            </span>
                        </div>

                        <div class="medicine-image-stage">
                            <span class="medicine-orbit" aria-hidden="true"></span>
                            <img src="${safeImageUrl(medicine.imageUrl)}"
                                 alt="${escapeHtml(medicineName)}"
                                 loading="lazy"
                                 onerror="this.onerror=null;this.src='https://dummyimage.com/300x300/08271e/e8ca78&text=Medicine'">
                        </div>

                        <div class="medicine-card-body d-flex flex-column">
                            <span class="medicine-category">${escapeHtml(category)}</span>
                            <h5>${escapeHtml(medicineName)}</h5>
                            <p>${escapeHtml(medicine.brand || "")}</p>

                            <div class="medicine-card-footer">
                                <div class="price">₹${escapeHtml(medicine.price)}</div>
                                <a href="${medicineDetailUrl(medicine)}"
                                   class="btn btn-success"
                                   aria-label="View ${escapeHtml(medicineName)} details">
                                    View Details <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </div>
                        </div>
                    </article>
                </div>`;
        }).join("");

        activateMedicineCards();
    };

    const renderCategoryFilters = () => {
        if (!categoryConsole) return;

        const categories = [...new Set(medicines.map(getCategory))]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));

        categoryConsole.innerHTML = ["all", ...categories].map(category => {
            const label = category === "all" ? "All Medicines" : category;
            const selected = category === activeCategory;

            return `
                <button type="button"
                        class="medicine-filter ${selected ? "is-active" : ""}"
                        data-medicine-category="${encodeURIComponent(category)}"
                        aria-pressed="${selected}">
                    ${escapeHtml(label)}
                </button>`;
        }).join("");
    };

    const renderSlider = () => {
        if (!sliderContainer) return;

        if (!medicines.length) {
            sliderContainer.innerHTML = "";
            return;
        }

        const sliderMedicines = [...medicines, ...medicines];

        sliderContainer.innerHTML = sliderMedicines.map((medicine, index) => `
            <a class="slider-card"
               href="${medicineDetailUrl(medicine)}"
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
    };

    if (topContainer) {
        topContainer.innerHTML = Array.from({ length: 4 }, (_, index) => `
            <div class="col-xl-3 col-lg-4 col-md-6 medicine-grid-item" aria-hidden="true">
                <div class="medicine-skeleton-card" style="--skeleton-delay:${index * 90}ms">
                    <span class="skeleton-line skeleton-label"></span>
                    <span class="skeleton-image"></span>
                    <span class="skeleton-line"></span>
                    <span class="skeleton-line skeleton-line-short"></span>
                </div>
            </div>`).join("");
    }

    if (categoryConsole) {
        categoryConsole.addEventListener("click", event => {
            const button = event.target.closest("[data-medicine-category]");
            if (!button) return;

            activeCategory = decodeURIComponent(button.dataset.medicineCategory || "all");
            renderCategoryFilters();
            renderFeatured();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            window.clearTimeout(searchTimer);
            searchTimer = window.setTimeout(() => {
                searchTerm = searchInput.value.trim().toLowerCase();
                renderFeatured();
            }, 120);
        });
    }

    try {
        const response = await axios.get(API);

        if (Array.isArray(response.data)) {
            medicines = response.data;
        } else if (Array.isArray(response.data?.content)) {
            medicines = response.data.content;
        }

        renderCategoryFilters();
        renderFeatured();
        renderSlider();
    } catch (error) {
        console.error("Unable to load medicines", error);

        if (liveCount) liveCount.textContent = "Catalogue connection unavailable";

        if (topContainer) {
            topContainer.innerHTML = `
                <div class="col-12 medicine-result-state">
                    <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                    <strong>Medicines could not be loaded</strong>
                    <span>Please refresh the page or open the full catalogue.</span>
                    <a class="btn btn-outline-success" href="/medicines">Open All Medicines</a>
                </div>`;
        }
    }
})();
