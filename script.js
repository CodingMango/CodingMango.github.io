/* ---------------------------------------------------
   1. Telegram-Style Dark Mode Toggle 
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
   2. Upgraded Lightbox Gallery Logic (Global Scope)
   --------------------------------------------------- */
function openLightbox(imageSrc, title, desc) {
    const modal = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const textContainer = document.getElementById('lightbox-text-container');

    if (!modal || !img) {
        console.error("Lightbox elements not found in the HTML.");
        return;
    }

    // Populate the data
    img.src = imageSrc;
    if (titleEl) titleEl.innerText = title || '';
    if (descEl) descEl.innerText = desc || '';
    
    // Make it visible
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
    
    // Trigger animations
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        img.classList.remove('scale-95');
        img.classList.add('scale-100');
        
        if (textContainer) {
            setTimeout(() => {
                textContainer.classList.remove('opacity-0', 'translate-y-4');
            }, 150);
        }
    }, 10);
}

function closeLightbox() {
    const modal = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const textContainer = document.getElementById('lightbox-text-container');

    if (!modal) return;

    // Reverse animations
    modal.classList.add('opacity-0');
    if (img) {
        img.classList.remove('scale-100');
        img.classList.add('scale-95');
    }
    if (textContainer) {
        textContainer.classList.add('opacity-0', 'translate-y-4');
    }
    
    document.body.style.overflow = ''; 
    
    // Hide entirely after transition
    setTimeout(() => {
        modal.classList.add('hidden');
        if (img) img.src = ''; 
        
        const titleEl = document.getElementById('lightbox-title');
        const descEl = document.getElementById('lightbox-desc');
        if (titleEl) titleEl.innerText = '';
        if (descEl) descEl.innerText = '';
    }, 300);
}

/* ---------------------------------------------------
   3. DOM-Dependent Initialization (Canvas, Chart, Menu)
   --------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        const menuIcon = mobileBtn.querySelector('i');
        
        function toggleMenu() {
            // Toggle smooth sliding and fading classes
            mobileMenu.classList.toggle('max-h-0');
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('max-h-[400px]');
            mobileMenu.classList.toggle('opacity-100');
            
            // Toggle the hamburger icon to an "X" with a smooth spin
            if (menuIcon) {
                menuIcon.style.transition = 'transform 0.3s ease';
                menuIcon.classList.toggle('fa-bars');
                menuIcon.classList.toggle('fa-xmark');
                
                // Track rotation to keep spinning it back and forth
                if (menuIcon.style.transform === 'rotate(90deg)') {
                    menuIcon.style.transform = 'rotate(0deg)';
                } else {
                    menuIcon.style.transform = 'rotate(90deg)';
                }
            }
        }

        mobileBtn.addEventListener('click', toggleMenu);
        
        // Ensure it closes smoothly when a user clicks a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('max-h-[400px]')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- Chart.js Config ---
    const chartCanvas = document.getElementById('academicChart');
    if (chartCanvas) {
        const chartCtx = chartCanvas.getContext('2d');
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
    }
    // --- Advanced Mobile Toast Notification Trigger ---
    setTimeout(() => {
        const toast = document.getElementById('desktop-toast');
        const progressBar = document.getElementById('toast-progress');
        
        if (toast && window.innerWidth < 768) {
            // Slide the toast up
            toast.classList.remove('translate-y-[150%]', 'opacity-0');
            
            // Start the progress bar shrinking animation
            setTimeout(() => {
                if (progressBar) progressBar.style.transform = 'scaleX(0)';
            }, 50);

            // Auto-dismiss the toast when the progress bar hits 0 (10 seconds)
            setTimeout(() => {
                if (!toast.classList.contains('translate-y-[150%]')) {
                    toast.classList.add('translate-y-[150%]', 'opacity-0');
                }
            }, 10000);
        }
    }, 2000);
    // --- Wave & Satellite Animation Engine ---
    const canvas = document.getElementById('eceCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let waves = [];
        let emPulses = [];
        let satellites = [];
        let ambientParticles = [];
        let singularities = []; 
        let pulseAngleTracker = 0; 

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // 1. TRUE 3D SINGULARITY (Unified Flat Plane)
        class Singularity {
            constructor(relX, relY, scale, tiltAngle) {
                this.relX = relX; 
                this.relY = relY; 
                this.scale = scale; 
                this.tiltAngle = tiltAngle; 
                this.rotation = 0;
                
                this.dust = Array.from({length: 45}, () => ({
                    angle: Math.random() * Math.PI * 2,
                    dist: 20 + Math.random() * 40, 
                    speed: 0.01 + Math.random() * 0.015 
                }));
            }
            
            draw(ctx) {
                if (canvas.width < 768) return; 

                const isDark = document.documentElement.classList.contains('dark');
                let x = canvas.width * this.relX;
                let y = canvas.height * this.relY;
                let r = 12 * this.scale; 

                // Aspect ratio is fixed to 1.2/4.5 = 0.266
                let diskRx = r * 4.5;
                let diskRy = r * 1.2;

                // Ambient Space Glow
                let gradSphere = ctx.createRadialGradient(x, y, r * 1.1, x, y, r * 5);
                gradSphere.addColorStop(0, isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(37, 99, 235, 0.1)');
                gradSphere.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.beginPath();
                ctx.arc(x, y, r * 5, 0, Math.PI * 2);
                ctx.fillStyle = gradSphere;
                ctx.fill();

                // EVERYTHING rotates in this exact direction
                this.rotation -= 0.005; 

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(this.tiltAngle); // Lock entire system to one 3D tilt

                // Spin the accretion disk gradient 
                ctx.save();
                ctx.rotate(this.rotation);
                let diskGrad = ctx.createLinearGradient(-diskRx, 0, diskRx, 0);
                diskGrad.addColorStop(0, 'rgba(0,0,0,0)');
                diskGrad.addColorStop(0.2, isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(59, 130, 246, 0.7)');
                diskGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
                diskGrad.addColorStop(0.8, isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(59, 130, 246, 0.7)');
                diskGrad.addColorStop(1, 'rgba(0,0,0,0)');

                // Draw BACK half of the disk
                ctx.beginPath();
                ctx.ellipse(0, 0, diskRx, diskRy, 0, Math.PI, Math.PI * 2);
                ctx.strokeStyle = diskGrad;
                ctx.lineWidth = 1.5 * this.scale;
                ctx.stroke();
                ctx.restore(); // Undo rotation just for the static void

                // Pitch-Black Void & Photon Ring
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.fillStyle = '#000000'; 
                ctx.fill();
                ctx.lineWidth = 0.8 * this.scale;
                ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.8)';
                ctx.stroke();

                // Draw FRONT half of the disk & Dust
                ctx.save();
                ctx.rotate(this.rotation);

                ctx.beginPath();
                ctx.ellipse(0, 0, diskRx, diskRy, 0, 0, Math.PI);
                ctx.strokeStyle = diskGrad;
                ctx.lineWidth = 2.5 * this.scale;
                ctx.shadowBlur = 15 * this.scale;
                ctx.shadowColor = isDark ? '#a78bfa' : '#60a5fa';
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Draw granular dust dots perfectly locked to the exact same disk plane
                this.dust.forEach(d => {
                    d.angle -= d.speed; // Force same direction
                    d.dist -= 0.03; 
                    if(d.dist < r) d.dist = 20 + Math.random() * 30; 
                    
                    let px = Math.cos(d.angle) * (d.dist * this.scale);
                    let py = Math.sin(d.angle) * (d.dist * this.scale * 0.266); // Locked to 0.266 ratio
                    
                    ctx.beginPath();
                    ctx.arc(px, py, 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = isDark ? `rgba(196, 181, 253, ${d.dist/40})` : `rgba(147, 197, 253, ${d.dist/40})`;
                    ctx.fill();
                });

                ctx.restore(); // Front half
                ctx.restore(); // Global tilt
            }
        }

        // 2. BUBBLE GUM PARTICLES
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.25;
                this.speedY = (Math.random() - 0.5) * 0.25;
                this.opacity = Math.random() * 0.5;
                
                this.isSucked = false;
                this.isSwallowed = false;
                this.swallowTimer = 0;
                this.history = [];
                this.tailLength = 0; 
            }
            update(singularities) {
                if (!this.isSucked) {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                    if (canvas.width >= 768) { 
                        for (let bh of singularities) {
                            let bhX = canvas.width * bh.relX;
                            let bhY = canvas.height * bh.relY;
                            let dist = Math.hypot(bhX - this.x, bhY - this.y);
                            
                            if (dist < 150 * bh.scale) {
                                this.isSucked = true;
                                this.targetBH = bh;
                                
                                let dx = this.x - bhX;
                                let dy = this.y - bhY;
                                let tilt = bh.tiltAngle;
                                
                                let unRotX = dx * Math.cos(-tilt) - dy * Math.sin(-tilt);
                                let unRotY = dx * Math.sin(-tilt) + dy * Math.cos(-tilt);
                                let unSqY = unRotY / 0.266; // Locked mathematically
                                
                                this.orbitAngle = Math.atan2(unSqY, unRotX);
                                this.orbitDist = Math.hypot(unRotX, unSqY);
                                this.initialOrbitDist = this.orbitDist;
                                
                                this.orbitSpeed = -0.015; // Forced unified direction
                                break;
                            }
                        }
                    }
                } else if (!this.isSwallowed) {
                    let bhX = canvas.width * this.targetBH.relX;
                    let bhY = canvas.height * this.targetBH.relY;

                    this.orbitAngle += this.orbitSpeed;
                    this.orbitSpeed *= 1.015;
                    if (Math.abs(this.orbitSpeed) > 0.10) this.orbitSpeed = -0.10;

                    let inwardSpeed = (this.initialOrbitDist / (4 * Math.PI)) * Math.abs(this.orbitSpeed);
                    this.orbitDist -= inwardSpeed;

                    let localX = Math.cos(this.orbitAngle) * this.orbitDist;
                    let localY = Math.sin(this.orbitAngle) * this.orbitDist * 0.266; // Locked mathematically

                    let tilt = this.targetBH.tiltAngle;
                    let worldDx = localX * Math.cos(tilt) - localY * Math.sin(tilt);
                    let worldDy = localX * Math.sin(tilt) + localY * Math.cos(tilt);

                    this.x = bhX + worldDx;
                    this.y = bhY + worldDy;

                    this.tailLength += 0.5;
                    if (this.tailLength > 35) this.tailLength = 35;

                    if (this.orbitDist < 3 * this.targetBH.scale) {
                        this.isSwallowed = true;
                    }
                } else {
                    let bhX = canvas.width * this.targetBH.relX;
                    let bhY = canvas.height * this.targetBH.relY;
                    this.x = bhX;
                    this.y = bhY; 
                    
                    this.swallowTimer++;
                    if (this.swallowTimer > this.history.length) {
                        this.reset();
                    }
                }

                if (this.isSucked) {
                    this.history.unshift({x: this.x, y: this.y});
                    if (this.history.length > this.tailLength && !this.isSwallowed) {
                        this.history.pop();
                    } else if (this.isSwallowed) {
                        this.history.pop(); 
                    }
                }
            }
            draw(ctx) {
                const isDark = document.documentElement.classList.contains('dark');
                let color = isDark ? `rgba(96, 165, 250, ${this.opacity})` : `rgba(59, 130, 246, ${this.opacity})`;
                
                if (!this.isSucked) {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    if (this.history.length < 2) return;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    
                    for (let i = 1; i < this.history.length; i++) {
                        ctx.beginPath();
                        ctx.moveTo(this.history[i-1].x, this.history[i-1].y);
                        ctx.lineTo(this.history[i].x, this.history[i].y);
                        
                        let progress = 1 - (i / this.history.length);
                        let thickness = Math.max(0.2, this.size * 2.5 * progress); 
                        
                        if (this.isSwallowed) {
                            thickness *= Math.max(0, 1 - (this.swallowTimer / 35)); 
                        }
                        
                        ctx.lineWidth = thickness;
                        ctx.strokeStyle = color;
                        ctx.stroke();
                    }
                }
            }
        }

        // 3. ELASTIC WAVEFRONT
        class Wave {
            constructor() { this.active = false; }
            reset(cx, cy) {
                this.cx = cx; this.cy = cy;
                this.points = [];
                this.baseRadius = 68;
                this.speed = 0.25 + Math.random() * 0.2;
                
                for(let i=0; i<150; i++) {
                    this.points.push({
                        angle: (i / 150) * Math.PI * 2,
                        dispX: 0, dispY: 0, 
                        active: true
                    });
                }
                this.active = true;
                this.life = 0;
            }
            update(singularities, cx, cy) {
                if (!this.active) { this.reset(cx, cy); return; }
                this.life++;
                this.baseRadius += this.speed; 
                
                let activePoints = 0;

                for (let p of this.points) {
                    if (!p.active) continue;
                    
                    let baseX = cx + Math.cos(p.angle) * this.baseRadius;
                    let baseY = cy + Math.sin(p.angle) * this.baseRadius;
                    
                    let px = baseX + p.dispX;
                    let py = baseY + p.dispY;

                    let pullX = 0, pullY = 0;
                    if (canvas.width >= 768) {
                        for (let bh of singularities) {
                            let dx = (canvas.width * bh.relX) - px;
                            let dy = (canvas.height * bh.relY) - py;
                            let dist = Math.hypot(dx, dy);
                            
                            if (dist < 12 * bh.scale) { p.active = false; continue; } 
                            
                            let gravityWell = 300 * bh.scale;
                            if (dist < gravityWell) {
                                let force = Math.pow((gravityWell - dist) / gravityWell, 2.5) * 4;
                                pullX += (dx / dist) * force;
                                pullY += (dy / dist) * force;
                            }
                        }
                    }
                    if (!p.active) continue;
                    activePoints++;
                    p.dispX += pullX;
                    p.dispY += pullY;

                    p.x = baseX + p.dispX;
                    p.y = baseY + p.dispY;
                }
                
                if (activePoints === 0 || this.baseRadius > Math.max(canvas.width, canvas.height) * 1.2) {
                    this.reset(cx, cy);
                }
            }
            draw(ctx) {
                if (!this.active) return;
                const isDark = document.documentElement.classList.contains('dark');
                let opacity = Math.max(0, 1 - (this.baseRadius / Math.max(canvas.width, canvas.height))); 
                
                ctx.beginPath();
                let isDrawing = false;
                
                ctx.strokeStyle = isDark ? `rgba(244, 209, 96, ${opacity * 0.6})` : `rgba(15, 40, 100, ${opacity * 0.55})`;
                ctx.lineWidth = 2.5;
                ctx.setLineDash([15, 40]);
                if (isDark) { ctx.shadowBlur = 5; ctx.shadowColor = `rgba(244, 209, 96, ${opacity * 0.5})`; }

                for (let i = 0; i <= this.points.length; i++) {
                    let p = this.points[i % this.points.length];
                    if (p.active && p.x) {
                        if (!isDrawing) { ctx.moveTo(p.x, p.y); isDrawing = true; } 
                        else { ctx.lineTo(p.x, p.y); }
                    } else { isDrawing = false; }
                }
                ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0;
            }
        }

        // 4. EM PULSE
        class EMPulse {
            constructor() { this.active = false; }
            reset(cx, cy) {
                this.history = [];
                pulseAngleTracker += (Math.PI / 2) + (Math.random() * 0.5); 
                this.angle = pulseAngleTracker;
                
                this.speed = 2.0 + Math.random() * 1.5; 
                this.amplitude = 12 + Math.random() * 8; 
                this.isSucked = false;
                this.isSwallowed = false; 
                this.swallowTimer = 0;
                this.active = true;
                this.x = cx; this.y = cy;
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
                this.life = 0;
            }
            update(singularities, cx, cy) {
                if (!this.active) { this.reset(cx, cy); return; }
                this.life++;

                if (!this.isSucked) {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (canvas.width >= 768) {
                        for (let bh of singularities) {
                            let bhX = canvas.width * bh.relX;
                            let bhY = canvas.height * bh.relY;
                            let dist = Math.hypot(bhX - this.x, bhY - this.y);

                            if (dist < 180 * bh.scale) {
                                this.isSucked = true;
                                this.targetBH = bh;
                                
                                let dx = this.x - bhX;
                                let dy = this.y - bhY;
                                let tilt = bh.tiltAngle;
                                
                                let unRotX = dx * Math.cos(-tilt) - dy * Math.sin(-tilt);
                                let unRotY = dx * Math.sin(-tilt) + dy * Math.cos(-tilt);
                                let unSqY = unRotY / 0.266; // Locked mathematically
                                
                                this.orbitAngle = Math.atan2(unSqY, unRotX);
                                this.orbitDist = Math.hypot(unRotX, unSqY);
                                
                                this.orbitSpeed = -0.02; // Forced unified direction
                                this.inwardSpeed = 0.15;
                                break;
                            }
                        }
                    }
                    if (Math.hypot(this.x - cx, this.y - cy) > Math.max(canvas.width, canvas.height) * 1.2) {
                        this.reset(cx, cy);
                    }
                } else if (!this.isSwallowed) {
                    let bhX = canvas.width * this.targetBH.relX;
                    let bhY = canvas.height * this.targetBH.relY;

                    this.orbitAngle += this.orbitSpeed;
                    this.orbitDist -= this.inwardSpeed;
                    
                    this.orbitSpeed *= 1.015;
                    this.inwardSpeed *= 1.015;

                    if (Math.abs(this.orbitSpeed) > 0.10) this.orbitSpeed = -0.10;

                    let localX = Math.cos(this.orbitAngle) * this.orbitDist;
                    let localY = Math.sin(this.orbitAngle) * this.orbitDist * 0.266; // Locked mathematically

                    let tilt = this.targetBH.tiltAngle;
                    let worldDx = localX * Math.cos(tilt) - localY * Math.sin(tilt);
                    let worldDy = localX * Math.sin(tilt) + localY * Math.cos(tilt);

                    this.x = bhX + worldDx;
                    this.y = bhY + worldDy;

                    if (this.orbitDist < 3 * this.targetBH.scale) {
                        this.isSwallowed = true;
                    }
                } else {
                    let bhX = canvas.width * this.targetBH.relX;
                    let bhY = canvas.height * this.targetBH.relY;
                    
                    this.x = bhX;
                    this.y = bhY;
                    
                    this.swallowTimer++;
                    if (this.swallowTimer > 70) this.reset(cx, cy);
                }

                this.history.unshift({x: this.x, y: this.y});
                if (this.history.length > 70) this.history.pop(); 
            }
            
            draw(ctx) {
                if (!this.active || this.history.length < 2) return;
                const isDark = document.documentElement.classList.contains('dark');
                
                let colorCore = isDark ? '#ffffff' : '#0f172a';
                let colorE = isDark ? 'rgba(96, 165, 250, 0.9)' : 'rgba(37, 99, 235, 0.9)'; 
                let colorB = isDark ? 'rgba(248, 113, 113, 0.9)' : 'rgba(220, 38, 38, 0.9)'; 

                ctx.beginPath();
                ctx.moveTo(this.history[0].x, this.history[0].y);
                for (let i=1; i<this.history.length; i++) ctx.lineTo(this.history[i].x, this.history[i].y);
                ctx.strokeStyle = colorCore;
                ctx.lineWidth = 1.5;
                if (isDark) { ctx.shadowBlur = 8; ctx.shadowColor = '#8b5cf6'; }
                ctx.stroke();
                ctx.shadowBlur = 0;

                let ePoints = [];
                let bPoints = [];

                for (let i=0; i<this.history.length; i++) {
                    let p = this.history[i];
                    let prev = this.history[Math.max(0, i-1)];
                    let next = this.history[Math.min(this.history.length-1, i+1)];

                    let dirAngle = Math.atan2(next.y - prev.y, next.x - prev.x);
                    let angleE = dirAngle + Math.PI/2;       
                    let angleB = dirAngle - Math.PI/4;       

                    let env = Math.sin((i / this.history.length) * Math.PI); 
                    
                    let pointAmp = this.amplitude;
                    if (this.isSucked && this.targetBH) {
                        let bhX = canvas.width * this.targetBH.relX;
                        let bhY = canvas.height * this.targetBH.relY;
                        let distToBH = Math.hypot(p.x - bhX, p.y - bhY);
                        pointAmp = this.amplitude * Math.max(0, Math.min(1, distToBH / 150));
                    }

                    let val = Math.sin(i * 0.4 - this.life * 0.3) * pointAmp * env;

                    ePoints.push({ x: p.x + Math.cos(angleE) * val, y: p.y + Math.sin(angleE) * val });
                    bPoints.push({ x: p.x + Math.cos(angleB) * val * 0.6, y: p.y + Math.sin(angleB) * val * 0.6 });
                }

                ctx.beginPath();
                ctx.moveTo(ePoints[0].x, ePoints[0].y);
                for(let i=1; i<ePoints.length; i++) ctx.lineTo(ePoints[i].x, ePoints[i].y);
                ctx.strokeStyle = colorE;
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(bPoints[0].x, bPoints[0].y);
                for(let i=1; i<bPoints.length; i++) ctx.lineTo(bPoints[i].x, bPoints[i].y);
                ctx.strokeStyle = colorB;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // 5. SATELLITES
        class Satellite {
            constructor(orbitRadius, tiltX, tiltY) {
                this.orbitRadius = orbitRadius; this.tiltX = tiltX; this.tiltY = tiltY; 
                this.reset();
            }
            reset() {
                this.angle = Math.random() * Math.PI * 2;
                this.speed = 0.001 + Math.random() * 0.0005; 
                this.blinkTimer = 0;
                this.isSucked = false;
                this.stretch = 1;
            }
            get3DPos(theta) {
                let bx = Math.cos(theta) * this.orbitRadius;
                let by = Math.sin(theta) * this.orbitRadius;
                let y1 = by * Math.cos(this.tiltX);
                let z1 = by * Math.sin(this.tiltX);
                let x2 = bx * Math.cos(this.tiltY) + z1 * Math.sin(this.tiltY);
                let z2 = -bx * Math.sin(this.tiltY) + z1 * Math.cos(this.tiltY);
                return { x: x2, y: y1, z: z2 };
            }
            update(singularities, cx, cy) {
                if (!this.isSucked) {
                    this.angle += this.speed;
                    this.blinkTimer++;
                    let pos = this.get3DPos(this.angle);
                    this.currentX = cx + pos.x;
                    this.currentY = cy + pos.y;
                    
                    if (canvas.width >= 768) {
                        for(let bh of singularities) {
                            let dist = Math.hypot(this.currentX - (canvas.width * bh.relX), this.currentY - (canvas.height * bh.relY));
                            if (dist < 140 * bh.scale) {
                                this.isSucked = true;
                                this.targetBH = bh;
                                
                                // Added full 3D tilt logic to sucked-in satellites
                                let dx = this.currentX - (canvas.width * bh.relX);
                                let dy = this.currentY - (canvas.height * bh.relY);
                                let tilt = bh.tiltAngle;

                                let unRotX = dx * Math.cos(-tilt) - dy * Math.sin(-tilt);
                                let unRotY = dx * Math.sin(-tilt) + dy * Math.cos(-tilt);
                                let unSqY = unRotY / 0.266; // Locked mathematically

                                this.orbitAngle = Math.atan2(unSqY, unRotX);
                                this.orbitDist = Math.hypot(unRotX, unSqY);
                                
                                this.orbitSpeed = -0.015; // Forced unified direction
                                this.inwardSpeed = 0.025;
                                break;
                            }
                        }
                    }
                } else {
                    this.blinkTimer += 2; 
                    this.orbitAngle += this.orbitSpeed;
                    this.orbitDist -= this.inwardSpeed;
                    this.orbitSpeed *= 1.015;
                    this.inwardSpeed *= 1.015;

                    let localX = Math.cos(this.orbitAngle) * this.orbitDist;
                    let localY = Math.sin(this.orbitAngle) * this.orbitDist * 0.266; // Locked mathematically
                    let tilt = this.targetBH.tiltAngle;

                    let worldDx = localX * Math.cos(tilt) - localY * Math.sin(tilt);
                    let worldDy = localX * Math.sin(tilt) + localY * Math.cos(tilt);

                    this.currentX = (canvas.width * this.targetBH.relX) + worldDx;
                    this.currentY = (canvas.height * this.targetBH.relY) + worldDy;
                    this.stretch += 0.08; 
                    
                    if (this.orbitDist < 10 * this.targetBH.scale || this.stretch > 10) this.reset();
                }
            }
            draw(ctx, cx, cy) {
                const isDark = document.documentElement.classList.contains('dark');
                let pos = this.get3DPos(this.angle);
                let depthScale = this.isSucked ? 1 : 1 + (pos.z / this.orbitRadius) * 0.5; 
                let satRadius = 4 * depthScale;

                if (!this.isSucked) {
                    ctx.beginPath();
                    for (let i = 0; i <= 60; i++) {
                        let p = this.get3DPos((i / 60) * Math.PI * 2);
                        if (i === 0) ctx.moveTo(cx + p.x, cy + p.y); else ctx.lineTo(cx + p.x, cy + p.y);
                    }
                    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
                    ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
                } else {
                    satRadius = Math.max(0.5, satRadius / (this.stretch * 0.5));
                }

                ctx.fillStyle = isDark ? '#60a5fa' : '#3b82f6';
                if (!this.isSucked) {
                    ctx.beginPath(); ctx.arc(this.currentX, this.currentY, Math.max(0, satRadius), 0, Math.PI * 2);
                    if (isDark) { ctx.shadowBlur = 10 * depthScale; ctx.shadowColor = '#60a5fa'; }
                    ctx.fill(); ctx.shadowBlur = 0;
                    if (this.blinkTimer % 120 < 60) {
                        ctx.beginPath(); ctx.arc(this.currentX, this.currentY, Math.max(0, satRadius * 2.5), 0, Math.PI * 2);
                        ctx.fillStyle = isDark ? `rgba(96, 165, 250, 0.4)` : `rgba(59, 130, 246, 0.3)`; ctx.fill();
                    }
                } else {
                    ctx.save(); 
                    ctx.translate(this.currentX, this.currentY); 
                    ctx.rotate(this.orbitAngle + this.targetBH.tiltAngle + Math.PI/2); // Aligned to plane
                    ctx.beginPath(); 
                    ctx.ellipse(0, 0, satRadius, satRadius * this.stretch, 0, 0, Math.PI * 2);
                    ctx.fill(); 
                    ctx.restore();
                }
            }
        }

        // Deploy Systems
        singularities.push(new Singularity(0.12, 0.18, 0.85, Math.PI / 6));   
        singularities.push(new Singularity(0.88, 0.25, 0.65, -Math.PI / 4)); 
        singularities.push(new Singularity(0.18, 0.85, 0.7, -Math.PI / 8));  
        singularities.push(new Singularity(0.82, 0.88, 0.5, Math.PI / 3));  

        for (let i = 0; i < 60; i++) ambientParticles.push(new Particle());
        for (let i = 0; i < 5; i++) setTimeout(() => waves.push(new Wave()), i * 1500);
        for (let i = 0; i < 3; i++) setTimeout(() => emPulses.push(new EMPulse()), i * 3500);
        
        satellites.push(new Satellite(350, Math.PI / 6, Math.PI / 4)); 
        satellites.push(new Satellite(500, -Math.PI / 4, -Math.PI / 8)); 
        satellites.push(new Satellite(650, Math.PI / 2.2, 0)); 
        
        let animationFrameId;
        let isAnimating = false; 

        function animateCanvas() {
            if (!isAnimating) return; 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let cx = canvas.width / 2;
            let cy = canvas.height / 2;
            if (canvas.width < 768) cy = canvas.height * 0.30; 

            ambientParticles.forEach(p => { p.update(singularities); p.draw(ctx); });
            singularities.forEach(bh => { bh.draw(ctx); });
            waves.forEach(wave => { wave.update(singularities, cx, cy); wave.draw(ctx); });
            emPulses.forEach(pulse => { pulse.update(singularities, cx, cy); pulse.draw(ctx); });
            satellites.forEach(sat => { sat.update(singularities, cx, cy); sat.draw(ctx, cx, cy); });
            
            animationFrameId = requestAnimationFrame(animateCanvas);
        }

        const heroSection = document.querySelector('.hero-bg');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isAnimating) { isAnimating = true; animateCanvas(); }
                } else {
                    isAnimating = false;
                    if (animationFrameId) cancelAnimationFrame(animationFrameId); 
                }
            });
        }, { threshold: 0.01 });

        if (heroSection) { observer.observe(heroSection); } else { isAnimating = true; animateCanvas(); }
    }
});