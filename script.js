// ==============================================
// ZSAR PARALEGAL SERVICES - MAIN JAVASCRIPT
// ==============================================

// Configuration (DO NOT COMMIT THESE VALUES - USE ENVIRONMENT VARIABLES)
// See setup-guide.md for secure API key management
const CONFIG = {
  REPO_OWNER: 'YOUR_GITHUB_USERNAME',
  REPO_NAME: 'zsarparalegal',
  // GitHub token is handled securely via GitHub Actions
  // Never hardcode: GITHUB_TOKEN: 'your_token_here'
};

// ==============================================
// HYBRID ROUTING SYSTEM
// ==============================================

const routes = {
  'home': { section: 'hero', title: 'ZSAR Paralegal & G2C Services' },
  'legal-documentation': { section: 'legal-documentation', title: 'Legal Documentation Services | ZSAR' },
  'property-services': { section: 'property-services', title: 'Property Verification Services | ZSAR' },
  'g2c-services': { section: 'g2c-services', title: 'G2C Assistance Services | ZSAR' },
  'investigation': { section: 'investigation', title: 'Private Investigation Services | ZSAR' },
  'marriage-services': { section: 'marriage-services', title: 'Marriage Registration Services | ZSAR' },
  'nri-services': { section: 'nri-services', title: 'NRI Legal Services | ZSAR' },
  'about': { section: 'about', title: 'About ZSAR | 6 Years Experience' },
  'contact': { section: 'contact', title: 'Contact ZSAR | Free Consultation' }
};

function handleRoute() {
  const hash = window.location.hash.substring(1) || 'home';
  const route = routes[hash];
  
  if (!route) {
    // 404 handling - redirect to home
    window.location.hash = 'home';
    return;
  }
  
  // Update document title for SEO
  document.title = route.title;
  
  // Hide all sections
  document.querySelectorAll('section[id]').forEach(section => {
    section.style.display = 'none';
    section.setAttribute('aria-hidden', 'true');
  });
  
  // Show target section
  const targetSection = document.getElementById(route.section);
  if (targetSection) {
    targetSection.style.display = 'block';
    targetSection.setAttribute('aria-hidden', 'false');
    
    // Smooth scroll to top of section
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Update active nav link
    updateActiveNav(hash);
    
    // Track page view (if analytics present)
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: '/' + hash
      });
    }
  }
}

function updateActiveNav(currentHash) {
  document.querySelectorAll('nav a').forEach(link => {
    const linkHash = link.getAttribute('href').substring(1);
    if (linkHash === currentHash) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// Initialize routing
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

// ==============================================
// SERVICE CATEGORY EXPAND/COLLAPSE
// ==============================================

function initServiceCategories() {
  const toggleButtons = document.querySelectorAll('.expand-toggle');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const targetId = this.getAttribute('aria-controls');
      const targetList = document.getElementById(targetId);
      
      if (!targetList) return;
      
      // Toggle state
      this.setAttribute('aria-expanded', !isExpanded);
      targetList.hidden = isExpanded;
      
      // Rotate arrow icon
      this.classList.toggle('expanded');
      
      // Smooth scroll if expanding and not in viewport
      if (!isExpanded) {
        const categorySection = this.closest('.service-category');
        const rect = categorySection.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// ==============================================
// FEEDBACK / TESTIMONIAL SYSTEM
// ==============================================

// Star rating interaction
function initStarRating() {
  const stars = document.querySelectorAll('.star');
  
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = this.getAttribute('data-value');
      const ratingInput = document.getElementById('rating');
      
      if (ratingInput) {
        ratingInput.value = rating;
      }
      
      // Visual feedback
      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
    });
  });
}

// Character counter for feedback textarea
function initCharCounter() {
  const feedbackText = document.getElementById('feedback-text');
  const charCount = document.querySelector('.char-count');
  
  if (feedbackText && charCount) {
    feedbackText.addEventListener('input', function() {
      const count = this.value.length;
      charCount.textContent = `${count} / 500`;
    });
  }
}

// Feedback form submission
function initFeedbackForm() {
  const form = document.getElementById('testimonialForm');
  
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('client-name')?.value || '',
      service: document.getElementById('service-used')?.value || '',
      rating: document.getElementById('rating')?.value || '',
      feedback: document.getElementById('feedback-text')?.value || ''
    };
    
    // Validate rating
    if (!formData.rating) {
      showStatus('Please select a rating', 'error');
      return;
    }
    
    // Validate all fields
    if (!formData.name || !formData.service || !formData.feedback) {
      showStatus('Please fill in all fields', 'error');
      return;
    }
    
    // Submit via Web3Forms to GitHub Actions webhook
    // This triggers GitHub Action that creates issue
    try {
      showStatus('Submitting your feedback...', 'loading');
      
      // Use Web3Forms as intermediary (no exposed API keys)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // Get from web3forms.com
          subject: `Testimonial Submission: ${formData.name}`,
          name: formData.name,
          service: formData.service,
          rating: formData.rating,
          message: formData.feedback,
          // Custom field to trigger GitHub Action
          action: 'create_testimonial'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showStatus('Thank you! Your feedback has been submitted and is pending review.', 'success');
        form.reset();
        // Reset star rating visual
        document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showStatus('Error submitting feedback. Please try again or contact us directly.', 'error');
      console.error('Feedback submission error:', error);
    }
  });
}

function showStatus(message, type) {
  const statusEl = document.getElementById('form-status');
  if (!statusEl) return;
  
  statusEl.textContent = message;
  statusEl.className = `form-status ${type}`;
  statusEl.hidden = false;
  
  if (type === 'success') {
    setTimeout(() => {
      statusEl.hidden = true;
    }, 5000);
  }
}

// ==============================================
// LOAD TESTIMONIALS FROM GITHUB
// ==============================================

async function loadTestimonials() {
  const testimonialsContainer = document.getElementById('testimonials-list');
  
  if (!testimonialsContainer) return;
  
  try {
    // Fetch approved testimonials from GitHub Issues
    // Public API, no authentication needed for reading
    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/issues?labels=testimonial,approved&state=open&per_page=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    
    const testimonials = await response.json();
    
    if (testimonials.length === 0) {
      testimonialsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light);">No testimonials yet. Be the first to share your experience!</p>';
      return;
    }
    
    // Render testimonials
    testimonialsContainer.innerHTML = testimonials.map(testimonial => {
      // Parse issue body
      const bodyLines = testimonial.body.split('\n');
      const serviceLine = bodyLines.find(line => line.startsWith('**Service:**'));
      const ratingLine = bodyLines.find(line => line.startsWith('**Rating:**'));
      const feedbackIndex = bodyLines.findIndex(line => line.startsWith('**Feedback:**'));
      
      const service = serviceLine ? serviceLine.replace('**Service:**', '').trim() : '';
      const rating = ratingLine ? ratingLine.replace('**Rating:**', '').trim() : '';
      const feedbackLines = bodyLines.slice(feedbackIndex + 1);
      const feedback = feedbackLines.join('\n').split('---')[0].trim();
      
      // Extract name from title (format: "Testimonial: Name - Rating")
      const titleParts = testimonial.title.split(':');
      const namePart = titleParts[1] ? titleParts[1].split('-')[0].trim() : 'Anonymous';
      
      return `
        <div class="testimonial-card">
          <div class="testimonial-header">
            <div class="client-avatar">${namePart.charAt(0).toUpperCase()}</div>
            <div class="client-info">
              <h4>${namePart}</h4>
              <p class="service-used">${service}</p>
            </div>
          </div>
          <div class="testimonial-rating">${rating}</div>
          <div class="testimonial-text">${feedback}</div>
        </div>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading testimonials:', error);
    testimonialsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light);">Unable to load testimonials at this time.</p>';
  }
}

// ==============================================
// EXIT INTENT POPUP
// ==============================================

let exitIntentShown = false;

function initExitIntent() {
  document.addEventListener('mouseleave', function(e) {
    // Only trigger if mouse leaves from top of screen
    if (e.clientY < 0 && !exitIntentShown) {
      exitIntentShown = true;
      showExitPopup();
    }
  });
}

function showExitPopup() {
  const popup = document.createElement('div');
  popup.className = 'exit-popup';
  popup.innerHTML = `
    <div class="exit-popup-content">
      <button class="exit-popup-close" aria-label="Close popup">✕</button>
      <h3>Wait! Before You Go...</h3>
      <p>Get a <strong>free 10-minute consultation</strong> to discuss your legal needs.</p>
      <a href="https://wa.me/918108470961?text=I%20want%20a%20free%20consultation" 
         class="exit-popup-cta">
        Chat on WhatsApp Now
      </a>
    </div>
  `;
  document.body.appendChild(popup);
  
  // Close button handler
  const closeBtn = popup.querySelector('.exit-popup-close');
  closeBtn.addEventListener('click', function() {
    popup.remove();
  });
  
  // Click outside to close
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      popup.remove();
    }
  });
}

// ==============================================
// STICKY CTA (SCROLL-TRIGGERED)
// ==============================================

function initStickyCTA() {
  const stickyCTA = document.getElementById('sticky-cta');
  
  if (!stickyCTA) return;
  
  window.addEventListener('scroll', function() {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent > 30) {
      stickyCTA.classList.add('visible');
    } else {
      stickyCTA.classList.remove('visible');
    }
  });
}

// ==============================================
// SIMPLE FAQ CHATBOT
// ==============================================

const faqDatabase = {
  'what services': 'We offer Legal Documentation, Property Services, G2C Assistance, Private Investigation, Marriage Registration, and NRI Services.',
  'service': 'We offer Legal Documentation, Property Services, G2C Assistance, Private Investigation, Marriage Registration, and NRI Services.',
  'cost': 'Pricing varies by service complexity. Legal notices start at ₹500. Contact us for custom quote.',
  'price': 'Pricing varies by service complexity. Legal notices start at ₹500. Contact us for custom quote.',
  'turnaround': 'Most documents: 24-48 hours. Property verification: 3-5 days. Investigation: 5-15 days.',
  'how long': 'Most documents: 24-48 hours. Property verification: 3-5 days. Investigation: 5-15 days.',
  'nri': 'Yes! We specialize in NRI property management, documentation, and legal support with international courier.',
  'overseas': 'Yes! We specialize in NRI property management, documentation, and legal support with international courier.',
  'payment': 'We accept bank transfer, UPI, and online payment. 50% advance, 50% on delivery.',
  'pay': 'We accept bank transfer, UPI, and online payment. 50% advance, 50% on delivery.',
  'contact': 'WhatsApp: +91 8108470961 | Email: zsarfreelance@gmail.com',
  'reach': 'WhatsApp: +91 8108470961 | Email: zsarfreelance@gmail.com',
  'location': 'We provide pan-India services remotely via WhatsApp, email, and courier.',
  'where': 'We provide pan-India services remotely via WhatsApp, email, and courier.'
};

function findAnswer(question) {
  const lowercaseQ = question.toLowerCase();
  
  for (const [keyword, answer] of Object.entries(faqDatabase)) {
    if (lowercaseQ.includes(keyword)) {
      return answer;
    }
  }
  
  return 'I couldn\'t find an exact answer. Please contact us directly for personalized assistance: +91 8108470961';
}

function initChatbot() {
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatSend = document.getElementById('chat-send');
  const chatInput = document.getElementById('chat-input');
  
  if (!chatToggle || !chatWindow) return;
  
  // Toggle chat window
  chatToggle.addEventListener('click', function() {
    chatWindow.hidden = !chatWindow.hidden;
  });
  
  if (chatClose) {
    chatClose.addEventListener('click', function() {
      chatWindow.hidden = true;
    });
  }
  
  // Send message
  function sendMessage() {
    if (!chatInput || !chatSend) return;
    
    const question = chatInput.value.trim();
    if (!question) return;
    
    // Display user question
    appendMessage(question, 'user');
    
    // Get answer
    const answer = findAnswer(question);
    
    // Display bot answer
    setTimeout(() => {
      appendMessage(answer, 'bot');
    }, 500);
    
    chatInput.value = '';
  }
  
  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
}

function appendMessage(text, sender) {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer) return;
  
  const messageEl = document.createElement('div');
  messageEl.className = `chat-message ${sender}`;
  messageEl.textContent = text;
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ==============================================
// INITIALIZE ALL FEATURES ON DOM READY
// ==============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  console.log('ZSAR Paralegal Services - Initializing...');
  
  // Core features
  initServiceCategories();
  initStarRating();
  initCharCounter();
  initFeedbackForm();
  loadTestimonials();
  
  // Conversion optimization
  initExitIntent();
  initStickyCTA();
  initChatbot();
  
  console.log('ZSAR Paralegal Services - Ready!');
}