// Authentication JavaScript file for the Ambulance Booking System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication components
    initAuthComponents();
});

/**
 * Initialize all authentication-related components
 */
function initAuthComponents() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Handle signup form tabs and submission
    const signupTabs = document.querySelectorAll('.auth-tabs .tab-btn');
    if (signupTabs.length > 0) {
        signupTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and forms
                document.querySelectorAll('.auth-tabs .tab-btn').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.signup-form').forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding form
                this.classList.add('active');
                const formId = this.getAttribute('data-form');
                document.getElementById(formId).classList.add('active');
            });
        });

        // Handle patient signup form
        const patientForm = document.getElementById('patient-form');
        if (patientForm) {
            patientForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSignup('patient', this);
            });
        }

        // Handle driver signup form
        const driverForm = document.getElementById('driver-form');
        if (driverForm) {
            driverForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSignup('driver', this);
            });
        }

        // Handle hospital signup form
        const hospitalForm = document.getElementById('hospital-form');
        if (hospitalForm) {
            hospitalForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSignup('hospital', this);
            });
        }
    }

    // Handle logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Handle login form submission
 * @param {Event} e - The form submission event
 */
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!email || !password) {
        window.appUtils.showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!window.appUtils.isValidEmail(email)) {
        window.appUtils.showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // In a real application, this would be an API call to authenticate the user
    // For demo purposes, we'll use mock data and localStorage
    
    // Check if user exists in mock database
    const users = getMockUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user info in localStorage (except password)
        const { password: pwd, ...userInfo } = user;
        localStorage.setItem('ambulanceUser', JSON.stringify(userInfo));
        
        // Show success message
        window.appUtils.showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
            window.location.href = window.appUtils.getDashboardUrl(user.role);
        }, 1000);
    } else {
        window.appUtils.showNotification('Invalid email or password', 'error');
    }
}

/**
 * Handle signup form submission
 * @param {string} role - The user role (patient, driver, hospital)
 * @param {HTMLFormElement} form - The form element
 */
function handleSignup(role, form) {
    // Get form data
    const formData = new FormData(form);
    const userData = {
        role: role,
        id: generateId(),
        createdAt: new Date().toISOString()
    };
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
        if (key === 'file') {
            // In a real app, this would be handled by file upload
            if (value.name) {
                userData.fileUploaded = true;
                userData.fileName = value.name;
            }
        } else if (key === 'services') {
            // Handle multiple checkboxes
            if (!userData.services) {
                userData.services = [];
            }
            userData.services.push(value);
        } else {
            userData[key] = value;
        }
    }
    
    // Validate required fields
    const requiredFields = getRequiredFields(role);
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
        window.appUtils.showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
        return;
    }
    
    // Validate email
    if (!window.appUtils.isValidEmail(userData.email)) {
        window.appUtils.showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate password strength
    if (!window.appUtils.isStrongPassword(userData.password)) {
        window.appUtils.showNotification('Password must be at least 8 characters and include uppercase, lowercase, and numbers', 'error');
        return;
    }
    
    // Validate phone if present
    if (userData.phone && !window.appUtils.isValidPhone(userData.phone)) {
        window.appUtils.showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // In a real application, this would be an API call to register the user
    // For demo purposes, we'll use localStorage
    
    // Check if email already exists
    const users = getMockUsers();
    if (users.some(u => u.email === userData.email)) {
        window.appUtils.showNotification('This email is already registered', 'error');
        return;
    }
    
    // Add user to mock database
    users.push(userData);
    localStorage.setItem('mockUsers', JSON.stringify(users));
    
    // Store user info in localStorage (except password)
    const { password: pwd, ...userInfo } = userData;
    localStorage.setItem('ambulanceUser', JSON.stringify(userInfo));
    
    // Show success message
    window.appUtils.showNotification('Registration successful! Redirecting...', 'success');
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
        window.location.href = window.appUtils.getDashboardUrl(role);
    }, 1000);
}

/**
 * Handle logout button click
 * @param {Event} e - The click event
 */
function handleLogout(e) {
    e.preventDefault();
    
    // Clear user data from localStorage
    localStorage.removeItem('ambulanceUser');
    
    // Show success message
    window.appUtils.showNotification('Logout successful! Redirecting...', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

/**
 * Get required fields for each user role
 * @param {string} role - The user role
 * @returns {Array} Array of required field names
 */
function getRequiredFields(role) {
    const commonFields = ['name', 'email', 'password'];
    
    switch (role) {
        case 'patient':
            return [...commonFields, 'address'];
        case 'driver':
            return [...commonFields, 'hospital', 'location', 'phone'];
        case 'hospital':
            return [...commonFields, 'location', 'phone'];
        default:
            return commonFields;
    }
}

/**
 * Generate a unique ID
 * @returns {string} A unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Get mock users from localStorage or create default ones if none exist
 * @returns {Array} Array of user objects
 */
function getMockUsers() {
    const usersJson = localStorage.getItem('mockUsers');
    if (usersJson) {
        try {
            return JSON.parse(usersJson);
        } catch (e) {
            console.error('Error parsing mock users:', e);
            return getDefaultUsers();
        }
    }
    return getDefaultUsers();
}

/**
 * Get default mock users for demonstration
 * @returns {Array} Array of default user objects
 */
function getDefaultUsers() {
    const defaultUsers = [
        {
            id: 'pat1',
            role: 'patient',
            name: 'Priya',
            email: 'priya@example.com',
            password: 'priya123',
            address: 'Podanur',
            createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
            id: 'drv1',
            role: 'driver',
            name: 'Syed Ali',
            email: 'syedali@example.com',
            password: 'syed123',
            phone: '+91 9876543210',
            hospital: 'YMTS Hospital',
            location: 'Tirupati',
            status: 'available',
            createdAt: '2025-01-01T00:00:00.000Z'
        },
        {
            id: 'hos1',
            role: 'hospital',
            name: 'GH Hospital',
            email: 'ghhospital@example.com',
            password: 'ghhospital123',
            phone: '+91 9876543200',
            location: 'Coimbatore',
            services: ['Neurological', 'Maternity', 'Psychiatric'],
            createdAt: '2025-01-01T00:00:00.000Z'
        }
    ];
    
    // Store default users in localStorage
    localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
    
    return defaultUsers;
}
