// ============================================
// ZSAR's Paralegal & G2C - JavaScript
// Interactive Elements & Form Handling
// ============================================

// ============================================
// 1. MOBILE MENU TOGGLE
// ============================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================
// 2. MODAL FUNCTIONALITY
// ============================================
const consultationBtn = document.getElementById('consultationBtn');
const consultationModal = document.getElementById('consultationModal');
const closeModal = document.getElementById('closeModal');

// Open modal when floating button is clicked
consultationBtn.addEventListener('click', () => {
    consultationModal.style.display = 'flex';
});

// Close modal when X is clicked
closeModal.addEventListener('click', () => {
    consultationModal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === consultationModal) {
        consultationModal.style.display = 'none';
    }
});
/*
// ============================================
// 3. CONSULTATION FORM HANDLING
// ============================================
const consultationForm = document.getElementById('consultationForm');

consultationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(consultationForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        requirement: formData.get('requirement')
    };

    try {
        // Show loading state
        const submitBtn = consultationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Send via Formspree or alternative service
        // This assumes you have Formspree set up (replace YOUR_FORM_ID)
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success message
            showNotification('success', 'Your consultation request has been sent! We\'ll contact you within 2 hours.');
            
            // Reset form
            consultationForm.reset();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                consultationModal.style.display = 'none';
            }, 2000);
        } else {
            showNotification('error', 'There was an error sending your request. Please try again.');
        }

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        console.error('Error:', error);
        showNotification('error', 'Network error. Please check your connection and try again.');
        
        const submitBtn = consultationForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Request Free Consultation';
        submitBtn.disabled = false;
    }
});

// ============================================
// 4. CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);

        try {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Send via Formspree (replace YOUR_FORM_ID)
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('success', 'Message sent successfully! We\'ll get back to you soon.');
                contactForm.reset();
            } else {
                showNotification('error', 'Error sending message. Please try again.');
            }

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Network error. Please try again.');
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    });
}
*/
// ============================================
// 5. NOTIFICATION SYSTEM
// ============================================
function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles dynamically if not in CSS
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        animation: slideInRight 0.3s ease-in-out;
        max-width: 400px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    }

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ============================================
// 6. SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for sticky navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// 7. ANALYTICS & TRACKING
// ============================================
// Simple event tracking for conversions
function trackEvent(eventName, eventData = {}) {
    // This is a placeholder for analytics
    // You can integrate with Google Analytics or other services
    console.log(`Event: ${eventName}`, eventData);
    
    // Example: Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Track form submissions
consultationForm.addEventListener('submit', () => {
    trackEvent('consultation_form_submission', {
        'form_type': 'consultation'
    });
});

if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('contact_form_submission', {
            'form_type': 'contact'
        });
    });
}

// Track button clicks
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('button_click', {
            'button_text': button.textContent.trim()
        });
    });
});

// ============================================
// 8. PERFORMANCE OPTIMIZATION
// ============================================
// Lazy load images if supported
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// 9. NAVIGATION ACTIVE STATE
// ============================================
window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// 10. KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Press 'C' to open consultation modal
    if (e.key === 'c' || e.key === 'C') {
        if (e.ctrlKey || e.metaKey) return; // Don't interfere with Ctrl+C
        consultationModal.style.display = 'flex';
    }

    // Press 'Esc' to close modal
    if (e.key === 'Escape') {
        consultationModal.style.display = 'none';
    }
});

// ============================================
// 11. DOCUMENT READY INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Log that site is loaded
    console.log('ZSAR\'s Paralegal & G2C website loaded successfully');

    // Initialize any features that need DOM to be ready
    initializeFeatures();
});

function initializeFeatures() {
    // Check for service cards and add animation on load
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ============================================
// 12. REDIRECT FOR WhatsApp LINK
// ============================================
function openWhatsApp(service = '') {
    const message = service 
        ? `Hi Sarfaraz, I need help with: ${service}`
        : 'Hi Sarfaraz, I need help with legal and G2C services';
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/918108470961?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    trackEvent('whatsapp_click', {
        'service': service || 'general'
    });
}

// ============================================
// 13. FORM VALIDATION
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
}

// Add real-time validation
const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value && !validateEmail(input.value)) {
            input.style.borderColor = '#ef4444';
        } else {
            input.style.borderColor = '';
        }
    });
});

const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value && !validatePhone(input.value)) {
            input.style.borderColor = '#ef4444';
        } else {
            input.style.borderColor = '';
        }
    });
});

// ============================================
// 14. SCROLL-TO-TOP BUTTON (Optional)
// ============================================
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #1e40af;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        display: none;
        z-index: 998;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease-in-out;
    `;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(button);
}

// Uncomment to enable scroll-to-top button
// createScrollToTopButton();

// ============================================
// 15. SEO & STRUCTURED DATA
// ============================================
function addStructuredData() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "ZSAR's Paralegal & G2C",
        "image": "https://zsarparalegal.com/logo.png",
        "description": "Professional paralegal, G2C, and private investigation services",
        "telephone": "+918108470961",
        "email": "zsarfreelance@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Amarbandhan Hall, Ground Floor, Opp. MSEB Building, A.K. Marg",
            "addressLocality": "Bandra East",
            "addressRegion": "Mumbai",
            "postalCode": "400051",
            "addressCountry": "IN"
        },
        "areaServed": "IN",
        "url": "https://zsarparalegal.com",
        "sameAs": [
            "https://wa.me/918108470961"
        ]
    });
    document.head.appendChild(script);
}

addStructuredData();

console.log('ZSAR Paralegal & G2C - All scripts loaded and initialized');
