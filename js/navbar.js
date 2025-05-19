/**
 * Enhanced Navbar Functionality
 * Handles responsive behavior, user interactions, and state synchronization
 */
document.addEventListener('DOMContentLoaded', function() {
  // Core navbar elements
  const navbar = document.querySelector('.navbar');
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarNav = document.querySelector('.navbar-nav');
  const navbarProfileToggle = document.querySelector('.navbar-profile-toggle');
  const navbarProfile = document.querySelector('.navbar-profile');
  const logoutBtn = document.getElementById('logout-btn');
  
  // User/entity name elements
  const navUserName = document.getElementById('nav-user-name');
  const navDriverName = document.getElementById('nav-driver-name');
  const navHospitalName = document.getElementById('nav-hospital-name');
  const contentUserName = document.getElementById('user-name');
  const contentDriverName = document.getElementById('driver-name');
  const contentHospitalName = document.getElementById('hospital-name');
  
  // Synchronize names between navbar and content
  function syncNames() {
    // Patient dashboard
    if (navUserName && contentUserName) {
      const userName = contentUserName.textContent;
      navUserName.textContent = userName;
    }
    
    // Driver dashboard
    if (navDriverName && contentDriverName) {
      const driverName = contentDriverName.textContent;
      navDriverName.textContent = driverName;
    }
    
    // Hospital dashboard
    if (navHospitalName && contentHospitalName) {
      const hospitalName = contentHospitalName.textContent;
      navHospitalName.textContent = hospitalName;
    }
  }
  
  // Call name synchronization
  syncNames();
  
  // Handle logout button click
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Clear user data from localStorage
      localStorage.removeItem('ambulanceUser');
      // Show notification
      if (window.appUtils && window.appUtils.showNotification) {
        window.appUtils.showNotification('Logged out successfully', 'success');
      }
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    });
  }
  
  // Toggle mobile menu with animation
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle') || navbarToggle;
  const mobileMenu = document.getElementById('mobile-menu') || navbarNav;
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Prevent body scrolling when menu is open
      document.body.classList.toggle('menu-open');
      
      // Accessibility
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      mobileMenu.setAttribute('aria-hidden', expanded);
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    }
  });
  
  // Toggle profile dropdown with improved UX
  if (navbarProfileToggle && navbarProfile) {
    navbarProfileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navbarProfile.classList.toggle('active');
      
      // Accessibility
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      
      // Close any other open dropdowns
      document.querySelectorAll('.navbar-profile.active').forEach(dropdown => {
        if (dropdown !== navbarProfile) {
          dropdown.classList.remove('active');
        }
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!navbarProfile.contains(e.target)) {
        navbarProfile.classList.remove('active');
        navbarProfileToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close dropdown when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navbarProfile.classList.contains('active')) {
        navbarProfile.classList.remove('active');
        navbarProfileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // Enhanced scroll behavior with throttling
  let lastScrollTop = 0;
  let scrollTimer;
  
  window.addEventListener('scroll', function() {
    if (scrollTimer) return;
    
    scrollTimer = setTimeout(function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add scrolled class when scrolling down
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // Auto-hide navbar on scroll down, show on scroll up
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        // Scrolling down and not at the top
        navbar.classList.add('navbar-hidden');
      } else {
        // Scrolling up or at the top
        navbar.classList.remove('navbar-hidden');
      }
      
      lastScrollTop = scrollTop;
      scrollTimer = null;
    }, 100);
  });
  
  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.navbar-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navbarToggle && navbarToggle.classList.contains('active')) {
        navbarToggle.classList.remove('active');
        navbarNav.classList.remove('active');
        document.body.classList.remove('menu-open');
        navbarToggle.setAttribute('aria-expanded', 'false');
        navbarNav.setAttribute('aria-hidden', 'true');
      }
    });
  });
  
  // Enhanced status toggle for driver dashboard
  const statusToggle = document.getElementById('status-toggle');
  if (statusToggle) {
    statusToggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get current status
      const currentStatus = this.classList.contains('available') ? 'available' : 
                           this.classList.contains('on-duty') ? 'on-duty' : 'off-duty';
      
      // Remove all status classes
      this.classList.remove('available', 'on-duty', 'off-duty');
      
      // Toggle to next status with visual feedback
      let newStatus, statusText;
      
      if (currentStatus === 'available') {
        newStatus = 'on-duty';
        statusText = 'On Duty';
      } else if (currentStatus === 'on-duty') {
        newStatus = 'off-duty';
        statusText = 'Off Duty';
      } else {
        newStatus = 'available';
        statusText = 'Available';
      }
      
      // Apply new status
      this.classList.add(newStatus);
      this.textContent = statusText;
      
      // Visual feedback animation
      this.classList.add('status-changed');
      setTimeout(() => {
        this.classList.remove('status-changed');
      }, 500);
      
      // Update status in the UI
      const currentStatusElement = document.getElementById('current-status');
      if (currentStatusElement) {
        if (newStatus === 'available') {
          currentStatusElement.textContent = 'Available - Ready for new requests';
        } else if (newStatus === 'on-duty') {
          currentStatusElement.textContent = 'On Duty - Currently handling requests';
        } else {
          currentStatusElement.textContent = 'Off Duty - Not accepting requests';
        }
      }
      
      // Here you would typically make an API call to update the status
      console.log('Status changed to: ' + statusText);
    });
  }
  
  // Add active class to current page link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      
      // If in a dropdown, also highlight parent
      const parentDropdown = link.closest('.navbar-profile');
      if (parentDropdown) {
        parentDropdown.classList.add('active-parent');
      }
    }
  });
  
  // Keyboard navigation for accessibility
  navLinks.forEach(link => {
    link.addEventListener('keydown', function(e) {
      // Enter or space activates the link
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Add accessibility attributes
  if (navbar) {
    navbar.setAttribute('role', 'navigation');
    navbar.setAttribute('aria-label', 'Main Navigation');
  }
  
  if (navbarToggle) {
    navbarToggle.setAttribute('aria-expanded', 'false');
    navbarToggle.setAttribute('aria-label', 'Toggle navigation menu');
  }
  
  if (navbarNav) {
    navbarNav.setAttribute('aria-hidden', 'true');
  }
  
  if (navbarProfileToggle) {
    navbarProfileToggle.setAttribute('aria-expanded', 'false');
    navbarProfileToggle.setAttribute('aria-haspopup', 'true');
  }
  
  // Initialize any tooltips
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(element => {
    element.setAttribute('aria-label', element.dataset.tooltip);
    element.setAttribute('tabindex', '0');
  });
});

// Add CSS class for status change animation
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .status-changed {
      animation: pulse 0.5s ease;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    .navbar-hidden {
      transform: translateY(-100%);
    }
  </style>
`);

