/*
|--------------------------------------------------------------------------
| Anime Store Dakar
| Main JavaScript
|--------------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Anime Store Dakar - JavaScript chargé.");

     /* Sprint 1ter — Loader (en premier) */
    initializeSiteLoader();

    initializeDarkMode();
    initializeThemeButtons();
    initializeMobileMenu();
    initializeScrollStroke();
    initializeProductParallax();

    /* Sprint 1 */
    initializeScrollReveal();
    initializeHeaderScroll();
    initializeWhatsappFloat();

     /* Sprint 1bis — Spotlight navbar */
    initializeSpotlightNavbar();

      initializeSearchOverlay();

         /* Sprint 3 — Team reveal */
    initializeFlipFadeText();
    initializeTeamReveal();
    /* Sprint 3bis — Highlight carte équipe si ancre dans l'URL */
    initializeTeamAnchorHighlight();

    /* Sprint 3ter — Image trail (hero / parallax) */
    initializeImageTrail();

     /* Sprint 4 — Aurora + 3D tilt */
    initializeAuroraMouse();
    initialize3DTilt();

    /* Sprint 6 — Cover Flow 3D */
    initializeCoverflow();


});


/*
|--------------------------------------------------------------------------
| Dark Mode
|--------------------------------------------------------------------------
*/

function initializeDarkMode() {
    const html = document.documentElement;

    const savedTheme = localStorage.getItem("anime-store-theme");

    if (savedTheme === "dark") {
        html.classList.add("dark");
    } else if (savedTheme === "light") {
        html.classList.remove("dark");
    } else {
        const prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (prefersDarkMode) {
            html.classList.add("dark");
        }
    }

    updateThemeColor();
}


function toggleDarkMode() {
    const html = document.documentElement;

    html.classList.toggle("dark");

    const currentTheme = html.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("anime-store-theme", currentTheme);
    updateThemeIcons();
    updateThemeColor();
}


function initializeThemeButtons() {
    const themeButtons = document.querySelectorAll("[data-theme-toggle]");

    themeButtons.forEach((button) => {
        button.addEventListener("click", toggleDarkMode);
    });

    updateThemeIcons();
}


function updateThemeIcons() {
    const isDarkMode = document.documentElement.classList.contains("dark");
    const icons = document.querySelectorAll("[data-theme-icon]");
    const buttons = document.querySelectorAll("[data-theme-toggle]");

    icons.forEach((icon) => {
        icon.textContent = isDarkMode ? "☀" : "☾";
    });

    buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(isDarkMode));
        button.setAttribute(
            "aria-label",
            isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"
        );
    });
}


function updateThemeColor() {
    const themeColor = document.querySelector("[data-theme-color]");

    if (!themeColor) {
        return;
    }

    const isDarkMode = document.documentElement.classList.contains("dark");
    themeColor.setAttribute("content", isDarkMode ? "#1F2235" : "#6491A6");
}


/*
|--------------------------------------------------------------------------
| Navigation mobile
|--------------------------------------------------------------------------
*/

function initializeMobileMenu() {
    const menu = document.querySelector("[data-mobile-menu]");
    const button = document.querySelector("[data-mobile-menu-button]");
    const icon = document.querySelector("[data-mobile-menu-icon]");

    if (!menu || !button || !icon) {
        return;
    }

    button.addEventListener("click", () => {
        const isOpen = !menu.classList.contains("hidden");

        setMobileMenuState(!isOpen, menu, button, icon);
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMobileMenuState(false, menu, button, icon);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMobileMenuState(false, menu, button, icon);
        }
    });
}


function setMobileMenuState(isOpen, menu, button, icon) {
    menu.classList.toggle("hidden", !isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );
    icon.textContent = isOpen ? "×" : "☰";
}


/*
|--------------------------------------------------------------------------
| Trait animé au scroll
|--------------------------------------------------------------------------
*/

function initializeScrollStroke() {
    const sections = document.querySelectorAll("[data-scroll-stroke-section]");

    if (!sections.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    sections.forEach((section) => {
        const path = section.querySelector("[data-scroll-stroke-path]");

        if (!path) {
            return;
        }

        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = prefersReducedMotion ? 0 : length;
        path.dataset.strokeLength = String(length);
    });

    if (prefersReducedMotion) {
        return;
    }

    const updatePaths = () => {
        sections.forEach((section) => {
            const path = section.querySelector("[data-scroll-stroke-path]");

            if (!path) {
                return;
            }

            const length = Number(path.dataset.strokeLength);
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const progress = clamp(
                (viewportHeight - rect.top) / (rect.height + viewportHeight),
                0,
                1
            );

            path.style.strokeDashoffset = String(length * (1 - progress));
        });
    };

    updatePaths();
    window.addEventListener("scroll", updatePaths, { passive: true });
    window.addEventListener("resize", updatePaths);
}


function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


/*
|--------------------------------------------------------------------------
| Parallax produits
|--------------------------------------------------------------------------
*/

function initializeProductParallax() {
    const galleries = document.querySelectorAll("[data-product-parallax]");

    if (!galleries.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        return;
    }

    const updateGalleries = () => {
        galleries.forEach((gallery) => {
            const rect = gallery.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const progress = clamp(
                (viewportHeight - rect.top) / (rect.height + viewportHeight),
                0,
                1
            );

            gallery.querySelectorAll("[data-product-parallax-column]").forEach((column) => {
                const speed = Number(column.dataset.speed || 1);
                const distance = viewportHeight * speed;

                column.style.setProperty(
                    "--parallax-y",
                    `${progress * distance}px`
                );
            });
        });
    };

    updateGalleries();
    window.addEventListener("scroll", updateGalleries, { passive: true });
    window.addEventListener("resize", updateGalleries);
}


/* =========================================================================
   ▓▓▓ SPRINT 1 — AJOUTS (rien au-dessus n'a été touché) ▓▓▓
   ========================================================================= */


/* -------------------------------------------------------------------------
   S1.1 — Animations au scroll (reveal / reveal-stagger)
   ------------------------------------------------------------------------- */

function initializeScrollReveal() {
    const targets = document.querySelectorAll(".reveal, .reveal-stagger");
    if (targets.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        targets.forEach((el) => el.classList.add("reveal-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
    });

    targets.forEach((el) => observer.observe(el));
}


/* -------------------------------------------------------------------------
   S1.2 — Header dynamique au scroll
   ------------------------------------------------------------------------- */

function initializeHeaderScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}


/* -------------------------------------------------------------------------
   S1.3 — Bouton WhatsApp flottant
   ------------------------------------------------------------------------- */

function initializeWhatsappFloat() {
    const btn = document.getElementById("whatsapp-float");
    if (!btn) return;

    setTimeout(() => btn.classList.add("visible"), 1500);

    const body = document.body;
    const observer = new MutationObserver(() => {
        if (body.classList.contains("cart-open")) {
            btn.classList.remove("visible");
        } else {
            btn.classList.add("visible");
        }
    });
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
}


/*
|--------------------------------------------------------------------------
| Exposition globale
|--------------------------------------------------------------------------
*/
/* -------------------------------------------------------------------------
   S1bis — Spotlight navbar (halo qui suit la souris)
   ------------------------------------------------------------------------- */

function initializeSpotlightNavbar() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const layer = header.querySelector(".spotlight-layer");
    if (!layer) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let rafId = null;
    let pendingEvent = null;

    const updateSpotlight = () => {
        if (!pendingEvent) return;
        const rect = header.getBoundingClientRect();
        const x = pendingEvent.clientX - rect.left;
        const y = pendingEvent.clientY - rect.top;
        header.style.setProperty("--spotlight-x", `${x}px`);
        header.style.setProperty("--spotlight-y", `${y}px`);
        rafId = null;
        pendingEvent = null;
    };

    header.addEventListener("mouseenter", () => {
        header.classList.add("spotlight-active");
    });

    header.addEventListener("mousemove", (event) => {
        pendingEvent = event;
        if (rafId === null) {
            rafId = requestAnimationFrame(updateSpotlight);
        }
    });

    header.addEventListener("mouseleave", () => {
        header.classList.remove("spotlight-active");
    });
}

/* -------------------------------------------------------------------------
   S1ter — Kinetic Text Loader
   ------------------------------------------------------------------------- */

function initializeSiteLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;

    /* Respect de la préférence "reduce motion" */
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        loader.remove();
        return;
    }

    /* Ne montrer le loader qu'une seule fois par session */
    if (sessionStorage.getItem("anime-store-loader-shown") === "1") {
        loader.remove();
        return;
    }

    sessionStorage.setItem("anime-store-loader-shown", "1");

    /* Timeline : lettres ~1.2s + pause 0.4s + fade 0.6s */
    setTimeout(() => {
        loader.classList.add("is-hidden");
        setTimeout(() => loader.remove(), 700);
    }, 1600);
}

/* -------------------------------------------------------------------------
   S2 — Search overlay (recherche plein écran)
   ------------------------------------------------------------------------- */

function initializeSearchOverlay() {
    const overlay = document.getElementById("search-overlay");
    if (!overlay) return;

    const input = document.getElementById("search-overlay-input");
    const openTriggers = document.querySelectorAll("[data-search-trigger]");
    const closeTriggers = overlay.querySelectorAll("[data-search-close]");

    const open = () => {
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("search-open");

        if (input) {
            /* Focus après la fin de l'animation */
            setTimeout(() => input.focus(), 100);
        }
    };

    const close = () => {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("search-open");
    };

    openTriggers.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            open();
        });
    });

    closeTriggers.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            close();
        });
    });

    /* Échap pour fermer */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            close();
        }
    });

    /* Raccourci Ctrl+K / ⌘+K */
    document.addEventListener("keydown", (event) => {
        const isMac = navigator.platform.toUpperCase().includes("MAC");
        const modifier = isMac ? event.metaKey : event.ctrlKey;

        if (modifier && event.key.toLowerCase() === "k") {
            event.preventDefault();
            if (overlay.classList.contains("is-open")) {
                close();
            } else {
                open();
            }
        }
    });
}

/* -------------------------------------------------------------------------
   S3 — Flip fade text (titre qui se retourne au scroll)
   ------------------------------------------------------------------------- */

function initializeFlipFadeText() {
    const texts = document.querySelectorAll(".flip-fade-text");
    if (!texts.length) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        texts.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
    });

    texts.forEach((el) => observer.observe(el));
}


/* -------------------------------------------------------------------------
   S3 — Team reveal grid (citations au survol / focus)
   ------------------------------------------------------------------------- */

function initializeTeamReveal() {
    const cards = document.querySelectorAll("[data-team-card]");
    if (!cards.length) return;

    /* Sur tactile : premier tap = afficher la citation, deuxième = naviguer */
    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            /* Aucun lien pour l'instant — juste un feedback visuel */
            e.preventDefault();
        });
    });
}
/* -------------------------------------------------------------------------
   S3bis — Highlight de la carte team ciblée par l'ancre
   ------------------------------------------------------------------------- */

function initializeTeamAnchorHighlight() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith("#team")) return;

    const targetId = hash.slice(1);
    if (targetId === "team") return; /* ancre de section, pas de carte spécifique */

    const card = document.getElementById(targetId);
    if (!card) return;

    /* La carte doit déjà être visible (sinon le reveal l'empêche de s'afficher) */
    card.classList.add("reveal-visible");

    /* Petit délai pour laisser le navigateur finir le scroll sur l'ancre */
    setTimeout(() => {
        card.classList.add("is-targeted");

        /* Retirer la classe après l'animation pour pouvoir re-déclencher */
        setTimeout(() => {
            card.classList.remove("is-targeted");
        }, 2200);
    }, 200);
}

/* -------------------------------------------------------------------------
   S3ter — Image trail (100% autonome, aucune modif HTML nécessaire)
   ------------------------------------------------------------------------- */

function initializeImageTrail() {
    /* =========================================================
       CONFIGURATION — à ajuster selon ce que tu veux
       ========================================================= */

    const TRAIL_TARGETS = [
    {
        selector: ".parallax-product-sticky",
        images: [
            "/static/images/avatars/avatar-1.png",
            "/static/images/avatars/avatar-2.png",
            "/static/images/avatars/avatar-3.png",
            "/static/images/avatars/avatar-4.png",
            "/static/images/avatars/avatar-5.png",
        ],
        size: "3.5rem",
    },
];

    const SPAWN_INTERVAL = 50;       /* ms entre deux apparitions */
    const ANIMATION_DURATION = 1000; /* doit matcher la durée CSS de image-trail-pop */
    const POOL_SIZE = 12;            /* nombre d'éléments DOM réutilisés */

    /* =========================================================
       LOGIQUE — pas besoin de toucher en dessous
       ========================================================= */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(hover: none)").matches;

    if (prefersReducedMotion || isTouch) return;

    TRAIL_TARGETS.forEach(({ selector, images, size }) => {
        const targets = document.querySelectorAll(selector);
        if (!targets.length || !images.length) return;

        targets.forEach((target) => {
            /* La cible doit être positionnée en relative pour accueillir l'overlay */
            const computedPosition = window.getComputedStyle(target).position;
            if (computedPosition === "static") {
                target.style.position = "relative";
            }

            /* Crée le conteneur */
            const container = document.createElement("div");
            container.className = "image-trail-container";
            container.setAttribute("aria-hidden", "true");

            /* Crée le pool d'items */
            const pool = [];
            for (let i = 0; i < POOL_SIZE; i++) {
                const item = document.createElement("div");
                item.className = "image-trail-item";
                item.style.height = size;
                item.style.width = size;

                const img = document.createElement("img");
                img.src = images[i % images.length];
                img.alt = "";
                img.draggable = false;

                item.appendChild(img);
                container.appendChild(item);
                pool.push(item);
            }

            target.appendChild(container);

            /* État local du trail */
            let currentIndex = 0;
            let lastSpawnTime = 0;
            let rafId = null;
            let pendingX = 0;
            let pendingY = 0;

            const spawnAt = (clientX, clientY) => {
                const rect = target.getBoundingClientRect();
                const relX = clientX - rect.left;
                const relY = clientY - rect.top;

                const item = pool[currentIndex];
                currentIndex = (currentIndex + 1) % pool.length;

                const rotation = (Math.random() - 0.5) * 50;
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;

                item.style.setProperty("--trail-x", `${relX + offsetX}px`);
                item.style.setProperty("--trail-y", `${relY + offsetY}px`);
                item.style.setProperty("--trail-rotation", `${rotation}deg`);

                item.classList.remove("is-active");
                void item.offsetWidth;
                item.classList.add("is-active");

                setTimeout(() => item.classList.remove("is-active"), ANIMATION_DURATION);
            };

            target.addEventListener("mousemove", (event) => {
                pendingX = event.clientX;
                pendingY = event.clientY;

                if (rafId !== null) return;

                rafId = requestAnimationFrame(() => {
                    const now = performance.now();
                    if (now - lastSpawnTime >= SPAWN_INTERVAL) {
                        lastSpawnTime = now;
                        spawnAt(pendingX, pendingY);
                    }
                    rafId = null;
                });
            });

            target.addEventListener("mouseleave", () => {
                pool.forEach((item) => item.classList.remove("is-active"));
            });
        });
    });
}

/* =========================================================================
   SPRINT 4 — Aurora mouse interaction
   ========================================================================= */

function initializeAuroraMouse() {
    const containers = document.querySelectorAll("[data-aurora]");
    if (!containers.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (prefersReducedMotion || isTouch) return;

    containers.forEach((container) => {
        const blobs = container.querySelectorAll(".aurora-blob");
        if (!blobs.length) return;

        /* Le parent (section) doit être en relative */
        const parent = container.parentElement;
        if (parent) {
            const pos = window.getComputedStyle(parent).position;
            if (pos === "static") parent.style.position = "relative";
        }

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId = null;

        /* Chaque blob a un facteur de profondeur différent */
        const depths =[180, -140, 110, -200, 90];

        const lerp = (a, b, t) => a + (b - a) * t;

        const animate = () => {
            currentX = lerp(currentX, mouseX, 0.15);
            currentY = lerp(currentY, mouseY, 0.15);

            blobs.forEach((blob, i) => {
                const depth = depths[i] || 25;
                const tx = currentX * depth;
                const ty = currentY * depth;
                blob.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            });

            if (
                Math.abs(currentX - mouseX) > 0.001 ||
                Math.abs(currentY - mouseY) > 0.001
            ) {
                rafId = requestAnimationFrame(animate);
            } else {
                rafId = null;
            }
        };

        parent.addEventListener("mousemove", (event) => {
            const rect = container.getBoundingClientRect();
            mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

            if (rafId === null) rafId = requestAnimationFrame(animate);
        });

        parent.addEventListener("mouseleave", () => {
            mouseX = 0;
            mouseY = 0;
            if (rafId === null) rafId = requestAnimationFrame(animate);
        });
    });
}


/* =========================================================================
   SPRINT 4 — 3D tilt
   ========================================================================= */

function initialize3DTilt() {
    const cards = document.querySelectorAll("[data-tilt]");
    if (!cards.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (prefersReducedMotion || isTouch) return;

    const MAX_ROTATION = 12; /* degrés */
    const SCALE = 1.03;

    cards.forEach((card) => {
        let rafId = null;
        let pendingEvent = null;

        const update = () => {
            if (!pendingEvent) return;
            const rect = card.getBoundingClientRect();
            const x = (pendingEvent.clientX - rect.left) / rect.width;
            const y = (pendingEvent.clientY - rect.top) / rect.height;

            const rotY = (x - 0.5) * 2 * MAX_ROTATION;
            const rotX = -(y - 0.5) * 2 * MAX_ROTATION;

            card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${SCALE})`;

            /* Éclat lumineux qui suit la souris */
            card.style.setProperty("--mouse-x", `${x * 100}%`);
            card.style.setProperty("--mouse-y", `${y * 100}%`);

            rafId = null;
            pendingEvent = null;
        };

        card.addEventListener("mousemove", (event) => {
            pendingEvent = event;
            if (rafId === null) rafId = requestAnimationFrame(update);
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/* =========================================================================
   SPRINT 6 — Cover Flow 3D
   ========================================================================= */

function initializeCoverflow() {
    const roots = document.querySelectorAll("[data-coverflow]");
    if (!roots.length) return;

    roots.forEach((root) => {
        const viewport = root.querySelector("[data-coverflow-viewport]");
        const cards = Array.from(root.querySelectorAll("[data-coverflow-card]"));
        const total = cards.length;
        if (!viewport || !total) return;

        const prevBtn = root.querySelector("[data-coverflow-prev]");
        const nextBtn = root.querySelector("[data-coverflow-next]");
        const currentLabel = root.querySelector("[data-coverflow-current]");

        /* Constantes de mise en page */
        const SPACING_DESKTOP = 180;   /* px entre chaque carte */
        const SPACING_MOBILE = 130;
        const ROTATION = 42;           /* degrés d'inclinaison */
        const DEPTH = 110;             /* px de recul pour chaque carte */
        const SCALE_STEP = 0.14;       /* réduction de taille */
        const OPACITY_STEP = 0.22;     /* réduction d'opacité */

        let currentIndex = 0;
        let isDragging = false;
        let hasMoved = false;
        let dragStartX = 0;
        let dragAccumulated = 0;

        const getSpacing = () =>
            window.innerWidth <= 640 ? SPACING_MOBILE : SPACING_DESKTOP;

        /* Calcule la position relative en tenant compte du wrap */
        const getRelativePosition = (base) => {
            let diff = base - currentIndex;
            const half = total / 2;

            /* Wrap : la plus courte distance autour du cercle */
            if (diff > half) diff -= total;
            if (diff < -half) diff += total;

            return diff;
        };

        const updatePositions = () => {
            const spacing = getSpacing();

            cards.forEach((card) => {
                const base = parseInt(card.dataset.base, 10);
                const pos = getRelativePosition(base);
                const absPos = Math.abs(pos);

                /* Position hors-cercle (plus de 2 cartes d'écart) : on cache */
                if (absPos > 2) {
                    card.style.opacity = "0";
                    card.style.pointerEvents = "none";
                    card.dataset.position = "hidden";
                    card.tabIndex = -1;
                    card.setAttribute("aria-hidden", "true");
                    return;
                }

                /* Transformation cover flow */
                const translateX = pos * spacing;
                const translateZ = -absPos * DEPTH;
                const rotateY = pos * -ROTATION;
                const scale = 1 - absPos * SCALE_STEP;
                const opacity = Math.max(0.3, 1 - absPos * OPACITY_STEP);
                const zIndex = 20 - absPos;

                card.style.transform =
                    `translateX(${translateX}px) ` +
                    `translateZ(${translateZ}px) ` +
                    `rotateY(${rotateY}deg) ` +
                    `scale(${scale})`;
                card.style.opacity = String(opacity);
                card.style.zIndex = String(zIndex);

                card.dataset.position = String(pos);

                const isActive = pos === 0;
                card.tabIndex = isActive ? 0 : -1;
                card.setAttribute("aria-hidden", isActive ? "false" : "true");
                card.style.pointerEvents = isActive ? "auto" : "auto";
            });

            if (currentLabel) {
                currentLabel.textContent = String(currentIndex + 1);
            }
        };

        const goTo = (index) => {
            currentIndex = ((index % total) + total) % total;
            updatePositions();
        };

        const goNext = () => goTo(currentIndex + 1);
        const goPrev = () => goTo(currentIndex - 1);

        /* --- Init --- */
        updatePositions();

        /* --- Boutons --- */
        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.preventDefault();
                goNext();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.preventDefault();
                goPrev();
            });
        }

        /* --- Drag / swipe --- */
        const onPointerDown = (e) => {
            if (e.target.closest("button")) return;
            isDragging = true;
            hasMoved = false;
            dragStartX = e.clientX;
            dragAccumulated = 0;
            viewport.classList.add("is-dragging");
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            dragAccumulated = e.clientX - dragStartX;
            if (Math.abs(dragAccumulated) > 8) hasMoved = true;
        };

        const onPointerUp = () => {
            if (!isDragging) return;
            isDragging = false;
            viewport.classList.remove("is-dragging");

            const threshold = 50;
            if (dragAccumulated <= -threshold) goNext();
            else if (dragAccumulated >= threshold) goPrev();

            dragAccumulated = 0;
        };

        viewport.addEventListener("pointerdown", onPointerDown);
        viewport.addEventListener("pointermove", onPointerMove);
        viewport.addEventListener("pointerup", onPointerUp);
        viewport.addEventListener("pointercancel", () => {
            isDragging = false;
            viewport.classList.remove("is-dragging");
        });
        viewport.addEventListener("pointerleave", () => {
            if (isDragging) {
                isDragging = false;
                viewport.classList.remove("is-dragging");
            }
        });

        /* Empêche le drag natif des images */
        viewport.addEventListener("dragstart", (e) => e.preventDefault());

        /* --- Clic sur les cartes --- */
        cards.forEach((card) => {
            card.addEventListener("click", (e) => {
                /* Si on a dragué, on bloque la navigation */
                if (hasMoved) {
                    e.preventDefault();
                    hasMoved = false;
                    return;
                }

                const pos = parseInt(card.dataset.position || "0", 10);
                if (pos === 0) {
                    /* Carte active → laisse la navigation */
                    return;
                }

                /* Carte latérale → on la ramène au centre */
                e.preventDefault();
                goTo(currentIndex + pos);
            });
        });

        /* --- Clavier --- */
        viewport.tabIndex = 0;
        viewport.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            }
        });

        /* --- Recalcul au resize --- */
        let resizeTimer = null;
        window.addEventListener("resize", () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updatePositions();
            }, 150);
        });
    });
}

window.toggleDarkMode = toggleDarkMode;