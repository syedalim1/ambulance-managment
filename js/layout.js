/**
 * Layout adjustments for fixed navbar and smooth scrolling
 * Ensures proper spacing and behavior with the fixed navbar
 */
document.addEventListener('DOMContentLoaded', function() {
  // Adjust main content area based on navbar height
  function adjustContentArea() {
    const navbar = document.querySelector('.navbar');
    const main = document.querySelector('.dashboard-main');
    
    if (navbar && main) {
      const navbarHeight = navbar.offsetHeight;
      document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
      
      // Adjust content padding based on navbar height
      const contentPaddingTop = navbarHeight + 20; // 20px extra padding
      document.documentElement.style.setProperty('--content-padding-top', `${contentPaddingTop}px`);
    }
  }
  
  // Initial adjustment
  adjustContentArea();
  
  // Adjust on window resize
  window.addEventListener('resize', adjustContentArea);
  
  // Smooth scroll to section when clicking on anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip if it's just a "#" link or JavaScript action
      if (targetId === '#' || this.getAttribute('href').startsWith('javascript:')) {
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - navbarHeight - 20; // 20px extra space
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Fix iOS 100vh issue
  function setVhVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setVhVariable();
  window.addEventListener('resize', setVhVariable);
  
  // Handle hash links on page load
  function handleHashOnLoad() {
    if (location.hash) {
      setTimeout(function() {
        const targetElement = document.querySelector(location.hash);
        
        if (targetElement) {
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = targetPosition - navbarHeight - 20;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // Small delay to ensure everything is loaded
    }
  }
  
  handleHashOnLoad();
  
  // Add padding to modal content when open
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'style' && modal.style.display === 'block') {
          document.body.classList.add('modal-open');
        } else if (mutation.attributeName === 'style' && modal.style.display === 'none') {
          document.body.classList.remove('modal-open');
        }
      });
    });
    
    observer.observe(modal, { attributes: true });
  });
});
