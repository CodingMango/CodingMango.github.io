/* ---------------------------------------------------
   Tailwind Configuration
   --------------------------------------------------- */
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    900: '#1e3a8a',
                },
                darkbase: '#0f172a', // Deep slate for dark mode background
                darkcard: '#1e293b', // Slightly lighter slate for cards
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Merriweather', 'Georgia', 'serif'],
            }
        }
    }
}

/* ---------------------------------------------------
   1. Telegram-Style Dark Mode Toggle (View Transitions) 
   --------------------------------------------------- */
function toggleDarkMode(event) {
    const isDark = document.documentElement.classList.contains('dark');
    
    const icons = [document.getElementById('theme-icon'), document.getElementById('mobile-theme-icon')];
    icons.forEach(icon => {
        if(icon) {
            icon.style.transition = 'transform 0.5s ease-in-out';
            icon.style.transform = isDark ? 'rotate(0deg)' : 'rotate(360deg)';
        }
    });

    if (!document.startViewTransition) {
        applyTheme(!isDark);
        return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    
    if (event) {
        if (event.touches && event.touches.length > 0) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else if (event.clientX !== undefined) {
            x = event.clientX;
            y = event.clientY;
        }
    }
    
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => {
        applyTheme(!isDark);
    });

    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
        ];

        document.documentElement.animate(
            { clipPath: clipPath },
            { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
        );
    });
}

function applyTheme(makeDark) {
    const themeIcon = document.getElementById('theme-icon');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    
    if (makeDark) {
        document.documentElement.classList.add('dark');
        if(themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
        if(mobileThemeIcon) { mobileThemeIcon.classList.remove('fa-moon'); mobileThemeIcon.classList.add('fa-sun'); }
    } else {
        document.documentElement.classList.remove('dark');
        if(themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
        if(mobileThemeIcon) { mobileThemeIcon.classList.remove('fa-sun'); mobileThemeIcon.classList.add('fa-moon'); }
    }
}

/* ---------------------------------------------------
   4. Lightbox Gallery Logic 
   --------------------------------------------------- */
let lightbox, lightboxImg;

function openLightbox(imageSrc) {
    lightboxImg.src = imageSrc;
    
    // Remove hidden to put it in the DOM
    lightbox.classList.remove('hidden');
    
    // Lock the background page from scrolling
    document.body.style.overflow = 'hidden'; 
    
    // A tiny delay ensures the CSS transition triggers properly after removing 'hidden'
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightboxImg.classList.remove('scale-95');
        lightboxImg.classList.add('scale-100');
    }, 10);
}

function closeLightbox() {
    // Trigger the fade out and scale down animation
    lightbox.classList.add('opacity-0');
    lightboxImg.classList.remove('scale-100');
    lightboxImg.classList.add('scale-95');
    
    // Restore background scrolling
    document.body.style.overflow = ''; 
    
    // Wait for the CSS transition to finish (300ms) before fully hiding it
    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightboxImg.src = ''; // Clear source to prevent ghost flashes on next open
    }, 300);
}

/* ---------------------------------------------------
   DOM-Dependent Initialization
   --------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------
       2. Upgraded Wave & Satellite Animation Engine
       --------------------------------------------------- */
    const canvas = document.getElementById('eceCanvas');
    const ctx = canvas.getContext('2d');
    
    let waves = [];
    let emPulses = [];
    let satellites = [];
    let ambientParticles = [];

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // New feature: Ambient Particles for visual goodness
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw(ctx) {
            const isDark = document.documentElement.classList.contains('dark');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? `rgba(96, 165, 250, ${this.opacity})` : `rgba(59, 130, 246, ${this.opacity})`;
            ctx.fill();
        }
    }

    // 1. Radar-Style Carrier Waves (Bold & High Contrast)
    class Wave {
        constructor() { this.reset(); }
        reset() {
            this.r = 68;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.speed = 0.3 + Math.random() * 0.4; // Speed cut in half
            this.maxR = Math.max(canvas.width, canvas.height);
        }
        update() {
            this.r += this.speed;
            if (this.r > this.maxR) this.reset(); 
        }
        draw(ctx) {
            const isDark = document.documentElement.classList.contains('dark');
            let opacity = Math.max(0, 1 - Math.pow(this.r / this.maxR, 2)); 
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            
            // Softer base colors
            ctx.strokeStyle = isDark ? `rgba(244, 209, 96, ${opacity * 0.6})` : `rgba(0, 79, 159, ${opacity * 0.4})`;
            ctx.lineWidth = isDark ? 2.5 : 2.0; 
            
            // Wider spacing on dashes
            ctx.setLineDash([15, 40]);
            ctx.lineDashOffset = -this.r * 0.2; 
            
            if (isDark) {
                ctx.shadowBlur = 5; // Reduced glow
                ctx.shadowColor = `rgba(244, 209, 96, ${opacity * 0.5})`;
            }

            ctx.stroke();
            ctx.setLineDash([]); 
            ctx.shadowBlur = 0;  
        }
    }

    class EMPulse {
        constructor() { this.reset(); }
        reset() {
            this.angle = Math.random() * Math.PI * 2;
            this.radius = 40; 
            this.speed = 1.5 + Math.random() * 1.5; 
            this.amplitude = 8 + Math.random() * 5; 
            this.frequency = 0.08; 
            this.length = 150 + Math.random() * 100; 
            this.phase = Math.random() * Math.PI * 2; 
            this.maxRadius = Math.max(canvas.width, canvas.height) * 1.5;
        }
        update() {
            this.radius += this.speed;
            this.phase -= 0.15; 
            if (this.radius - this.length > this.maxRadius) this.reset();
        }
        draw(ctx, cx, cy) {
            const isDark = document.documentElement.classList.contains('dark');
            let opacity = Math.max(0, 1 - (this.radius / this.maxRadius));
            if (opacity <= 0) return;

            ctx.beginPath();
            ctx.strokeStyle = isDark ? `rgba(167, 139, 250, ${opacity * 0.9})` : `rgba(139, 92, 246, ${opacity * 0.7})`;
            ctx.lineWidth = 2.5;
            
            if (isDark) {
                ctx.shadowBlur = 12; 
                ctx.shadowColor = `rgba(167, 139, 250, ${opacity * 0.8})`;
            }

            let startR = Math.max(0, this.radius - this.length);
            let endR = this.radius;

            for(let r = startR; r <= endR; r += 2) {
                let packetPos = (r - startR) / this.length; 
                let envelope = Math.sin(packetPos * Math.PI); 
                let displacement = Math.sin(r * this.frequency + this.phase) * this.amplitude * envelope;
                
                let px = cx + Math.cos(this.angle) * r + Math.cos(this.angle + Math.PI/2) * displacement;
                let py = cy + Math.sin(this.angle) * r + Math.sin(this.angle + Math.PI/2) * displacement;
                
                if(r === startR) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.shadowBlur = 0; 
        }
    }

    class Satellite {
        constructor(orbitRadius, tiltX, tiltY) {
            this.orbitRadius = orbitRadius; 
            this.tiltX = tiltX; 
            this.tiltY = tiltY; 
            this.angle = Math.random() * Math.PI * 2;
            this.speed = 0.0015 + Math.random() * 0.001; 
            this.blinkTimer = 0;
        }

        get3DPos(theta) {
            let bx = Math.cos(theta) * this.orbitRadius;
            let by = Math.sin(theta) * this.orbitRadius;
            let bz = 0;

            let y1 = by * Math.cos(this.tiltX) - bz * Math.sin(this.tiltX);
            let z1 = by * Math.sin(this.tiltX) + bz * Math.cos(this.tiltX);

            let x2 = bx * Math.cos(this.tiltY) + z1 * Math.sin(this.tiltY);
            let z2 = -bx * Math.sin(this.tiltY) + z1 * Math.cos(this.tiltY);

            return { x: x2, y: y1, z: z2 };
        }

        update() {
            this.angle += this.speed;
            this.blinkTimer++;
        }

        draw(ctx, cx, cy) {
            const isDark = document.documentElement.classList.contains('dark');
            const pathColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

            let steps = 60;
            ctx.beginPath();
            for (let i = 0; i <= steps; i++) {
                let t = (i / steps) * Math.PI * 2;
                let p = this.get3DPos(t);
                if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
                else ctx.lineTo(cx + p.x, cy + p.y);
            }
            ctx.strokeStyle = pathColor;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            let pos = this.get3DPos(this.angle);
            let depthScale = 1 + (pos.z / this.orbitRadius) * 0.5; 
            let satRadius = 4 * depthScale;

            ctx.beginPath();
            ctx.arc(cx + pos.x, cy + pos.y, satRadius, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? '#60a5fa' : '#3b82f6';
            
            if (isDark) {
                ctx.shadowBlur = 10 * depthScale; 
                ctx.shadowColor = '#60a5fa';
            }
            ctx.fill();
            ctx.shadowBlur = 0;

            if (this.blinkTimer % 120 < 60) {
                ctx.beginPath();
                ctx.arc(cx + pos.x, cy + pos.y, satRadius * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? `rgba(96, 165, 250, 0.4)` : `rgba(59, 130, 246, 0.3)`;
                ctx.fill();
            }
        }
    }

    // Initialize Systems 
    for (let i = 0; i < 60; i++) ambientParticles.push(new Particle());
    for (let i = 0; i < 5; i++) setTimeout(() => waves.push(new Wave()), i * 1500);
    for (let i = 0; i < 4; i++) setTimeout(() => emPulses.push(new EMPulse()), i * 2200);
    
    satellites.push(new Satellite(350, Math.PI / 6, Math.PI / 4)); 
    satellites.push(new Satellite(500, -Math.PI / 4, -Math.PI / 8)); 
    satellites.push(new Satellite(650, Math.PI / 2.2, 0)); 

    // --- ANIMATION LOOP & OFF-SCREEN PAUSE ---
    
    let animationFrameId;
    // FIX: Start as false so the observer triggers the first frame on load
    let isAnimating = false; 

    function animateCanvas() {
        if (!isAnimating) return; // Immediately stop if paused

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let cx = canvas.width / 2;
        let cy = canvas.height / 2;

        if (canvas.width < 768) {
            cy = canvas.height * 0.30; 
        }

        ambientParticles.forEach(p => { p.update(); p.draw(ctx); });
        waves.forEach(wave => { wave.update(); wave.draw(ctx, cx, cy); });
        emPulses.forEach(pulse => { pulse.update(); pulse.draw(ctx, cx, cy); });
        satellites.forEach(sat => { sat.update(); sat.draw(ctx, cx, cy); });
        
        animationFrameId = requestAnimationFrame(animateCanvas);
    }

    // Set up the Intersection Observer
    const heroSection = document.querySelector('.hero-bg');
    
    // This watches the hero section. 
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Wakes up the animation when visible
                if (!isAnimating) {
                    isAnimating = true;
                    animateCanvas(); 
                }
            } else {
                // Puts it to sleep when out of view
                isAnimating = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId); 
                }
            }
        });
    }, { threshold: 0.01 });

    // Start observing the hero section
    if (heroSection) {
        observer.observe(heroSection);
    } else {
        // Fallback just in case the class name changes
        isAnimating = true;
        animateCanvas(); 
    }

    /* ---------------------------------------------------
       3. UI Interactions & Chart.js Config 
       --------------------------------------------------- */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    const chartCtx = document.getElementById('academicChart').getContext('2d');
    
    const data = {
        labels: ['SSC (2022)', 'PUC (2024)', 'B.Tech (Current)'],
        datasets: [{
            label: 'Normalized Score (%)',
            data: [96.5, 97.9, 87.1],
            borderColor: '#3b82f6', 
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderWidth: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#3b82f6',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: true,
            tension: 0.4 
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleFont: { family: 'Inter, sans-serif', size: 13 },
                    bodyFont: { family: 'Inter, sans-serif', size: 14, weight: 'bold' },
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let raw = context.raw;
                            if(context.dataIndex === 0) return raw + '%';
                            if(context.dataIndex === 1) return (raw/10).toFixed(2) + ' CGPA (' + raw + '%)';
                            if(context.dataIndex === 2) return (raw/10).toFixed(2) + ' CGPA (' + raw + '%)';
                            return raw;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 80, max: 100,
                    ticks: { font: { family: 'Inter, sans-serif' }, color: '#64748b' },
                    grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false }
                },
                x: {
                    ticks: { font: { family: 'Inter, sans-serif', weight: '500' }, color: '#475569' },
                    grid: { display: false, drawBorder: false }
                }
            },
            interaction: { intersect: false, mode: 'index' },
        }
    };

    new Chart(chartCtx, config);

    /* ---------------------------------------------------
       4. Lightbox Gallery Logic 
       --------------------------------------------------- */
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');

    // Feature: Close lightbox when clicking the dark background outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Feature: Close lightbox when hitting the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
});
