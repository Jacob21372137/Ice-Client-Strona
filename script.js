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
                
                const message = `Uwaga: To jest przykładowa strona Ice Client.\n\nW rzeczywistej implementacji:\n1. Wybierasz plan: ${plan}\n2. Dokonujesz płatności\n3. Otrzymujesz e-mail z kluczem\n4. Dołączasz na Discord: discord.gg/iceclient\n5. Otwierasz ticket w #support\n6. Przesyłasz klucz i otrzymujesz download\n\nPamiętaj: Ice Client jest produktem płatnym bez możliwości zwrotu.`;
                
                alert(message);
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ice Client website loaded successfully!');
    
    // Set current year in footer
    const yearElement = document.querySelector('.footer-tagline');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = `Premium Minecraft Client z pełną customizacją © ${currentYear}`;
    }
    
    // Add active class to current theme option
    themeOptions.forEach(option => {
        if (option.dataset.theme === currentTheme) {
            option.classList.add('active');
        }
    });
});