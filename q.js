
        // ===== HERO SLIDER =====
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        const currentSlideEl = document.getElementById('currentSlide');
        const counterLine = document.getElementById('counterLine');
        const slider = document.getElementById('heroSlider');
        const totalSlides = slides.length;

        let currentIndex = 0;
        let autoplayInterval;
        let autoplayDelay = 6000;
        let isPaused = false;

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            dots[currentIndex].setAttribute('aria-selected', 'false');

            currentIndex = (index + totalSlides) % totalSlides;

            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
            dots[currentIndex].setAttribute('aria-selected', 'true');

            currentSlideEl.textContent = String(currentIndex + 1).padStart(2, '0');

            counterLine.style.transition = 'none';
            counterLine.style.height = '0%';
            setTimeout(() => {
                counterLine.style.transition = 'height 6s linear';
                counterLine.style.height = '100%';
            }, 50);

            resetAutoplay();
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }

        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                if (!isPaused) nextSlide();
            }, autoplayDelay);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        slider.addEventListener('mouseenter', () => { isPaused = true; });
        slider.addEventListener('mouseleave', () => { isPaused = false; });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isPaused = true;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            isPaused = false;
        }, { passive: true });

        goToSlide(0);
        startAutoplay();

        // ===== NAVBAR =====
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });

        // ===== MOBILE MENU =====
        const navToggle = document.getElementById('navToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        navToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // ===== SCROLL REVEAL =====
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

            document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        } else {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        }

        // ===== COUNTER ANIMATION =====
        if (!prefersReducedMotion) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.getAttribute('data-target'));
                        const duration = 2000;
                        const startTime = performance.now();

                        function update(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            el.textContent = Math.floor(eased * target);
                            if (progress < 1) requestAnimationFrame(update);
                            else el.textContent = target;
                        }

                        requestAnimationFrame(update);
                        counterObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));
        } else {
            document.querySelectorAll('.count-up').forEach(el => {
                el.textContent = el.getAttribute('data-target');
            });
        }

        // ===== SMOOTH SCROLL =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = navbar.offsetHeight + 20;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                }
            });
        });
   