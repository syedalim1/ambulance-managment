// Driver Dashboard JavaScript file for the Ambulance Booking System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize driver dashboard components
    initDriverDashboard();
});

/**
 * Initialize all driver dashboard components
 */
function initDriverDashboard() {
    // Check if user is logged in and has the correct role
    const user = window.appUtils.getCurrentUser();
    if (!user || user.role !== 'driver') {
        window.appUtils.showNotification('Please login as a driver to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    // Set driver information in the dashboard
    setDriverInfo(user);

    // Setup request filtering
    setupRequestFiltering();

    // Setup request action buttons
    setupRequestActions();

    // Setup status toggle
    setupStatusToggle();

    // Setup request details modal
    setupRequestDetailsModal();

    // Setup status update modal
    setupStatusUpdateModal();

    // Load mock data
    loadMockData();
}

/**
 * Set driver information in the dashboard
 * @param {Object} user - The driver user object
 */
function setDriverInfo(user) {
    const driverNameElement = document.getElementById('driver-name');
    const driverHospitalElement = document.getElementById('driver-hospital');
    const driverLocationElement = document.getElementById('driver-location');
    
    if (driverNameElement && user.name) {
        driverNameElement.textContent = user.name;
    }
    
    if (driverHospitalElement && user.hospital) {
        driverHospitalElement.textContent = user.hospital;
    }
    
    if (driverLocationElement && user.location) {
        driverLocationElement.textContent = user.location;
    }
    
    // Set status button text and class
    const statusToggle = document.getElementById('status-toggle');
    if (statusToggle && user.status) {
        statusToggle.textContent = getStatusText(user.status);
        statusToggle.className = `status-btn ${user.status}`;
    }
    
    // Show/hide active duty card based on status
    const activeDutyCard = document.getElementById('active-duty-card');
    if (activeDutyCard) {
        if (user.status === 'on-duty') {
            activeDutyCard.style.display = 'block';
        } else {
            activeDutyCard.style.display = 'none';
        }
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
            return 'Unknown';
    }
}

/**
 * Setup request filtering
 */
function setupRequestFiltering() {
    const requestFilter = document.getElementById('request-filter');
    const requestTable = document.getElementById('request-table');
    
    if (!requestFilter || !requestTable) return;
    
    requestFilter.addEventListener('change', function() {
        const filterValue = this.value.toLowerCase();
        const rows = requestTable.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
            const statusCell = rows[i].querySelector('.status');
            if (statusCell) {
                const status = statusCell.textContent.toLowerCase();
                if (filterValue === 'all' || status === filterValue) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }
    });
}

/**
 * Setup request action buttons
 */
function setupRequestActions() {
    // Setup accept buttons
    const acceptButtons = document.querySelectorAll('.accept-btn');
    acceptButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const email = row.cells[1].textContent;
            const address = row.cells[2].textContent;
            
            // Update request status
            updateRequestStatus(row, 'accepted');
            
            // Show success message
            window.appUtils.showNotification(`Request from ${email} accepted`, 'success');
            
            // Update driver status if not already on duty
            const user = window.appUtils.getCurrentUser();
            if (user && user.status !== 'on-duty') {
                updateDriverStatus('on-duty');
            }
            
            // Add to remaining patients
            addToRemainingPatients(email, address);
        });
    });
    
    // Setup reject buttons
    const rejectButtons = document.querySelectorAll('.reject-btn');
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const email = row.cells[1].textContent;
            
            // Update request status
            updateRequestStatus(row, 'rejected');
            
            // Show success message
            window.appUtils.showNotification(`Request from ${email} rejected`, 'info');
        });
    });
    
    // Setup complete buttons
    const completeButtons = document.querySelectorAll('.complete-btn');
    completeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const email = row.cells[1].textContent;
            
            // Update request status
            updateRequestStatus(row, 'completed');
            
            // Show success message
            window.appUtils.showNotification(`Request from ${email} completed`, 'success');
            
            // Remove from remaining patients
            removeFromRemainingPatients(email);
            
            // Update driver status if no more patients
            checkAndUpdateDriverStatus();
        });
    });
    
    // Setup navigate buttons
    const navigateButtons = document.querySelectorAll('.navigate-btn');
    navigateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.patient-card');
            const addressElement = card.querySelector('p:nth-child(2)');
            
            if (addressElement) {
                const address = addressElement.textContent.replace('Address:', '').trim();
                
                // In a real app, this would open a map with the address
                // For demo purposes, just show a message
                window.appUtils.showNotification(`Navigating to ${address}`, 'info');
            }
        });
    });
}

/**
 * Update request status in the UI
 * @param {HTMLElement} row - The table row element
 * @param {string} status - The new status
 */
function updateRequestStatus(row, status) {
    const statusCell = row.querySelector('.status');
    const actionsCell = row.querySelector('.action-cell');
    
    if (statusCell) {
        // Remove all status classes
        statusCell.classList.remove('pending', 'accepted', 'completed', 'rejected');
        
        // Add new status class
        statusCell.classList.add(status);
        
        // Update status text
        statusCell.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    if (actionsCell) {
        // Update action buttons based on new status
        if (status === 'accepted') {
            actionsCell.innerHTML = '<button class="action-btn complete-btn">Complete</button>';
            
            // Add event listener to new complete button
            const completeBtn = actionsCell.querySelector('.complete-btn');
            if (completeBtn) {
                completeBtn.addEventListener('click', function() {
                    const email = row.cells[1].textContent;
                    updateRequestStatus(row, 'completed');
                    window.appUtils.showNotification(`Request from ${email} completed`, 'success');
                    removeFromRemainingPatients(email);
                    checkAndUpdateDriverStatus();
                });
            }
        } else if (status === 'completed' || status === 'rejected') {
            actionsCell.innerHTML = '<span class="completed-text">Completed</span>';
        }
    }
    
    // Update mock data in localStorage
    updateMockRequest(row, status);
}

/**
 * Add patient to remaining patients list
 * @param {string} email - The patient's email
 * @param {string} address - The patient's address
 */
function addToRemainingPatients(email, address) {
    const remainingPatients = document.querySelector('.remaining-patients');
    if (!remainingPatients) return;
    
    // Check if patient is already in the list
    const existingPatient = Array.from(remainingPatients.querySelectorAll('.patient-card')).find(card => {
        return card.querySelector('p:first-child').textContent.includes(email);
    });
    
    if (existingPatient) return;
    
    // Create new patient card
    const patientCard = document.createElement('div');
    patientCard.className = 'patient-card';
    patientCard.dataset.email = email;
    
    const patientInfo = document.createElement('div');
    patientInfo.className = 'patient-info';
    
    const emailPara = document.createElement('p');
    emailPara.innerHTML = `<strong>Email:</strong> ${email}`;
    
    const addressPara = document.createElement('p');
    addressPara.innerHTML = `<strong>Address:</strong> ${address}`;
    
    const notesPara = document.createElement('p');
    notesPara.innerHTML = `<strong>Notes:</strong> Emergency case, needs immediate attention`;
    
    patientInfo.appendChild(emailPara);
    patientInfo.appendChild(addressPara);
    patientInfo.appendChild(notesPara);
    
    const patientActions = document.createElement('div');
    patientActions.className = 'patient-actions';
    
    const navigateBtn = document.createElement('button');
    navigateBtn.className = 'action-btn navigate-btn';
    navigateBtn.innerHTML = '<i class="fas fa-map-marked-alt"></i> Navigate';
    navigateBtn.addEventListener('click', function() {
        window.appUtils.showNotification(`Navigating to ${address}`, 'info');
    });
    
    const completeBtn = document.createElement('button');
    completeBtn.className = 'action-btn complete-btn';
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', function() {
        // Find and update the corresponding row in the requests table
        const rows = document.querySelectorAll('#request-table tbody tr');
        for (const row of rows) {
            if (row.cells[1].textContent === email) {
                updateRequestStatus(row, 'completed');
                break;
            }
        }
        
        // Remove from remaining patients
        removeFromRemainingPatients(email);
        
        // Show success message
        window.appUtils.showNotification(`Request from ${email} completed`, 'success');
        
        // Check if there are any remaining patients
        checkAndUpdateDriverStatus();
    });
    
    patientActions.appendChild(navigateBtn);
    patientActions.appendChild(completeBtn);
    
    patientCard.appendChild(patientInfo);
    patientCard.appendChild(patientActions);
    
    remainingPatients.appendChild(patientCard);
    
    // Update current status text
    updateRemainingPatientsCount();
    
    // Show active duty card
    const activeDutyCard = document.getElementById('active-duty-card');
    if (activeDutyCard) {
        activeDutyCard.style.display = 'block';
    }
}

/**
 * Remove patient from remaining patients list
 * @param {string} email - The patient's email
 */
function removeFromRemainingPatients(email) {
    const patientCards = document.querySelectorAll('.patient-card');
    patientCards.forEach(card => {
        if (card.dataset.email === email || card.querySelector('p:first-child').textContent.includes(email)) {
            card.remove();
        }
    });
    
    // Update current status text
    updateRemainingPatientsCount();
}

/**
 * Update the count of remaining patients
 */
function updateRemainingPatientsCount() {
    const currentStatus = document.getElementById('current-status');
    const patientCards = document.querySelectorAll('.patient-card');
    
    if (currentStatus) {
        if (patientCards.length === 0) {
            currentStatus.textContent = 'No Patients Remaining';
        } else if (patientCards.length === 1) {
            currentStatus.textContent = 'On Duty - 1 Patient Remaining';
        } else {
            currentStatus.textContent = `On Duty - ${patientCards.length} Patients Remaining`;
        }
    }
}

/**
 * Check if there are any remaining patients and update driver status accordingly
 */
function checkAndUpdateDriverStatus() {
    const patientCards = document.querySelectorAll('.patient-card');
    
    if (patientCards.length === 0) {
        // No more patients, update driver status to available
        updateDriverStatus('available');
        
        // Hide active duty card
        const activeDutyCard = document.getElementById('active-duty-card');
        if (activeDutyCard) {
            activeDutyCard.style.display = 'none';
        }
    }
}

/**
 * Setup status toggle button
 */
function setupStatusToggle() {
    const statusToggle = document.getElementById('status-toggle');
    
    if (!statusToggle) return;
    
    statusToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Open status update modal
        const statusModal = document.getElementById('status-modal');
        if (statusModal) {
            // Get current status
            const user = window.appUtils.getCurrentUser();
            if (user && user.status) {
                const statusSelect = document.getElementById('status-select');
                if (statusSelect) {
                    statusSelect.value = user.status;
                }
            }
            
            statusModal.style.display = 'block';
        }
    });
}

/**
 * Setup request details modal
 */
function setupRequestDetailsModal() {
    const modal = document.getElementById('request-modal');
    
    if (!modal) return;
    
    const closeButton = modal.querySelector('.close-modal');
    
    // Close modal when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Setup modal action buttons
    const acceptBtn = document.getElementById('modal-accept-btn');
    const rejectBtn = document.getElementById('modal-reject-btn');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            const email = document.getElementById('modal-patient-email').textContent;
            const address = document.getElementById('modal-patient-address').textContent;
            
            // Find and update the corresponding row in the requests table
            const rows = document.querySelectorAll('#request-table tbody tr');
            for (const row of rows) {
                if (row.cells[1].textContent === email) {
                    updateRequestStatus(row, 'accepted');
                    break;
                }
            }
            
            // Update driver status if not already on duty
            const user = window.appUtils.getCurrentUser();
            if (user && user.status !== 'on-duty') {
                updateDriverStatus('on-duty');
            }
            
            // Add to remaining patients
            addToRemainingPatients(email, address);
            
            // Show success message
            window.appUtils.showNotification(`Request from ${email} accepted`, 'success');
            
            // Close modal
            modal.style.display = 'none';
        });
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            const email = document.getElementById('modal-patient-email').textContent;
            
            // Find and update the corresponding row in the requests table
            const rows = document.querySelectorAll('#request-table tbody tr');
            for (const row of rows) {
                if (row.cells[1].textContent === email) {
                    updateRequestStatus(row, 'rejected');
                    break;
                }
            }
            
            // Show success message
            window.appUtils.showNotification(`Request from ${email} rejected`, 'info');
            
            // Close modal
            modal.style.display = 'none';
        });
    }
}

/**
 * Setup status update modal
 */
function setupStatusUpdateModal() {
    const modal = document.getElementById('status-modal');
    
    if (!modal) return;
    
    const closeButton = modal.querySelector('.close-modal');
    const statusForm = document.getElementById('status-form');
    
    // Close modal when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle status form submission
    if (statusForm) {
        statusForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const statusSelect = document.getElementById('status-select');
            const statusReason = document.getElementById('status-reason');
            
            if (!statusSelect) return;
            
            const newStatus = statusSelect.value;
            const reason = statusReason ? statusReason.value : '';
            
            // Check if driver can change status
            if (newStatus === 'available' || newStatus === 'off-duty') {
                const patientCards = document.querySelectorAll('.patient-card');
                if (patientCards.length > 0) {
                    window.appUtils.showNotification('Cannot change status while you have pending patients', 'error');
                    return;
                }
            }
            
            // Update driver status
            updateDriverStatus(newStatus, reason);
            
            // Show success message
            window.appUtils.showNotification(`Status updated to ${getStatusText(newStatus)}`, 'success');
            
            // Close modal
            modal.style.display = 'none';
        });
    }
}

/**
 * Update driver status
 * @param {string} status - The new status
 * @param {string} reason - The reason for the status change (optional)
 */
function updateDriverStatus(status, reason = '') {
    // Update status toggle button
    const statusToggle = document.getElementById('status-toggle');
    if (statusToggle) {
        statusToggle.textContent = getStatusText(status);
        statusToggle.className = `status-btn ${status}`;
    }
    
    // Show/hide active duty card based on status
    const activeDutyCard = document.getElementById('active-duty-card');
    if (activeDutyCard) {
        if (status === 'on-duty') {
            activeDutyCard.style.display = 'block';
        } else {
            activeDutyCard.style.display = 'none';
        }
    }
    
    // Update user object in localStorage
    const user = window.appUtils.getCurrentUser();
    if (user) {
        user.status = status;
        if (reason) {
            user.statusReason = reason;
        }
        localStorage.setItem('ambulanceUser', JSON.stringify(user));
    }
    
    // Update mock driver in mock database
    updateMockDriver(status, reason);
}

/**
 * Load mock data for the dashboard
 */
function loadMockData() {
    // This function would normally fetch data from an API
    // For demo purposes, we'll use mock data
    loadMockRequests();
}

/**
 * Load mock requests into the requests table
 */
function loadMockRequests() {
    const requestsTable = document.querySelector('#request-table tbody');
    if (!requestsTable) return;
    
    // Get mock bookings from localStorage
    const bookingsJson = localStorage.getItem('mockBookings');
    if (!bookingsJson) return;
    
    try {
        const bookings = JSON.parse(bookingsJson);
        const user = window.appUtils.getCurrentUser();
        
        if (!user) return;
        
        // Filter bookings for this driver's hospital
        const driverBookings = bookings.filter(booking => booking.hospitalName === user.hospital);
        
        // Clear existing rows
        requestsTable.innerHTML = '';
        
        // Add bookings to table
        driverBookings.forEach(booking => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${booking.hospitalName}</td>
                <td>${booking.patientEmail}</td>
                <td>${booking.pickupAddress}</td>
                <td><span class="status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
                <td class="action-cell">
                    ${getActionButtonsHtml(booking.status)}
                </td>
            `;
            
            requestsTable.appendChild(row);
            
            // If booking is accepted, add to remaining patients
            if (booking.status === 'accepted') {
                addToRemainingPatients(booking.patientEmail, booking.pickupAddress);
            }
        });
        
        // Setup action buttons
        setupRequestActions();
    } catch (e) {
        console.error('Error parsing mock bookings:', e);
    }
}

/**
 * Get HTML for action buttons based on status
 * @param {string} status - The booking status
 * @returns {string} HTML for action buttons
 */
function getActionButtonsHtml(status) {
    switch (status) {
        case 'pending':
            return `
                <button class="action-btn accept-btn">Accept</button>
                <button class="action-btn reject-btn">Reject</button>
            `;
        case 'accepted':
            return `<button class="action-btn complete-btn">Complete</button>`;
        case 'completed':
        case 'rejected':
            return `<span class="completed-text">Completed</span>`;
        default:
            return '';
    }
}

/**
 * Update mock request in localStorage
 * @param {HTMLElement} row - The table row element
 * @param {string} status - The new status
 */
function updateMockRequest(row, status) {
    const email = row.cells[1].textContent;
    
    // Get mock bookings from localStorage
    const bookingsJson = localStorage.getItem('mockBookings');
    if (!bookingsJson) return;
    
    try {
        const bookings = JSON.parse(bookingsJson);
        
        // Find and update the booking
        const booking = bookings.find(b => b.patientEmail === email);
        if (booking) {
            booking.status = status;
            
            // Save updated bookings to localStorage
            localStorage.setItem('mockBookings', JSON.stringify(bookings));
        }
    } catch (e) {
        console.error('Error updating mock booking:', e);
    }
}

/**
 * Update mock driver in localStorage
 * @param {string} status - The new status
 * @param {string} reason - The reason for the status change (optional)
 */
function updateMockDriver(status, reason = '') {
    const user = window.appUtils.getCurrentUser();
    if (!user) return;
    
    // Get mock users from localStorage
    const usersJson = localStorage.getItem('mockUsers');
    if (!usersJson) return;
    
    try {
        const users = JSON.parse(usersJson);
        
        // Find and update the driver
        const driver = users.find(u => u.email === user.email);
        if (driver) {
            driver.status = status;
            if (reason) {
                driver.statusReason = reason;
            }
            
            // Save updated users to localStorage
            localStorage.setItem('mockUsers', JSON.stringify(users));
        }
    } catch (e) {
        console.error('Error updating mock driver:', e);
    }
}
