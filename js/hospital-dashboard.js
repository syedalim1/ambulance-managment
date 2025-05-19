// Hospital Dashboard JavaScript file for the Ambulance Booking System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hospital dashboard components
    initHospitalDashboard();
});

/**
 * Initialize all hospital dashboard components
 */
function initHospitalDashboard() {
    // Check if user is logged in and has the correct role
    const user = window.appUtils.getCurrentUser();
    if (!user || user.role !== 'hospital') {
        window.appUtils.showNotification('Please login as a hospital administrator to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    // Set hospital information in the dashboard
    setHospitalInfo(user);

    // Setup driver tabs
    setupDriverTabs();

    // Setup driver action buttons
    setupDriverActions();

    // Setup add driver modal
    setupAddDriverModal();

    // Setup edit driver modal
    setupEditDriverModal();

    // Setup delete confirmation modal
    setupDeleteConfirmationModal();

    // Load mock data
    loadMockData();
}

/**
 * Set hospital information in the dashboard
 * @param {Object} user - The hospital user object
 */
function setHospitalInfo(user) {
    const hospitalNameElement = document.getElementById('hospital-name');
    const hospitalLocationElement = document.getElementById('hospital-location');
    const hospitalEmailElement = document.getElementById('hospital-email');
    const hospitalPhoneElement = document.getElementById('hospital-phone');
    
    if (hospitalNameElement && user.name) {
        hospitalNameElement.textContent = user.name;
    }
    
    if (hospitalLocationElement && user.location) {
        hospitalLocationElement.textContent = user.location;
    }
    
    if (hospitalEmailElement && user.email) {
        hospitalEmailElement.textContent = user.email;
    }
    
    if (hospitalPhoneElement && user.phone) {
        hospitalPhoneElement.textContent = user.phone;
    }
    
    // Set services list
    if (user.services && user.services.length > 0) {
        const servicesList = document.querySelector('.services-list');
        if (servicesList) {
            servicesList.innerHTML = '';
            
            user.services.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'service-item';
                
                // Choose an appropriate icon based on the service
                let icon = 'fa-notes-medical';
                if (service.toLowerCase().includes('neuro')) {
                    icon = 'fa-brain';
                } else if (service.toLowerCase().includes('maternity')) {
                    icon = 'fa-baby';
                } else if (service.toLowerCase().includes('cardio')) {
                    icon = 'fa-heartbeat';
                } else if (service.toLowerCase().includes('ortho')) {
                    icon = 'fa-bone';
                } else if (service.toLowerCase().includes('emergency')) {
                    icon = 'fa-ambulance';
                }
                
                serviceItem.innerHTML = `
                    <i class="fas ${icon}"></i>
                    <span>${service}</span>
                `;
                
                servicesList.appendChild(serviceItem);
            });
        }
    }
}

/**
 * Setup driver tabs
 */
function setupDriverTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            
            if (tabContent) {
                tabContent.classList.add('active');
                
                // If this is not the "all drivers" tab, filter drivers by status
                if (tabId !== 'all-drivers') {
                    const status = tabId.replace('-drivers', '');
                    filterDriversByStatus(status);
                }
            }
        });
    });
}

/**
 * Filter drivers by status
 * @param {string} status - The status to filter by
 */
function filterDriversByStatus(status) {
    const allDriversTable = document.querySelector('#all-drivers .data-table');
    const filteredContent = document.getElementById(`${status}-drivers`);
    
    if (!allDriversTable || !filteredContent) return;
    
    // Clone the table from all-drivers
    const clonedTable = allDriversTable.cloneNode(true);
    
    // Filter rows by status
    const rows = clonedTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const statusCell = row.querySelector('.status');
        if (statusCell && !statusCell.classList.contains(status)) {
            row.remove();
        }
    });
    
    // Clear and append the filtered table
    filteredContent.innerHTML = '';
    
    // Create a wrapper for the table
    const tableResponsive = document.createElement('div');
    tableResponsive.className = 'table-responsive';
    tableResponsive.appendChild(clonedTable);
    
    filteredContent.appendChild(tableResponsive);
    
    // Re-attach event listeners to action buttons
    setupDriverActions();
}

/**
 * Setup driver action buttons
 */
function setupDriverActions() {
    // Setup edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const driverName = this.getAttribute('data-driver');
            openEditDriverModal(driverName);
        });
    });
    
    // Setup delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const driverName = this.getAttribute('data-driver');
            openDeleteConfirmationModal(driverName);
        });
    });
}

/**
 * Setup add driver modal
 */
function setupAddDriverModal() {
    const addDriverBtn = document.getElementById('add-driver-btn');
    const modal = document.getElementById('add-driver-modal');
    const closeButton = modal.querySelector('.close-modal');
    const addDriverForm = document.getElementById('add-driver-form');
    
    if (!addDriverBtn || !modal || !closeButton || !addDriverForm) return;
    
    // Open modal when add driver button is clicked
    addDriverBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        
        // Reset form
        addDriverForm.reset();
    });
    
    // Close modal when close button is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle add driver form submission
    addDriverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const driverName = document.getElementById('driver-name-input').value;
        const driverEmail = document.getElementById('driver-email-input').value;
        const driverPassword = document.getElementById('driver-password-input').value;
        const driverPhone = document.getElementById('driver-phone-input').value;
        const driverFile = document.getElementById('driver-file-input').value;
        const driverStatus = document.getElementById('driver-status-input').value;
        
        // Validate form data
        if (!driverName || !driverEmail || !driverPassword || !driverPhone || !driverFile) {
            window.appUtils.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!window.appUtils.isValidEmail(driverEmail)) {
            window.appUtils.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (!window.appUtils.isValidPhone(driverPhone)) {
            window.appUtils.showNotification('Please enter a valid phone number', 'error');
            return;
        }
        
        if (!window.appUtils.isStrongPassword(driverPassword)) {
            window.appUtils.showNotification('Password must be at least 8 characters and include uppercase, lowercase, and numbers', 'error');
            return;
        }
        
        // Get hospital info
        const hospital = window.appUtils.getCurrentUser();
        
        // Add driver to mock database
        addMockDriver({
            name: driverName,
            email: driverEmail,
            password: driverPassword,
            phone: driverPhone,
            fileUploaded: true,
            fileName: driverFile.split('\\').pop(),
            status: driverStatus,
            hospital: hospital.name,
            location: hospital.location
        });
        
        // Show success message
        window.appUtils.showNotification(`Driver ${driverName} added successfully`, 'success');
        
        // Close modal
        modal.style.display = 'none';
        
        // Reload driver data
        loadMockDrivers();
    });
}

/**
 * Setup edit driver modal
 */
function setupEditDriverModal() {
    const modal = document.getElementById('edit-driver-modal');
    const closeButton = modal.querySelector('.close-modal');
    const editDriverForm = document.getElementById('edit-driver-form');
    
    if (!modal || !closeButton || !editDriverForm) return;
    
    // Close modal when close button is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle edit driver form submission
    editDriverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const driverName = document.getElementById('edit-driver-name').value;
        const driverEmail = document.getElementById('edit-driver-email').value;
        const driverPhone = document.getElementById('edit-driver-phone').value;
        const driverFile = document.getElementById('edit-driver-file').value;
        const driverStatus = document.getElementById('edit-driver-status').value;
        
        // Get original driver email (stored in a data attribute)
        const originalEmail = editDriverForm.getAttribute('data-original-email');
        
        // Validate form data
        if (!driverName || !driverEmail || !driverPhone) {
            window.appUtils.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!window.appUtils.isValidEmail(driverEmail)) {
            window.appUtils.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (!window.appUtils.isValidPhone(driverPhone)) {
            window.appUtils.showNotification('Please enter a valid phone number', 'error');
            return;
        }
        
        // Update driver in mock database
        updateMockDriver(originalEmail, {
            name: driverName,
            email: driverEmail,
            phone: driverPhone,
            fileUploaded: driverFile ? true : undefined,
            fileName: driverFile ? driverFile.split('\\').pop() : undefined,
            status: driverStatus
        });
        
        // Show success message
        window.appUtils.showNotification(`Driver ${driverName} updated successfully`, 'success');
        
        // Close modal
        modal.style.display = 'none';
        
        // Reload driver data
        loadMockDrivers();
    });
}

/**
 * Open edit driver modal with driver information
 * @param {string} driverName - The name of the driver to edit
 */
function openEditDriverModal(driverName) {
    const modal = document.getElementById('edit-driver-modal');
    const editDriverForm = document.getElementById('edit-driver-form');
    
    if (!modal || !editDriverForm) return;
    
    // Get driver data from mock database
    const drivers = getMockDrivers();
    const driver = drivers.find(d => d.name === driverName);
    
    if (driver) {
        // Set form values
        document.getElementById('edit-driver-name').value = driver.name;
        document.getElementById('edit-driver-email').value = driver.email;
        document.getElementById('edit-driver-phone').value = driver.phone;
        document.getElementById('edit-driver-status').value = driver.status || 'available';
        
        // Store original email for reference when updating
        editDriverForm.setAttribute('data-original-email', driver.email);
        
        // Show modal
        modal.style.display = 'block';
    }
}

/**
 * Setup delete confirmation modal
 */
function setupDeleteConfirmationModal() {
    const modal = document.getElementById('delete-modal');
    const closeButton = modal.querySelector('.close-modal');
    const confirmButton = document.getElementById('confirm-delete');
    const cancelButton = document.getElementById('cancel-delete');
    
    if (!modal || !closeButton || !confirmButton || !cancelButton) return;
    
    // Close modal when close button is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Close modal when cancel button is clicked
    cancelButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Handle delete confirmation
    confirmButton.addEventListener('click', function() {
        const driverName = document.getElementById('delete-driver-name').textContent;
        
        // Delete driver from mock database
        deleteMockDriver(driverName);
        
        // Show success message
        window.appUtils.showNotification(`Driver ${driverName} deleted successfully`, 'success');
        
        // Close modal
        modal.style.display = 'none';
        
        // Reload driver data
        loadMockDrivers();
    });
}

/**
 * Open delete confirmation modal
 * @param {string} driverName - The name of the driver to delete
 */
function openDeleteConfirmationModal(driverName) {
    const modal = document.getElementById('delete-modal');
    const driverNameElement = document.getElementById('delete-driver-name');
    
    if (!modal || !driverNameElement) return;
    
    // Set driver name in confirmation message
    driverNameElement.textContent = driverName;
    
    // Show modal
    modal.style.display = 'block';
}

/**
 * Load mock data for the dashboard
 */
function loadMockData() {
    // This function would normally fetch data from an API
    // For demo purposes, we'll use mock data
    loadMockDrivers();
}

/**
 * Load mock drivers into the drivers table
 */
function loadMockDrivers() {
    const driversTable = document.querySelector('#drivers-table tbody');
    if (!driversTable) return;
    
    // Get hospital info
    const hospital = window.appUtils.getCurrentUser();
    if (!hospital) return;
    
    // Get mock drivers from localStorage
    const drivers = getMockDrivers();
    
    // Filter drivers for this hospital
    const hospitalDrivers = drivers.filter(d => d.hospital === hospital.name);
    
    // Clear existing rows
    driversTable.innerHTML = '';
    
    // Add drivers to table
    hospitalDrivers.forEach(driver => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${driver.name}</td>
            <td>${driver.email}</td>
            <td>${driver.phone}</td>
            <td><span class="status ${driver.status || 'available'}">${getStatusText(driver.status)}</span></td>
            <td class="action-cell">
                <button class="action-btn edit-btn" data-driver="${driver.name}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-driver="${driver.name}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        driversTable.appendChild(row);
    });
    
    // Setup action buttons
    setupDriverActions();
    
    // Update filtered tabs
    updateFilteredTabs();
}

/**
 * Update filtered tabs with current data
 */
function updateFilteredTabs() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-tab') !== 'all-drivers') {
        const status = activeTab.getAttribute('data-tab').replace('-drivers', '');
        filterDriversByStatus(status);
    }
}

/**
 * Get status text from status code
 * @param {string} status - The status code
 * @returns {string} The status text
 */
function getStatusText(status) {
    switch (status) {
        case 'available':
            return 'Available';
        case 'on-duty':
            return 'On Duty';
        case 'off-duty':
            return 'Off Duty';
        default:
            return 'Available';
    }
}

/**
 * Get mock drivers from localStorage or create default ones if none exist
 * @returns {Array} Array of driver objects
 */
function getMockDrivers() {
    const usersJson = localStorage.getItem('mockUsers');
    if (!usersJson) return [];
    
    try {
        const users = JSON.parse(usersJson);
        
        // Filter for drivers only
        return users.filter(user => user.role === 'driver');
    } catch (e) {
        console.error('Error parsing mock users:', e);
        return [];
    }
}

/**
 * Add a mock driver to localStorage
 * @param {Object} driverData - The driver data to add
 */
function addMockDriver(driverData) {
    // Get mock users from localStorage
    const usersJson = localStorage.getItem('mockUsers');
    if (!usersJson) return;
    
    try {
        const users = JSON.parse(usersJson);
        
        // Check if email already exists
        if (users.some(u => u.email === driverData.email)) {
            window.appUtils.showNotification('A user with this email already exists', 'error');
            return;
        }
        
        // Create new driver object
        const newDriver = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            role: 'driver',
            ...driverData,
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newDriver);
        
        // Save updated users to localStorage
        localStorage.setItem('mockUsers', JSON.stringify(users));
    } catch (e) {
        console.error('Error adding mock driver:', e);
    }
}

/**
 * Update a mock driver in localStorage
 * @param {string} email - The email of the driver to update
 * @param {Object} driverData - The updated driver data
 */
function updateMockDriver(email, driverData) {
    // Get mock users from localStorage
    const usersJson = localStorage.getItem('mockUsers');
    if (!usersJson) return;
    
    try {
        const users = JSON.parse(usersJson);
        
        // Find the driver to update
        const driverIndex = users.findIndex(u => u.email === email);
        
        if (driverIndex === -1) {
            window.appUtils.showNotification('Driver not found', 'error');
            return;
        }
        
        // Check if new email already exists (if email is being changed)
        if (driverData.email !== email && users.some(u => u.email === driverData.email)) {
            window.appUtils.showNotification('A user with this email already exists', 'error');
            return;
        }
        
        // Update driver data
        users[driverIndex] = {
            ...users[driverIndex],
            ...driverData,
            updatedAt: new Date().toISOString()
        };
        
        // Save updated users to localStorage
        localStorage.setItem('mockUsers', JSON.stringify(users));
        
        // If the current user is this driver, update their info in localStorage
        const currentUser = window.appUtils.getCurrentUser();
        if (currentUser && currentUser.role === 'driver' && currentUser.email === email) {
            const { password, ...userInfo } = users[driverIndex];
            localStorage.setItem('ambulanceUser', JSON.stringify(userInfo));
        }
    } catch (e) {
        console.error('Error updating mock driver:', e);
    }
}

/**
 * Delete a mock driver from localStorage
 * @param {string} driverName - The name of the driver to delete
 */
function deleteMockDriver(driverName) {
    // Get mock users from localStorage
    const usersJson = localStorage.getItem('mockUsers');
    if (!usersJson) return;
    
    try {
        const users = JSON.parse(usersJson);
        
        // Find the driver to delete
        const driverIndex = users.findIndex(u => u.name === driverName && u.role === 'driver');
        
        if (driverIndex === -1) {
            window.appUtils.showNotification('Driver not found', 'error');
            return;
        }
        
        // Remove driver from array
        users.splice(driverIndex, 1);
        
        // Save updated users to localStorage
        localStorage.setItem('mockUsers', JSON.stringify(users));
    } catch (e) {
        console.error('Error deleting mock driver:', e);
    }
}
