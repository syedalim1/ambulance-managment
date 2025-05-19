// Main JavaScript file for the Ambulance Booking System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize any components that need to be set up on page load
    initializeComponents();
});

/**
 * Initialize all components on the page
 */
function initializeComponents() {
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle (if needed)
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle) {
        const navMenu = document.querySelector('nav ul');
        mobileNavToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Check if user is logged in
    checkAuthStatus();
}

/**
 * Check if the user is authenticated and update UI accordingly
 */
function checkAuthStatus() {
    const user = getCurrentUser();
    const loginBtn = document.querySelector('.login-btn');
    
    if (user) {
        // User is logged in
        if (loginBtn) {
            loginBtn.textContent = 'DASHBOARD';
            loginBtn.href = getDashboardUrl(user.role);
        }
    }
}

/**
 * Get the current logged-in user from localStorage
 * @returns {Object|null} The user object or null if not logged in
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('ambulanceUser');
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
}

/**
 * Get the appropriate dashboard URL based on user role
 * @param {string} role - The user's role (patient, driver, hospital)
 * @returns {string} The dashboard URL
 */
function getDashboardUrl(role) {
    switch (role) {
        case 'patient':
            return 'patient-dashboard.html';
        case 'driver':
            return 'driver-dashboard.html';
        case 'hospital':
            return 'hospital-dashboard.html';
        default:
            return 'index.html';
    }
}

/**
 * Display a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Format a date string to a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Validate an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate a phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
function isValidPhone(phone) {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {boolean} Whether the password is strong enough
 */
function isStrongPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

/**
 * Create a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Filter a table based on search input
 * @param {string} tableId - The ID of the table to filter
 * @param {string} inputId - The ID of the input element
 * @param {number} columnIndex - The index of the column to filter on
 */
function setupTableFilter(tableId, inputId, columnIndex) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    
    if (!input || !table) return;
    
    input.addEventListener('keyup', debounce(function() {
        const filter = this.value.toUpperCase();
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
            const cell = rows[i].getElementsByTagName('td')[columnIndex];
            if (cell) {
                const textValue = cell.textContent || cell.innerText;
                if (textValue.toUpperCase().indexOf(filter) > -1) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }
    }, 300));
}

// Export utility functions for use in other scripts
window.appUtils = {
    getCurrentUser,
    showNotification,
    getDashboardUrl,
    formatDate,
    isValidEmail,
    isValidPhone,
    isStrongPassword,
    debounce,
    setupTableFilter
};
