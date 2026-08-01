// Sarthii Travels Interactive Behaviors

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSearch();
  initFAQs();
  initInquiryForms();
  initItineraryTabs();
  initDiscountPopup();
});

// 1. Navigation & Dropdown Management
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const bannerNav = document.querySelector('.banner-nav');
  
  if (menuToggle && bannerNav) {
    menuToggle.addEventListener('click', () => {
      bannerNav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
      
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      if (bannerNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Handle dropdown toggle on mobile specifically
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  
  if (dropdownToggle && window.innerWidth <= 768) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const menu = dropdown.querySelector('.dropdown-menu');
      if (menu) {
        menu.classList.toggle('active');
      }
    });
  }
}

// 2. Search Autocomplete & Redirection
const packages = [
  { name: 'Adi Kailash & Om Parvat Yatra', url: 'adi-kailash', keywords: ['adi', 'kailash', 'om', 'parvat', 'spiritual', 'yatra'] },
  { name: 'Darma Valley Trek', url: 'darma-valley', keywords: ['darma', 'valley', 'panchachuli', 'glacier', 'trek'] },
  { name: 'Khaliya Top Trek', url: 'khaliya-top', keywords: ['khaliya', 'top', 'munsiyari', 'meadow', 'trek'] }
];

function initSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  
  if (searchInputs.length === 0) return;

  searchInputs.forEach(searchInput => {
    // Create suggestions box dynamically if not present
    let suggestionsBox = searchInput.parentNode.querySelector('.search-suggestions');
    if (!suggestionsBox) {
      suggestionsBox = document.createElement('div');
      suggestionsBox.className = 'search-suggestions';
      searchInput.parentNode.appendChild(suggestionsBox);
    }

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      suggestionsBox.innerHTML = '';
      
      if (query.length < 1) {
        suggestionsBox.style.display = 'none';
        return;
      }

      const filtered = packages.filter(pkg => 
        pkg.name.toLowerCase().includes(query) || 
        pkg.keywords.some(keyword => keyword.includes(query))
      );

      if (filtered.length > 0) {
        filtered.forEach(pkg => {
          const div = document.createElement('div');
          div.className = 'suggestion-item';
          div.textContent = pkg.name;
          div.addEventListener('click', () => {
            window.location.href = pkg.url;
          });
          suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = 'block';
      } else {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.style.color = 'var(--text-muted)';
        div.style.cursor = 'default';
        div.textContent = 'No trips found...';
        suggestionsBox.appendChild(div);
        suggestionsBox.style.display = 'block';
      }
    });

    // Close suggestions box on clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = 'none';
      }
    });

    // Add keydown navigation
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const items = suggestionsBox.querySelectorAll('.suggestion-item');
        if (items.length > 0 && items[0].style.cursor !== 'default') {
          items[0].click();
        }
      }
    });
  });
}

// 3. FAQ Accordion & Category Tabs
function initFAQs() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentNode;
      const isActive = item.classList.contains('active');
      
      // Close all open FAQs
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
      });

      // If clicked wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Category Tabs Interaction
  const tabButtons = document.querySelectorAll('.faq-tab-btn');
  const sections = document.querySelectorAll('.faq-category-section');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-category');

      // Clear search input when switching tabs manually
      const faqSearch = document.getElementById('faq-search');
      if (faqSearch && document.activeElement !== faqSearch) {
        faqSearch.value = '';
      }

      // Hide/Show sections based on targetCategory
      sections.forEach(sec => {
        const secId = sec.getAttribute('id');
        if (targetCategory === 'all' || secId === 'section-' + targetCategory) {
          sec.style.display = 'block';
          // Make sure hidden children are reset
          sec.querySelectorAll('.faq-item').forEach(i => i.style.display = 'block');
        } else {
          sec.style.display = 'none';
        }
      });

      // Hide empty state card if showing sections
      const emptyState = document.getElementById('faq-empty-state');
      if (emptyState) emptyState.style.display = 'none';
    });
  });

  // Support local FAQ search if FAQ search bar exists
  const faqSearch = document.getElementById('faq-search');
  const emptyState = document.getElementById('faq-empty-state');

  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const faqItems = document.querySelectorAll('.faq-item');
      
      // If query is empty, respect the active tab
      if (query === '') {
        const activeTab = document.querySelector('.faq-tab-btn.active');
        if (activeTab) {
          // Trigger click to restore correct category layout
          const targetCategory = activeTab.getAttribute('data-category');
          sections.forEach(sec => {
            const secId = sec.getAttribute('id');
            if (targetCategory === 'all' || secId === 'section-' + targetCategory) {
              sec.style.display = 'block';
              sec.querySelectorAll('.faq-item').forEach(i => i.style.display = 'block');
            } else {
              sec.style.display = 'none';
            }
          });
        }
        if (emptyState) emptyState.style.display = 'none';
        return;
      }

      // If searching, show all sections but filter items
      sections.forEach(sec => {
        sec.style.display = 'block';
      });

      let matchCount = 0;
      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (questionText.includes(query) || answerText.includes(query)) {
          item.style.display = 'block';
          matchCount++;
        } else {
          item.style.display = 'none';
        }
      });

      // Hide sections that have no visible items after search filter
      sections.forEach(sec => {
        let visibleCount = 0;
        sec.querySelectorAll('.faq-item').forEach(item => {
          if (item.style.display !== 'none') {
            visibleCount++;
          }
        });

        if (visibleCount === 0) {
          sec.style.display = 'none';
        } else {
          sec.style.display = 'block';
        }
      });

      // Show/Hide empty state card
      if (emptyState) {
        if (matchCount === 0) {
          emptyState.style.display = 'block';
        } else {
          emptyState.style.display = 'none';
        }
      }
    });
  }

  // Handle URL anchors like #permits, #health, #stays to auto-click tab
  const hash = window.location.hash;
  if (hash) {
    const category = hash.substring(1); // 'permits', 'health', or 'stays'
    const targetTab = document.querySelector(`.faq-tab-btn[data-category="${category}"]`);
    if (targetTab) {
      setTimeout(() => {
        targetTab.click();
        // Scroll to the active tab grid on mobile
        document.querySelector('.faq-grid').scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }
}

// 4. Form Submissions (Validation & Success Popup Modal)
function initInquiryForms() {
  // Trip Planner selector card interaction
  const selectCards = document.querySelectorAll('.trip-select-card');
  selectCards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', () => {
        selectCards.forEach(c => c.classList.remove('selected'));
        if (radio.checked) {
          card.classList.add('selected');
        }
      });
    }
  });

  const forms = document.querySelectorAll('form');
  
  if (forms.length === 0) return;

  // Create Success Modal overlay dynamically
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="success-modal">
      <div class="success-icon">
        <i class="fas fa-check"></i>
      </div>
      <h3>Inquiry Received!</h3>
      <p>Thank you for reaching out to Sarthii Travels. Our travel expert will call or message you shortly on WhatsApp to plan your dream Himalayan journey.</p>
      <button class="btn btn-primary btn-close-modal">Awesome</button>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const closeModalBtn = modalOverlay.querySelector('.btn-close-modal');
  closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation checks
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = 'var(--border)';
        }
      });

      if (!isValid) return;

      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      setTimeout(() => {
        // Success
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        form.reset();
        
        // Show success modal
        modalOverlay.classList.add('active');
      }, 1200);
    });
  });
}

// 5. Dynamic Itinerary Switching
function initItineraryTabs() {
  const tabs = document.querySelectorAll('.itinerary-tab-btn');
  const timelines = document.querySelectorAll('.itinerary-timeline');
  const packageSelect = document.getElementById('side-package');
  
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');
        
        // Update active tab styling
        tabs.forEach(t => {
          t.classList.remove('active');
          t.style.backgroundColor = 'var(--light)';
          t.style.color = 'var(--text-main)';
          t.style.borderColor = 'var(--border)';
          t.style.boxShadow = 'none';
        });
        
        tab.classList.add('active');
        tab.style.backgroundColor = 'var(--primary)';
        tab.style.color = 'var(--white)';
        tab.style.borderColor = 'var(--primary)';
        tab.style.boxShadow = '0 4px 10px rgba(0, 128, 255, 0.15)';
        
        // Show correct timeline
        timelines.forEach(time => {
          if (time.id === `itinerary-${target}`) {
            time.style.display = 'block';
          } else {
            time.style.display = 'none';
          }
        });
        
        // Sync with sidebar select dropdown if exists
        if (packageSelect) {
          packageSelect.value = target;
        }
      });
    });
  }
  
  // If user changes sidebar dropdown, sync back to tabs
  if (packageSelect) {
    packageSelect.addEventListener('change', () => {
      const selectedValue = packageSelect.value;
      const matchingTab = document.querySelector(`.itinerary-tab-btn[data-target="${selectedValue}"]`);
      if (matchingTab) {
        // Trigger click programmatically without recursive loop
        const target = matchingTab.getAttribute('data-target');
        
        tabs.forEach(t => {
          t.classList.remove('active');
          t.style.backgroundColor = 'var(--light)';
          t.style.color = 'var(--text-main)';
          t.style.borderColor = 'var(--border)';
          t.style.boxShadow = 'none';
        });
        
        matchingTab.classList.add('active');
        matchingTab.style.backgroundColor = 'var(--primary)';
        matchingTab.style.color = 'var(--white)';
        matchingTab.style.borderColor = 'var(--primary)';
        matchingTab.style.boxShadow = '0 4px 10px rgba(0, 128, 255, 0.15)';
        
        timelines.forEach(time => {
          if (time.id === `itinerary-${target}`) {
            time.style.display = 'block';
          } else {
            time.style.display = 'none';
          }
        });
      }
    });
  }
}

// 6. Pre-Booking Yatra Discount Lead Popup
function initDiscountPopup() {
  // Check if user already submitted or dismissed the popup
  if (localStorage.getItem('sarthii_prebook_popup_dismissed')) {
    return;
  }

  // Create Popup Overlay and Inner Elements
  const popupOverlay = document.createElement('div');
  popupOverlay.className = 'prebook-popup-overlay';
  popupOverlay.innerHTML = `
    <div class="prebook-popup-card">
      <button class="prebook-popup-close-btn" aria-label="Close offer popup"><i class="fas fa-times"></i></button>
      
      <div class="prebook-popup-image-side">
        <div class="prebook-popup-badge">Limited Offer</div>
        <h3>Pre-Book Your Yatra & Save</h3>
        <p>Secure your slots early for the 2026 spiritual season and get exclusive discounts.</p>
        <div class="prebook-popup-benefit-list">
          <div class="prebook-popup-benefit-item">
            <i class="fas fa-check-circle"></i>
            <span>Flat ₹2,500 Off Per Person</span>
          </div>
          <div class="prebook-popup-benefit-item">
            <i class="fas fa-check-circle"></i>
            <span>Priority Permit Clearance</span>
          </div>
          <div class="prebook-popup-benefit-item">
            <i class="fas fa-check-circle"></i>
            <span>Flexible Dates & Rescheduling</span>
          </div>
        </div>
      </div>
      
      <div class="prebook-popup-form-side">
        <h4>Claim <span>Pre-Book Offer</span> 🏔️</h4>
        <p>Fill out the form below to receive your discount coupon and draft itinerary details.</p>
        
        <form class="prebook-popup-form">
          <div class="prebook-form-group">
            <label for="popup-name">Full Name</label>
            <input type="text" id="popup-name" required placeholder="e.g. Amit Sharma">
          </div>
          <div class="prebook-form-group">
            <label for="popup-phone">Phone Number (WhatsApp)</label>
            <input type="tel" id="popup-phone" required placeholder="e.g. +91 9876543210">
          </div>
          <div class="prebook-form-group">
            <label for="popup-yatra">Choose Yatra</label>
            <select id="popup-yatra" required>
              <option value="" disabled selected>Select destination</option>
              <option value="Adi Kailash & Om Parvat Yatra">Adi Kailash & Om Parvat Yatra</option>
              <option value="Darma Valley Expedition">Darma Valley Expedition</option>
              <option value="Khaliya Top Trek">Khaliya Top Trek</option>
            </select>
          </div>
          <div class="prebook-form-group">
            <label for="popup-month">Preferred Month</label>
            <select id="popup-month" required>
              <option value="" disabled selected>Select month</option>
              <option value="May 2026">May 2026</option>
              <option value="June 2026">June 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="October 2026">October 2026</option>
            </select>
          </div>
          
          <button type="submit" class="prebook-submit-btn">
            <span>Get My Coupon & Plan</span>
            <i class="fas fa-arrow-right"></i>
          </button>
          
          <p class="prebook-privacy-note">
            <i class="fas fa-shield-alt"></i> 100% Secure. We never share your data.
          </p>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(popupOverlay);

  // Trigger popup display with a 6-second delay
  setTimeout(() => {
    if (!localStorage.getItem('sarthii_prebook_popup_dismissed')) {
      popupOverlay.classList.add('active');
    }
  }, 6000);

  // Close actions
  const closeBtn = popupOverlay.querySelector('.prebook-popup-close-btn');
  const dismissPopup = () => {
    popupOverlay.classList.remove('active');
    localStorage.setItem('sarthii_prebook_popup_dismissed', 'true');
  };

  closeBtn.addEventListener('click', dismissPopup);
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      dismissPopup();
    }
  });

  // Form Validation & Submission inside Modal
  const form = popupOverlay.querySelector('.prebook-popup-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('popup-name');
    const phoneInput = document.getElementById('popup-phone');
    const yatraSelect = document.getElementById('popup-yatra');
    const monthSelect = document.getElementById('popup-month');
    
    let isValid = true;
    [nameInput, phoneInput, yatraSelect, monthSelect].forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ef4444';
      } else {
        input.style.borderColor = 'var(--border)';
      }
    });
    
    if (!isValid) return;
    
    const submitBtn = form.querySelector('.prebook-submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing Offer...';
    
    // Simulate form submission delay
    setTimeout(() => {
      localStorage.setItem('sarthii_prebook_popup_dismissed', 'true');
      
      const formSide = popupOverlay.querySelector('.prebook-popup-form-side');
      const nameVal = nameInput.value.trim();
      const yatraVal = yatraSelect.value;
      const phoneVal = phoneInput.value.trim();
      
      formSide.innerHTML = `
        <div class="prebook-success-container">
          <div class="prebook-success-icon">
            <i class="fas fa-gift"></i>
          </div>
          <h4>Discount Unlocked! 🎉</h4>
          <p>Thank you, <b>${nameVal}</b>. Your pre-booking discount has been reserved for the <b>${yatraVal}</b>.</p>
          
          <div class="prebook-coupon-card">
            <span>Coupon Code</span>
            <div class="prebook-coupon-code">PREBOOK2500</div>
          </div>
          
          <p style="font-size: 0.82rem; margin-bottom: 20px; line-height: 1.4;">
            We will message you on WhatsApp (<b>${phoneVal}</b>) within 24 hours with your custom itinerary.
          </p>
          
          <a href="https://wa.me/918171265958?text=Hi%20Sarthii%20Travels,%20I%20just%20unlocked%20my%20pre-booking%20coupon%20PREBOOK2500%20for%20${encodeURIComponent(yatraVal)}.%20Please%20share%20the%20itinerary!" 
             target="_blank" 
             class="prebook-success-action-btn">
            <i class="fab fa-whatsapp"></i> Chat on WhatsApp Now
          </a>
        </div>
      `;
    }, 1500);
  });
}
