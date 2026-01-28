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

// Add animation to pricing card
const pricingCard = document.querySelector('.pricing-card');

if (pricingCard) {
    pricingCard.addEventListener('mouseenter', () => {
        pricingCard.style.boxShadow = '0 25px 50px rgba(79, 195, 247, 0.2)';
    });
    
    pricingCard.addEventListener('mouseleave', () => {
        pricingCard.style.boxShadow = '';
    });
}

// Animate counter in reviews section
function animateCounter() {
    const countElement = document.querySelector('.count');
    if (!countElement) return;
    
    let current = 0;
    const target = 0; // Starting from 0 reviews
    const increment = 1;
    const duration = 1000; // ms
    const stepTime = Math.max(Math.floor(duration / (target - current)), 20);
    
    const timer = setInterval(() => {
        current += increment;
        countElement.textContent = current;
        
        if (current >= target) {
            clearInterval(timer);
            countElement.textContent = target;
        }
    }, stepTime);
}

// Trigger counter animation when in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter();
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

// Add snowflake effect for winter theme
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.innerHTML = '❄';
    snowflake.style.position = 'fixed';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.top = '-20px';
    snowflake.style.fontSize = Math.random() * 20 + 10 + 'px';
    snowflake.style.opacity = Math.random() * 0.5 + 0.3;
    snowflake.style.zIndex = '-1';
    snowflake.style.pointerEvents = 'none';
    snowflake.style.userSelect = 'none';
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
        snowflake.remove();
    }, duration * 1000);
}

// Create snowflakes periodically
if (window.innerWidth > 768) { // Only on larger screens
    setInterval(createSnowflake, 300);
}

// Buy button warning
const buyButtons = document.querySelectorAll('.btn-buy, .btn-primary[href="#"]');

buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (button.getAttribute('href') === '#' || button.classList.contains('btn-buy')) {
            e.preventDefault();
            alert('Uwaga: To jest przykładowa strona Ice Client.\nW rzeczywistej implementacji tutaj nastąpiłoby przekierowanie do systemu płatności.\n\nPamiętaj: Ice Client jest produktem płatnym bez możliwości zwrotu.');
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ice Client 2026 website loaded successfully!');
    
    // Set current year in footer if needed
    const yearElement = document.querySelector('.footer-tagline');
    if (yearElement) {
        yearElement.textContent = `Premium Minecraft Client © 2024-2026`;
    }
});