/*
|--------------------------------------------------------------------------
| Anime Store Dakar — Panier Frontend (cart.js)
|--------------------------------------------------------------------------
*/

const CART_STORAGE_KEY = "anime_store_cart";
const CUSTOMER_STORAGE_KEY = "anime_store_customer";
const WHATSAPP_NUMBER = "221775958179";
const API_ORDER_URL = "/api/orders/";


function getCsrfToken() {
    const match = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : "";
}


function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
    renderCartDrawer();
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}


function getCustomer() {
    try {
        const raw = JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY)) || {};
        return {
            name: typeof raw.name === "string" ? raw.name : "",
            whatsapp: typeof raw.whatsapp === "string" ? raw.whatsapp : "",
        };
    } catch {
        return { name: "", whatsapp: "" };
    }
}

function saveCustomer(customer) {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
}


function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.slug === product.slug);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            slug: product.slug,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image || "",
            style: product.style || "",
            color: product.color || "",
            quantity: quantity,
        });
    }

    saveCart(cart);
    showToast(`${product.name} ajouté au panier !`, "success");
}

function removeFromCart(slug) {
    const cart = getCart().filter(item => item.slug !== slug);
    saveCart(cart);
}

function updateQuantity(slug, newQuantity) {
    const cart = getCart();
    const item = cart.find(i => i.slug === slug);

    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(slug);
        return;
    }

    item.quantity = newQuantity;
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadges();
    renderCartDrawer();
}


function updateCartBadges() {
    const count = getCartCount();
    const badges = document.querySelectorAll("[data-cart-count]");

    badges.forEach(badge => {
        badge.textContent = count;

        if (count > 0) {
            badge.classList.remove("hidden");
        } else {
            badge.classList.add("hidden");
        }
    });
}


/* =========================================================================
   SPRINT 1 — TOAST AMÉLIORÉ (barre de progression + type)
   ========================================================================= */

function showToast(message, type = "success", duration = 2800) {
    const old = document.getElementById("cart-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = `toast toast-${type}`;

    const iconSvg = type === "info"
        ? `<svg class="toast-icon h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
        : `<svg class="toast-icon h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`;

    toast.innerHTML = `
        ${iconSvg}
        <span class="flex-1">${message}</span>
        <span class="toast-progress" style="animation-duration: ${duration}ms;"></span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("visible"));

    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 500);
    }, duration);
}


function openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    const panel = document.getElementById("cart-panel");

    if (!drawer) return;

    drawer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.body.classList.add("cart-open");

    requestAnimationFrame(() => {
        overlay.classList.add("opacity-100");
        panel.classList.remove("translate-x-full");
    });
}

function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    const panel = document.getElementById("cart-panel");

    if (!drawer) return;

    overlay.classList.remove("opacity-100");
    panel.classList.add("translate-x-full");
    document.body.classList.remove("cart-open");

    setTimeout(() => {
        drawer.classList.add("hidden");
        document.body.style.overflow = "";
    }, 300);
}


function ensureCustomerForm(footer) {
    if (!footer) return;
    if (document.getElementById("cart-customer-form")) return;

    const customer = getCustomer();

    const form = document.createElement("div");
    form.id = "cart-customer-form";
    form.className = "mb-4 space-y-2 border-b border-brand-dark/10 pb-4 dark:border-white/10";
    form.innerHTML = `
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-dark/50 dark:text-white/50">
            Vos coordonnées (optionnel)
        </p>
        <input type="text" id="cart-customer-name" placeholder="Votre nom" maxlength="120" autocomplete="name"
            class="w-full rounded-lg border border-brand-dark/15 bg-white/70 px-3 py-2 text-sm text-brand-dark placeholder-brand-dark/40 focus:border-brand focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40">
        <input type="tel" id="cart-customer-whatsapp" placeholder="Votre numéro WhatsApp" maxlength="30" autocomplete="tel"
            class="w-full rounded-lg border border-brand-dark/15 bg-white/70 px-3 py-2 text-sm text-brand-dark placeholder-brand-dark/40 focus:border-brand focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40">
    `;

    footer.insertBefore(form, footer.firstChild);

    const nameInput = form.querySelector("#cart-customer-name");
    const waInput = form.querySelector("#cart-customer-whatsapp");
    if (nameInput) nameInput.value = customer.name;
    if (waInput) waInput.value = customer.whatsapp;
}


function renderCartDrawer() {
    const container = document.getElementById("cart-items");
    const footer = document.getElementById("cart-footer");

    if (!container || !footer) return;

    const cart = getCart();
    const total = getCartTotal();
    const count = getCartCount();

    const titleCount = document.getElementById("cart-title-count");
    if (titleCount) {
        titleCount.textContent = count > 0 ? `(${count})` : "";
    }

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-brand/20 dark:bg-white/10">
                    <svg class="h-10 w-10 text-brand-dark/30 dark:text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
                    </svg>
                </div>
                <p class="text-sm font-semibold text-brand-dark/50 dark:text-white/50">
                    Votre panier est vide
                </p>
                <a href="/boutique/" class="btn btn-secondary text-sm" onclick="closeCartDrawer()">
                    Explorer la boutique
                </a>
            </div>
        `;
        footer.classList.add("hidden");
        return;
    }

    footer.classList.remove("hidden");

    container.innerHTML = cart.map(item => `
        <div class="flex gap-4 rounded-xl bg-white/60 p-3 dark:bg-white/5" data-cart-item="${item.slug}">
            <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg
                ${item.image ? '' : (item.color === 'brand-dark' ? 'bg-brand-dark text-white' : item.color === 'brand' ? 'bg-brand text-brand-dark' : 'bg-brand-soft text-brand-dark dark:bg-white/10 dark:text-white')}">
                ${item.image
                    ? `<img src="/static/${item.image}" alt="${item.name}" class="h-full w-full object-cover">`
                    : `<span class="font-display text-lg font-bold">${item.style}</span>`
                }
            </div>

            <div class="flex flex-1 flex-col justify-between">
                <div>
                    <p class="text-xs font-bold uppercase tracking-wide text-brand-dark/45 dark:text-white/45">${item.category}</p>
                    <p class="mt-0.5 text-sm font-bold leading-snug text-brand-dark dark:text-white">${item.name}</p>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button type="button"
                            class="flex h-7 w-7 items-center justify-center rounded-full border border-brand-dark/20 text-sm font-bold transition hover:bg-brand-dark hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-brand-dark"
                            onclick="updateQuantity('${item.slug}', ${item.quantity - 1})"
                            aria-label="Diminuer la quantité">−</button>
                        <span class="min-w-[1.5rem] text-center text-sm font-bold">${item.quantity}</span>
                        <button type="button"
                            class="flex h-7 w-7 items-center justify-center rounded-full border border-brand-dark/20 text-sm font-bold transition hover:bg-brand-dark hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-brand-dark"
                            onclick="updateQuantity('${item.slug}', ${item.quantity + 1})"
                            aria-label="Augmenter la quantité">+</button>
                    </div>
                    <p class="text-sm font-bold text-brand-dark dark:text-white">
                        ${(item.price * item.quantity).toLocaleString("fr-FR")} F
                    </p>
                </div>
            </div>

            <button type="button"
                class="self-start rounded-full p-1 text-brand-dark/30 transition hover:text-red-500 dark:text-white/30 dark:hover:text-red-400"
                onclick="removeFromCart('${item.slug}')"
                aria-label="Retirer ${item.name}">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    `).join("");

    ensureCustomerForm(footer);

    const totalEl = document.getElementById("cart-total");
    const countEl = document.getElementById("cart-footer-count");
    const whatsappEl = document.getElementById("cart-whatsapp-btn");

    if (totalEl) totalEl.textContent = `${total.toLocaleString("fr-FR")} FCFA`;
    if (countEl) countEl.textContent = `${count} article${count > 1 ? "s" : ""}`;
    if (whatsappEl) {
        whatsappEl.href = generateWhatsAppUrl();
        whatsappEl.dataset.cartWhatsapp = "1";
    }
}


function generateWhatsAppUrl() {
    const cart = getCart();
    const total = getCartTotal();

    if (cart.length === 0) return "#";

    const lines = cart.map(item =>
        `▸ ${item.quantity}x ${item.name} (${(item.price * item.quantity).toLocaleString("fr-FR")} FCFA)`
    );

    const message = [
        `Bonjour Anime Store Dakar 👋`,
        ``,
        `Je souhaite commander les articles suivants :`,
        ``,
        ...lines,
        ``,
        `📦 Total : ${total.toLocaleString("fr-FR")} FCFA`,
        ``,
        `Pouvez-vous me confirmer la disponibilité et les modalités de livraison à Dakar ? Merci !`,
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function generateSingleWhatsAppUrl({ name, price, quantity }) {
    const total = price * quantity;
    const message = [
        `Bonjour Anime Store Dakar 👋`,
        ``,
        `Je souhaite commander :`,
        `▸ ${quantity}x ${name} (${total.toLocaleString("fr-FR")} FCFA)`,
        ``,
        `Pouvez-vous me confirmer la disponibilité et les modalités de livraison à Dakar ? Merci !`,
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


function postOrder(payload) {
    fetch(API_ORDER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.ok) {
            console.info(`Commande ${data.reference} enregistrée (${data.total} FCFA).`);
        } else {
            console.warn("Enregistrement serveur refusé :", data);
        }
    })
    .catch(err => {
        console.warn("Enregistrement serveur impossible :", err);
    });
}

function submitCartOrder() {
    const cart = getCart();
    if (cart.length === 0) return;

    const whatsappUrl = generateWhatsAppUrl();
    window.open(whatsappUrl, "_blank");

    const customer = getCustomer();
    postOrder({
        items: cart.map(item => ({ slug: item.slug, quantity: item.quantity })),
        customer_name: customer.name,
        customer_whatsapp: customer.whatsapp,
    });

    clearCart();
    closeCartDrawer();
    showToast("Commande envoyée sur WhatsApp ✅", "success");
}

function submitSingleOrder(btn) {
    const qtyInput = document.getElementById(btn.dataset.quantityInput || "product-quantity");
    const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;

    const slug = btn.dataset.slug || "";
    const name = btn.dataset.name || "";
    const price = parseInt(btn.dataset.price, 10) || 0;

    let whatsappUrl = btn.getAttribute("href") || "#";
    if (slug && name && price) {
        whatsappUrl = generateSingleWhatsAppUrl({ name, price, quantity: qty });
    }

    window.open(whatsappUrl, "_blank");

    const customer = getCustomer();
    postOrder({
        single: { slug, quantity: qty },
        customer_name: customer.name,
        customer_whatsapp: customer.whatsapp,
    });

    showToast("Commande envoyée sur WhatsApp ✅", "success");
}


function initializeCart() {
    updateCartBadges();
    renderCartDrawer();

    document.addEventListener("input", (e) => {
        if (e.target.id === "cart-customer-name") {
            const c = getCustomer();
            c.name = e.target.value;
            saveCustomer(c);
        }
        if (e.target.id === "cart-customer-whatsapp") {
            const c = getCustomer();
            c.whatsapp = e.target.value;
            saveCustomer(c);
        }
    });

    document.addEventListener("click", (e) => {
        const addBtn = e.target.closest("[data-add-to-cart]");
        if (addBtn) {
            e.preventDefault();
            addToCart({
                slug: addBtn.dataset.slug,
                name: addBtn.dataset.name,
                price: parseInt(addBtn.dataset.price, 10),
                category: addBtn.dataset.category,
                image: addBtn.dataset.image || "",
                style: addBtn.dataset.style || "",
                color: addBtn.dataset.color || "",
            }, 1);
            return;
        }

        const addDetailBtn = e.target.closest("[data-add-to-cart-detail]");
        if (addDetailBtn) {
            e.preventDefault();
            const qtyInput = document.getElementById("product-quantity");
            const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            addToCart({
                slug: addDetailBtn.dataset.slug,
                name: addDetailBtn.dataset.name,
                price: parseInt(addDetailBtn.dataset.price, 10),
                category: addDetailBtn.dataset.category,
                image: addDetailBtn.dataset.image || "",
                style: addDetailBtn.dataset.style || "",
                color: addDetailBtn.dataset.color || "",
            }, qty);
            openCartDrawer();
            return;
        }

        const singleBtn = e.target.closest("[data-order-single]");
        if (singleBtn) {
            e.preventDefault();
            submitSingleOrder(singleBtn);
            return;
        }

        const waBtn = e.target.closest("[data-cart-whatsapp]");
        if (waBtn) {
            e.preventDefault();
            submitCartOrder();
            return;
        }

        if (e.target.closest("[data-cart-toggle]")) {
            e.preventDefault();
            openCartDrawer();
            return;
        }

        if (e.target.closest("[data-cart-close]") || e.target.id === "cart-overlay") {
            closeCartDrawer();
            return;
        }

        if (e.target.closest("[data-cart-clear]")) {
            clearCart();
            return;
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCartDrawer();
    });

    document.addEventListener("click", (e) => {
        const qtyBtn = e.target.closest("[data-qty-change]");
        if (!qtyBtn) return;

        e.preventDefault();
        const input = document.getElementById("product-quantity");
        if (!input) return;

        const delta = parseInt(qtyBtn.dataset.qtyChange, 10);
        input.value = Math.max(1, parseInt(input.value, 10) + delta);
    });
}

document.addEventListener("DOMContentLoaded", initializeCart);