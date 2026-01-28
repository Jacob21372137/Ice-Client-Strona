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

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // Scroll to element
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
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

// Animate review stats
function animateReviewStats() {
    const stats = document.querySelectorAll('.review-stat .stat-number');
    
    stats.forEach(stat => {
        const value = stat.textContent;
        let target;
        
        if (value.includes('.')) {
            target = parseFloat(value);
        } else if (value.includes('%')) {
            target = parseInt(value);
        } else {
            target = parseInt(value);
        }
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (value.includes('.')) {
                stat.textContent = current.toFixed(1);
            } else if (value.includes('%')) {
                stat.textContent = Math.floor(current) + '%';
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// Trigger stats animation when in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateReviewStats();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const reviewsSection = document.querySelector('.reviews');
if (reviewsSection) {
    observer.observe(reviewsSection);
}

// Add active class to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

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
                
                alert(`Uwaga: To jest przykładowa strona Ice Client.\nW rzeczywistej implementacji tutaj nastąpiłoby przekierowanie do systemu płatności dla planu: ${plan}.\n\nPamiętaj: Ice Client jest produktem płatnym bez możliwości zwrotu.`);
            }
        });
    }
});

// Play button in launcher demo
const playBtn = document.querySelector('.play-btn');
if (playBtn) {
    playBtn.addEventListener('click', () => {
        alert('To jest demo launchera Ice Client. W rzeczywistej wersji tutaj uruchamiałby się Minecraft z Ice Client.');
    });
}

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ice Client website loaded successfully!');
    
    // Set current year in footer
    const yearElement = document.querySelector('.footer-tagline');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = `Premium Minecraft Client © ${currentYear}`;
    }
});