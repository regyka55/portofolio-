document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Small delay for the follower
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    // 2. Typewriter Effect
    const typeWriterElement = document.getElementById('typewriter');
    const nameText = "REGYKA RACHMAT P";
    let typeIndex = 0;

    function typeWriter() {
        if (typeIndex < nameText.length) {
            typeWriterElement.textContent += nameText.charAt(typeIndex);
            typeIndex++;
            setTimeout(typeWriter, 110);
        }
    }
    
    // Start typewriter after a small delay
    setTimeout(typeWriter, 1000);

    // 3. Role Switcher
    const roles = document.querySelectorAll('.role-text');
    let currentRoleIndex = 0;

    setInterval(() => {
        // Remove active class from current
        roles[currentRoleIndex].classList.remove('active');
        roles[currentRoleIndex].classList.add('exit');
        
        // Wait for exit transition then reset
        setTimeout(() => {
            roles[currentRoleIndex].classList.remove('exit');
            
            // Move to next role
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            roles[currentRoleIndex].classList.add('active');
        }, 500); // Wait half a second for exit animation

    }, 2600);

    // 4. Reveal on Scroll & Navbar Active State
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('[data-reveal]');
    const progressBars = document.querySelectorAll('.progress-bar');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update active nav link
                let id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-target') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 }); // Use 50% threshold for nav active state

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Trigger progress bars if inside about section
                if (entry.target.classList.contains('about-left')) {
                    progressBars.forEach(bar => {
                        bar.style.transform = `scaleX(${bar.getAttribute('data-width')})`;
                    });
                }
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Project Slider
    const sliderWrapper = document.getElementById('projectSlider');
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    
    let currentIndex = 0;
    let cardWidth;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, projectCards.length - cardsPerView);
    let autoSlideInterval;

    function getCardsPerView() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function initSlider() {
        // Generate dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        updateSlider();
    }

    function updateSlider() {
        cardWidth = projectCards[0].offsetWidth + 30; // + gap
        sliderWrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = maxIndex;
        if (currentIndex > maxIndex) currentIndex = 0;
        updateSlider();
        resetAutoSlide();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Handle Window Resize
    window.addEventListener('resize', () => {
        let newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            maxIndex = Math.max(0, projectCards.length - cardsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            initSlider();
        } else {
            updateSlider();
        }
    });

    // Auto Play
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 3200);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Touch Support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrapper.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval); // pause auto slide on touch
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide(); // resume
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) goToSlide(currentIndex + 1);
        if (touchEndX > touchStartX + threshold) goToSlide(currentIndex - 1);
    }

    // Initialize Slider
    initSlider();
    startAutoSlide();

    // 6. Theme Toggle (Light / Dark Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check local storage for theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // 7. Global Particles Animation with Network Effect
    const canvas = document.getElementById('global-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 100; // Increased for global screen
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Init canvas size
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1.5; 
                this.baseColor = Math.random() > 0.5 ? '#00ffff' : '#ff4d4d'; // Brighter cyan & red
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.baseColor;
                
                const isLightMode = document.body.classList.contains('light-mode');
                ctx.globalAlpha = isLightMode ? 0.8 : 0.6;
                
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1.0; 
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw lines
            const isLightMode = document.body.classList.contains('light-mode');
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        // Line opacity depends on distance
                        let opacity = 1 - (distance / 120);
                        opacity *= isLightMode ? 0.4 : 0.2; // overall line opacity
                        
                        ctx.strokeStyle = particles[i].baseColor; // Match color of particle i
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = opacity;
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
                
                particles[i].update();
                particles[i].draw();
            }
            ctx.globalAlpha = 1.0;
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});

