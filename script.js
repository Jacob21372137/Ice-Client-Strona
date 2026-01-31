// Particle Effect for Cursor
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 50;
        this.particleColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#4fc3f7';
        this.init();
    }

    init() {
        // Create canvas for particles
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9998';
        document.body.appendChild(this.canvas);

        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse position
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.mouseVelocity = 0;

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Calculate mouse velocity
            const dx = this.mouseX - this.prevMouseX;
            const dy = this.mouseY - this.prevMouseY;
            this.mouseVelocity = Math.sqrt(dx * dx + dy * dy);
            
            // Create particles based on velocity
            this.createParticles(e.clientX, e.clientY);
        });

        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles(x, y) {
        // Create more particles when moving faster
        const count = Math.min(Math.floor(this.mouseVelocity / 5), 5);
        
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) {
                this.particles.shift();
            }
            
            const particle = {
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 5,
                speedY: (Math.random() - 0.5) * 5,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                color: this.particleColor,
                alpha: Math.random() * 0.5 + 0.5
            };
            
            this.particles.push(particle);
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            p.speedX *= 0.95;
            p.speedY *= 0.95;
            p.size *= 0.98;
            
            if (p.life <= 0 || p.size <= 0.1) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = p.life * p.alpha;
            this.ctx.fillStyle = p.color;
            
            // Create ice/snow-like particles
            this.ctx.beginPath();
            
            if (Math.random() > 0.5) {
                // Snowflake shape
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                
                // Add snowflake arms
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x1 = p.x + Math.cos(angle) * p.size * 2;
                    const y1 = p.y + Math.sin(angle) * p.size * 2;
                    const x2 = p.x + Math.cos(angle) * p.size;
                    const y2 = p.y + Math.sin(angle) * p.size;
                    
                    this.ctx.moveTo(x2, y2);
                    this.ctx.lineTo(x1, y1);
                }
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = p.size / 3;
                this.ctx.stroke();
            } else {
                // Simple circle particle
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
            
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = p.size * 2;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            
            this.ctx.restore();
        }
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Custom Cursor Effect
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.init();
    }

    init() {
        // Create custom cursor
        this.cursor.style.position = 'fixed';
        this.cursor.style.width = '20px';
        this.cursor.style.height = '20px';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.backgroundColor = 'transparent';
        this.cursor.style.border = '2px solid var(--primary)';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '9999';
        this.cursor.style.transition = 'transform 0.1s, width 0.2s, height 0.2s';
        this.cursor.style.boxShadow = '0 0 15px var(--primary)';
        
        // Create inner dot
        this.innerDot = document.createElement('div');
        this.innerDot.style.position = 'absolute';
        this.innerDot.style.width = '6px';
        this.innerDot.style.height = '6px';
        this.innerDot.style.borderRadius = '50%';
        this.innerDot.style.backgroundColor = 'var(--primary)';
        this.innerDot.style.top = '50%';
        this.innerDot.style.left = '50%';
        this.innerDot.style.transform = 'translate(-50%, -50%)';
        this.innerDot.style.transition = 'transform 0.2s';
        
        this.cursor.appendChild(this.innerDot);
        document.body.appendChild(this.cursor);

        // Hide default cursor
        document.body.style.cursor = 'none';
        document.body.classList.add('custom-cursor-active');

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        // Hover effects
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursor.style.borderColor = 'var(--accent)';
                this.innerDot.style.backgroundColor = 'var(--accent)';
                this.innerDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            } else if (target.closest('.team-card') || target.closest('.feature-card') || target.closest('.pricing-card')) {
                this.cursor.style.transform = 'scale(1.3)';
                this.innerDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                if (!e.relatedTarget || (e.relatedTarget.tagName !== 'A' && e.relatedTarget.tagName !== 'BUTTON' && 
                    !e.relatedTarget.closest('a') && !e.relatedTarget.closest('button'))) {
                    this.cursor.style.transform = 'scale(1)';
                    this.cursor.style.borderColor = 'var(--primary)';
                    this.innerDot.style.backgroundColor = 'var(--primary)';
                    this.innerDot.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            } else if (target.closest('.team-card') || target.closest('.feature-card') || target.closest('.pricing-card')) {
                if (!e.relatedTarget || (!e.relatedTarget.closest('.team-card') && !e.relatedTarget.closest('.feature-card') && 
                    !e.relatedTarget.closest('.pricing-card'))) {
                    this.cursor.style.transform = 'scale(1)';
                    this.innerDot.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            }
        });

        // Click effect
        document.addEventListener('mousedown', () => {
            this.cursor.style.transform = 'scale(0.8)';
            this.innerDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            this.cursor.style.transform = 'scale(1)';
            this.innerDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }
}

// Toggle mobile menu
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Smooth scroll for navigation links - POPRAWIONE
document.querySelectorAll('.nav-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // Jeśli klikamy "Strona główna" (targetId to "#" lub pusty), przewiń do góry
        if (targetId === '#' || targetId === '') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Calculate the position to scroll to
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Scroll to element
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Pricing cards hover effect
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 40px rgba(79, 195, 247, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeOptions = document.querySelectorAll('.theme-option');

let currentTheme = 'default';

// Theme configurations
const themes = {
    default: {
        primary: '#4fc3f7',
        primaryDark: '#039be5',
        bgDark: '#0a1929',
        bgDarker: '#051423',
        textPrimary: '#e3f2fd'
    },
    dark: {
        primary: '#333333',
        primaryDark: '#1a1a1a',
        bgDark: '#0a0a0a',
        bgDarker: '#050505',
        textPrimary: '#ffffff'
    },
    purple: {
        primary: '#9b59b6',
        primaryDark: '#8e44ad',
        bgDark: '#1a1035',
        bgDarker: '#0f0820',
        textPrimary: '#f3e5f5'
    },
    green: {
        primary: '#2ecc71',
        primaryDark: '#27ae60',
        bgDark: '#0a291a',
        bgDarker: '#051910',
        textPrimary: '#e8f5e9'
    }
};

// Theme changer function
function changeTheme(themeName) {
    const theme = themes[themeName];
    
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--primary-dark', theme.primaryDark);
    document.documentElement.style.setProperty('--bg-dark', theme.bgDark);
    document.documentElement.style.setProperty('--bg-darker', theme.bgDarker);
    document.documentElement.style.setProperty('--text-primary', theme.textPrimary);
    
    currentTheme = themeName;
    
    // Save to localStorage
    localStorage.setItem('iceClientTheme', themeName);
    
    // Update active theme button
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === themeName) {
            option.classList.add('active');
            option.style.borderColor = theme.primary;
        }
    });
    
    // Dispatch theme changed event
    document.dispatchEvent(new Event('themeChanged'));
}

// Theme toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const themeNames = Object.keys(themes);
        const currentIndex = themeNames.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        const nextTheme = themeNames[nextIndex];
        
        changeTheme(nextTheme);
        
        // Show notification
        showNotification(`Zmieniono motyw na: ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}`);
    });
}

// Theme options click
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const themeName = option.dataset.theme;
        changeTheme(themeName);
        
        // Show notification
        showNotification(`Zmieniono motyw na: ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`);
    });
});

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('iceClientTheme') || 'default';
    changeTheme(savedTheme);
});

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '80px';
    notification.style.right = '30px';
    notification.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Buy button warning
const buyButtons = document.querySelectorAll('.btn-primary, .btn-outline');

buyButtons.forEach(button => {
    if (button.textContent.includes('Kup')) {
        button.addEventListener('click', (e) => {
            if (button.getAttribute('href') === '#') {
                e.preventDefault();
                
                const plan = button.textContent.includes('1 miesiąc') ? '1 miesiąc' :
                            button.textContent.includes('3 miesiące') ? '3 miesiące' :
                            'Lifetime';
                
                const message = `Uwaga: To jest przykładowa strona Ice Client.\n\nW rzeczywistej implementacji:\n1. Wybierasz plan: ${plan}\n2. Dokonujesz płatności\n3. Otrzymujesz e-mail z kluczem\n4. Dołączasz na Discord: discord.gg/VCxadRDE\n5. Przechodzisz weryfikację i otwierasz ticket na kanale ・tickety\n6. Przesyłasz klucz i otrzymujesz download\n\nPamiętaj: Ice Client jest produktem płatnym bez możliwości zwrotu.`;
                
                alert(message);
            }
        });
    }
});

// Lifetime button - direct Discord link
const lifetimeBtn = document.querySelector('.pricing-card.popular .btn-primary');
if (lifetimeBtn && lifetimeBtn.textContent.includes('Lifetime')) {
    lifetimeBtn.addEventListener('click', (e) => {
        if (lifetimeBtn.getAttribute('href') === '#') {
            e.preventDefault();
            window.open('https://discord.gg/VCxadRDE', '_blank');
            
            // Show purchase instructions after opening Discord
            setTimeout(() => {
                const message = `Po dołączeniu na Discord:\n1. Przejdź weryfikację\n2. Otwórz ticket na kanale ・tickety\n3. Prześlij swój klucz licencyjny (otrzymasz go mailem)\n4. Otrzymasz dostęp do pobrania Ice_Launcher.exe`;
                alert(message);
            }, 1000);
        }
    });
}

// Play button in launcher demo
const playBtn = document.querySelector('.play-btn');
if (playBtn) {
    playBtn.addEventListener('click', () => {
        alert('To jest demo launchera Ice Client. W rzeczywistej wersji tutaj uruchamiałby się Minecraft z Ice Client.');
    });
}

// Toggle settings demo
const toggles = document.querySelectorAll('.toggle');
toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
    });
});

// Add snowflake effect for winter theme (only on desktop)
function createSnowflake() {
    if (window.innerWidth < 768) return; // Only on larger screens
    
    const snowflake = document.createElement('div');
    snowflake.innerHTML = '❄';
    snowflake.style.position = 'fixed';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.top = '-20px';
    snowflake.style.fontSize = Math.random() * 15 + 8 + 'px';
    snowflake.style.opacity = Math.random() * 0.4 + 0.2;
    snowflake.style.zIndex = '-1';
    snowflake.style.pointerEvents = 'none';
    snowflake.style.userSelect = 'none';
    snowflake.style.color = 'rgba(179, 229, 252, 0.7)';
    document.body.appendChild(snowflake);
    
    // Animation
    const duration = Math.random() * 10 + 10;
    snowflake.animate([
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)` }
    ], {
        duration: duration * 1000,
        easing: 'linear'
    });
    
    // Remove after animation
    setTimeout(() => {
        if (snowflake.parentNode) {
            snowflake.remove();
        }
    }, duration * 1000);
}

// Create snowflakes periodically
if (window.innerWidth > 768) {
    setInterval(createSnowflake, 500);
}

// Add active class to nav links based on scroll position - POPRAWIONE
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Sprawdzamy, czy jesteśmy na samej górze
    const scrollPosition = window.scrollY;
    const heroSection = document.querySelector('.hero');
    
    // Jeśli jesteśmy na samej górze lub w sekcji hero, ustaw "Strona główna" jako aktywną
    if (scrollPosition < 100) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' || link.textContent === 'Strona główna') {
                link.classList.add('active');
            }
        });
        return;
    }
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        if (scrollY >= sectionTop - navbarHeight - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animacje dla sekcji hero
const heroTitle = document.querySelector('.hero-title');
const heroButtons = document.querySelectorAll('.hero-actions .btn');
const heroStats = document.querySelectorAll('.stat');

if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    setTimeout(() => {
        heroTitle.style.transition = 'opacity 0.8s, transform 0.8s';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
}

heroButtons.forEach((btn, index) => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(20px)';
    setTimeout(() => {
        btn.style.transition = `opacity 0.8s ${index * 0.2}s, transform 0.8s ${index * 0.2}s`;
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
    }, 500);
});

heroStats.forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';
    setTimeout(() => {
        stat.style.transition = `opacity 0.8s ${index * 0.3}s, transform 0.8s ${index * 0.3}s`;
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
    }, 700);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
});

// Add typing effect to hero subtitle
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroSubtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

// Add animation to launcher window
const launcherWindow = document.querySelector('.ice-window');
if (launcherWindow) {
    launcherWindow.style.opacity = '0';
    launcherWindow.style.transform = 'scale(0.9) rotateX(10deg)';
    
    setTimeout(() => {
        launcherWindow.style.transition = 'opacity 1s, transform 1s';
        launcherWindow.style.opacity = '1';
        launcherWindow.style.transform = 'scale(1) rotateX(0)';
    }, 800);
}

// Add hover animation to feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) rotateX(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0)';
    });
});

// Team card hover effects
const teamCards = document.querySelectorAll('.team-card');
teamCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Team card click animation
teamCards.forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});

// Papieżak image animation
const papiezImage = document.querySelector('.team-avatar[alt="Papieżak"]');
if (papiezImage) {
    papiezImage.addEventListener('mouseenter', () => {
        papiezImage.style.transform = 'scale(1.1) rotate(5deg)';
        papiezImage.style.filter = 'brightness(1.1) drop-shadow(0 0 10px var(--primary))';
    });
    
    papiezImage.addEventListener('mouseleave', () => {
        papiezImage.style.transform = 'scale(1) rotate(0)';
        papiezImage.style.filter = 'brightness(1) drop-shadow(0 0 0)';
    });
    
    // Add glow effect periodically
    setInterval(() => {
        papiezImage.style.boxShadow = '0 0 20px var(--primary)';
        setTimeout(() => {
            papiezImage.style.boxShadow = '';
        }, 1000);
    }, 5000);
}

// gigaochajo_ image animation
const gigaImage = document.querySelector('.team-avatar[alt="gigaochajo_"]');
if (gigaImage) {
    gigaImage.addEventListener('mouseenter', () => {
        gigaImage.style.transform = 'scale(1.1) rotate(-5deg)';
        gigaImage.style.filter = 'brightness(1.1) drop-shadow(0 0 10px var(--accent))';
    });
    
    gigaImage.addEventListener('mouseleave', () => {
        gigaImage.style.transform = 'scale(1) rotate(0)';
        gigaImage.style.filter = 'brightness(1) drop-shadow(0 0 0)';
    });
}

// Add animation for TikTok buttons
const tiktokButtons = document.querySelectorAll('.fa-tiktok');
tiktokButtons.forEach(button => {
    button.parentElement.addEventListener('mouseenter', function() {
        this.style.animation = 'tiktokShake 0.5s';
    });
    
    button.parentElement.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Add animation shake for TikTok
const tiktokStyle = document.createElement('style');
tiktokStyle.textContent = `
    @keyframes tiktokShake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }
`;
document.head.appendChild(tiktokStyle);

// Add animation for crosshair (Guns.lol) buttons
const crosshairButtons = document.querySelectorAll('.fa-crosshairs');
crosshairButtons.forEach(button => {
    button.parentElement.addEventListener('mouseenter', function() {
        this.style.animation = 'crosshairPulse 0.5s';
    });
    
    button.parentElement.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Add animation pulse for crosshair
const crosshairStyle = document.createElement('style');
crosshairStyle.textContent = `
    @keyframes crosshairPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(crosshairStyle);

// Add tooltip for social media
const socialLinks = document.querySelectorAll('.team-social a');
socialLinks.forEach(link => {
    const title = link.getAttribute('title');
    if (title) {
        link.setAttribute('data-tooltip', title);
        
        // Create tooltip on hover
        link.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'social-tooltip';
            tooltip.textContent = this.getAttribute('title');
            tooltip.style.position = 'absolute';
            tooltip.style.bottom = '100%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.background = 'var(--bg-card)';
            tooltip.style.color = 'var(--text-primary)';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '0.8rem';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '1000';
            tooltip.style.border = '1px solid var(--border-color)';
            tooltip.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            
            this.appendChild(tooltip);
        });
        
        link.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.social-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.overflow = 'hidden';
    
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<i class="fas fa-snowflake fa-spin"></i>';
    
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.backgroundColor = 'var(--bg-darker)';
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.zIndex = '9999';
    loader.style.fontSize = '4rem';
    loader.style.color = 'var(--primary)';
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s';
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
            }
        }, 500);
    }, 1500);
});

// Create occasional decorative particles
function createDecorativeParticle() {
    if (window.innerWidth < 768) return;
    
    const particle = document.createElement('div');
    const types = ['snowflake-particle', 'ice-particle'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    particle.className = type;
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = '-20px';
    particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
    particle.style.setProperty('--ty', Math.random() * 100 + 100 + 'px');
    
    // Random size and opacity
    const size = Math.random() * 8 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.opacity = Math.random() * 0.6 + 0.4;
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 1000);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ice Client website loaded successfully!');
    
    // Add active class to current theme option
    themeOptions.forEach(option => {
        if (option.dataset.theme === currentTheme) {
            option.classList.add('active');
        }
    });
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
    
    // Initialize particle system and custom cursor (only on desktop)
    if (window.innerWidth > 768) {
        const particleSystem = new ParticleSystem();
        const customCursor = new CustomCursor();
        
        // Update colors when theme changes
        const updateEffectsColors = () => {
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            
            // Update particle system
            if (particleSystem) {
                particleSystem.particleColor = primaryColor;
            }
            
            // Update custom cursor
            if (customCursor) {
                customCursor.cursor.style.borderColor = primaryColor;
                customCursor.cursor.style.boxShadow = `0 0 15px ${primaryColor}`;
                customCursor.innerDot.style.backgroundColor = primaryColor;
            }
        };
        
        // Update effects when theme changes
        document.addEventListener('themeChanged', updateEffectsColors);
        
        // Also update when localStorage changes (theme switch)
        window.addEventListener('storage', updateEffectsColors);
        
        // Trigger initial color update
        updateEffectsColors();
        
        // Create decorative particles periodically
        setInterval(createDecorativeParticle, 3000);
    }
});