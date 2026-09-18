/**
 * chibi-barrier.js — Section Chibi interactif en bas de la page boutique
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Guard : éviter l'injection multiple
    if (document.querySelector('[data-chibi-playground]')) return;

    // 2. Détecter si on est sur la page boutique (marqueur #products-grid ou [data-coverflow])
    const isCatalog = Boolean(document.querySelector('#products-grid') || document.querySelector('[data-coverflow]'));
    if (!isCatalog) return;

    // 3. Détecter prefers-reduced-motion et mobile (hover:none)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchOnly = window.matchMedia('(hover: none)').matches;
    if (prefersReducedMotion || isTouchOnly) return;

    // 4. Créer dynamiquement l'élément <section class="chibi-playground">
    const playground = document.createElement('section');
    playground.className = 'chibi-playground';
    playground.setAttribute('data-chibi-playground', '');

    const stage = document.createElement('div');
    stage.className = 'chibi-playground__stage';

    const chibiSlots = [];
    for (let i = 0; i < 5; i++) {
        const slot = document.createElement('div');
        slot.className = 'chibi-slot';
        slot.style.setProperty('--chibi-index', i.toString());

        const img = document.createElement('img');
        img.src = `/static/images/avatars/avatar-${i + 1}.png`;
        img.alt = '';
        img.loading = 'lazy';

        slot.appendChild(img);
        stage.appendChild(slot);
        chibiSlots.push(slot);
    }

    const barrier = document.createElement('div');
    barrier.className = 'chibi-barrier';
    barrier.setAttribute('aria-hidden', 'true');
    stage.appendChild(barrier);

    playground.appendChild(stage);

    // 5. Insérer avant le footer
    const footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(playground, footer);
    } else {
        document.body.appendChild(playground);
    }

    // Gestion de l'interactivité (is-awake, is-out, is-hiding)
    let hideTimers = [];
    let showTimers = [];

    const wakeUp = () => {
        if (!playground.classList.contains('is-awake')) {
            playground.classList.add('is-awake');
        }

        // Nettoyer les anciens timeouts de repli
        hideTimers.forEach(clearTimeout);
        hideTimers = [];

        chibiSlots.forEach((slot, index) => {
            if (slot.classList.contains('is-out')) return;
            const timer = setTimeout(() => {
                if (playground.classList.contains('is-awake')) {
                    slot.classList.remove('is-hiding');
                    slot.classList.add('is-out');
                }
            }, index * 80);
            showTimers.push(timer);
        });
    };

    const sleep = () => {
        playground.classList.remove('is-awake');

        // Nettoyer les timeouts de sortie
        showTimers.forEach(clearTimeout);
        showTimers = [];
        hideTimers.forEach(clearTimeout);
        hideTimers = [];

        const total = chibiSlots.length;
        chibiSlots.forEach((slot, index) => {
            const reverseIndex = total - 1 - index;
            const timer = setTimeout(() => {
                if (!playground.classList.contains('is-awake')) {
                    slot.classList.remove('is-out');
                    slot.classList.add('is-hiding');
                }
            }, reverseIndex * 80);
            hideTimers.push(timer);
        });
    };

    // 6. Écouteurs d'événements
    playground.addEventListener('mousemove', wakeUp);
    playground.addEventListener('mouseenter', wakeUp);
    playground.addEventListener('mouseleave', sleep);
});
