/*
|--------------------------------------------------------------------------
| Anime Store Dakar
| Main JavaScript
|--------------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Anime Store Dakar - JavaScript chargé.");

    initializeDarkMode();
    initializeThemeButtons();
    initializeMobileMenu();
    initializeScrollStroke();
    initializeProductParallax();
});


/*
|--------------------------------------------------------------------------
| Dark Mode
|--------------------------------------------------------------------------
|
| Pour le moment, le système est préparé.
| Le bouton graphique sera ajouté lorsque nous construirons la navbar.
|
*/

function initializeDarkMode() {
    const html = document.documentElement;

    const savedTheme = localStorage.getItem("anime-store-theme");

    if (savedTheme === "dark") {
        html.classList.add("dark");
    } else if (savedTheme === "light") {
        html.classList.remove("dark");
    } else {
        /*
        Utilisation des préférences système
        si aucune préférence locale n'est enregistrée.
        */

        const prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (prefersDarkMode) {
            html.classList.add("dark");
        }
    }

    updateThemeColor();
}


/*
|--------------------------------------------------------------------------
| Fonction utilitaire pour changer le thème
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Exposition globale
|--------------------------------------------------------------------------
|
| Garde la fonction disponible si une future interface doit
| déclencher le changement de thème depuis un autre composant.
|
*/

window.toggleDarkMode = toggleDarkMode;
