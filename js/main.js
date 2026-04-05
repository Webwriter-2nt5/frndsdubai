/**
 * main.js
 * High-performance, logically structured JavaScript for F.R.N.D.S Grand Café.
 * Optimized for speed: uses passive event listeners, debouncing/throttling, and no heavy dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. NAVBAR LOGIC (Sticky Header & Mobile Menu)
    // ==========================================
    const initNavbar = () => {
        const navbar = document.getElementById('main-navbar');
        const hamburger = document.getElementById('nav-hamburger');
        const navLinks = document.getElementById('nav-links');

        // Throttled Scroll Listener (Performance Optimization)
        let isScrolling = false;

        const onScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar--scrolled');
            } else {
                navbar.classList.remove('navbar--scrolled');
            }
            isScrolling = false;
        };

        // Passive true makes scroll fast by not blocking main thread
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(onScroll);
                isScrolling = true;
            }
        }, { passive: true });

        // Mobile Menu Toggle
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('navbar__hamburger--open');
                navLinks.classList.toggle('navbar__links--open');
            });
        }
    };

    // ==========================================
    // 2. MENU PAGE LOGIC (Dual Soul Toggle)
    // ==========================================
    const initMenuToggle = () => {
        const menuToggleBtns = document.querySelectorAll('.soul-toggle__btn');
        if (!menuToggleBtns.length) return; // Exit if not on menu page

        const medMenu = document.getElementById('menu-mediterranean');
        const jpnMenu = document.getElementById('menu-japanese');

        menuToggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state on buttons
                menuToggleBtns.forEach(b => b.classList.remove('soul-toggle__btn--active'));
                const targetBtn = e.currentTarget;
                targetBtn.classList.add('soul-toggle__btn--active');

                // Toggle menu visibility
                const soul = targetBtn.dataset.soul;
                if (soul === 'mediterranean') {
                    medMenu.classList.remove('menu-grid--hidden');
                    jpnMenu.classList.add('menu-grid--hidden');
                } else if (soul === 'japanese') {
                    jpnMenu.classList.remove('menu-grid--hidden');
                    medMenu.classList.add('menu-grid--hidden');
                }
            });
        });
    };

    // ==========================================
    // 3. GALLERY PAGE LOGIC (Filters & Lightbox)
    // ==========================================
    const initGallery = () => {
        const filterBtns = document.querySelectorAll('.gallery-filters__btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');

        if (!filterBtns.length || !galleryItems.length) return;

        // Filtering
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('gallery-filters__btn--active'));
                const targetBtn = e.currentTarget;
                targetBtn.classList.add('gallery-filters__btn--active');

                const filter = targetBtn.dataset.filter;

                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = ''; // Reset to default display
                    } else {
                        item.style.display = 'none'; // Hide non-matching
                    }
                });
            });
        });

        // Lightbox behavior
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');

        if (lightbox && lightboxImg && lightboxClose) {
            galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    const title = item.querySelector('.gallery-item__title');

                    if (img) {
                        lightboxImg.src = img.src;
                        lightboxImg.alt = img.alt || '';
                    }
                    if (title && lightboxCaption) {
                        lightboxCaption.textContent = title.textContent;
                    }

                    lightbox.setAttribute('aria-hidden', 'false');
                    lightbox.style.display = 'flex'; // Ensures it shows if hidden via CSS initially
                });
            });

            const closeLightbox = () => {
                lightbox.setAttribute('aria-hidden', 'true');
                lightbox.style.display = 'none';
                lightboxImg.src = ''; // Clear source to free memory/stop old image from showing on next open
            };

            lightboxClose.addEventListener('click', closeLightbox);

            // Close on background click
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
    };

    // ==========================================
    // 4. RESERVATION PAGE LOGIC
    // ==========================================
    const initReservation = () => {
        const form = document.getElementById('reservation-form');
        if (!form) return;

        // Guest Counter
        const btnMinus = document.getElementById('guest-minus');
        const btnPlus = document.getElementById('guest-plus');
        const guestCountDisplay = document.getElementById('guest-count');
        const guestInput = document.getElementById('res-guests');

        if (btnMinus && btnPlus && guestCountDisplay && guestInput) {
            let count = parseInt(guestInput.value, 10) || 2;

            btnMinus.addEventListener('click', () => {
                if (count > 1) {
                    count--;
                    guestCountDisplay.textContent = count;
                    guestInput.value = count;
                }
            });

            btnPlus.addEventListener('click', () => {
                if (count < 20) { // Limit max guests
                    count++;
                    guestCountDisplay.textContent = count;
                    guestInput.value = count;
                }
            });
        }

        // Dining Preference Selection
        const prefBtns = document.querySelectorAll('.dining-preference__btn');
        prefBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                prefBtns.forEach(b => b.classList.remove('dining-preference__btn--active'));
                e.currentTarget.classList.add('dining-preference__btn--active');
            });
        });

        // Form Submission Modal
        const modal = document.getElementById('success-modal');
        const modalClose = document.getElementById('modal-close');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (form.checkValidity()) {
                // Form is valid - Show success modal
                if (modal) {
                    modal.setAttribute('aria-hidden', 'false');
                    modal.style.display = 'flex'; // Ensure it's shown
                }
            } else {
                // Trigger native browser validation UI
                form.reportValidity();
            }
        });

        const closeModal = () => {
            if (modal) {
                modal.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
            }
            form.reset();
            if (guestCountDisplay && guestInput) {
                guestCountDisplay.textContent = '2';
                guestInput.value = '2';
            }
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
    };

    // ==========================================
    // Initialize all modules
    // ==========================================
    initNavbar();
    initMenuToggle();
    initGallery();
    initReservation();

});
