// Patient Dashboard JavaScript file for the Ambulance Booking System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize patient dashboard components
    initPatientDashboard();
});

/**
 * Initialize all patient dashboard components
 */
function initPatientDashboard() {
    // Check if user is logged in and has the correct role
    const user = window.appUtils.getCurrentUser();
    if (!user || user.role !== 'patient') {
        window.appUtils.showNotification('Please login as a patient to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    // Set user name in the dashboard
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && user.name) {
        userNameElement.textContent = user.name;
    }

    // Setup hospital search functionality
    setupHospitalSearch();

    // Setup ambulance table filtering
    setupAmbulanceFiltering();

    // Setup hospital details modal
    setupHospitalDetailsModal();

    // Setup booking modal
    setupBookingModal();

    // Load mock data
    loadMockData();
}

/**
 * Setup hospital search functionality
 */
function setupHospitalSearch() {
    const searchInput = document.getElementById('search-input');
    const locationFilter = document.getElementById('location-filter');
    const hospitalList = document.querySelector('.hospital-list');

    if (!searchInput || !locationFilter || !hospitalList) return;

    // Search by hospital name
    searchInput.addEventListener('keyup', window.appUtils.debounce(function() {
        filterHospitals();
    }, 300));

    // Filter by location
    locationFilter.addEventListener('change', function() {
        filterHospitals();
    });

    // Function to filter hospitals based on search and location
    function filterHospitals() {
        const searchTerm = searchInput.value.toLowerCase();
        const locationTerm = locationFilter.value.toLowerCase();
        const hospitalItems = hospitalList.querySelectorAll('.hospital-item');

        hospitalItems.forEach(item => {
            const hospitalName = item.querySelector('h3').textContent.toLowerCase();
            const hospitalLocation = item.querySelector('p').textContent.toLowerCase();
            
            const matchesSearch = hospitalName.includes(searchTerm);
            const matchesLocation = !locationTerm || hospitalLocation.includes(locationTerm);
            
            if (matchesSearch && matchesLocation) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

/**
 * Setup ambulance table filtering
 */
function setupAmbulanceFiltering() {
    // Setup search filter
    window.appUtils.setupTableFilter('ambulance-table', 'ambulance-search', 0);

    // Setup hospital filter
    const hospitalFilter = document.getElementById('ambulance-filter');
    const ambulanceTable = document.getElementById('ambulance-table');
    
    if (!hospitalFilter || !ambulanceTable) return;
    
    hospitalFilter.addEventListener('change', function() {
        const filterValue = this.value.toUpperCase();
        const rows = ambulanceTable.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
            const hospitalCell = rows[i].getElementsByTagName('td')[0];
            if (hospitalCell) {
                const hospitalName = hospitalCell.textContent || hospitalCell.innerText;
                if (!filterValue || hospitalName.toUpperCase() === filterValue) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }
    });

    // Setup book buttons
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                const hospitalName = row.cells[0].textContent;
                const driverName = row.cells[2].textContent;
                
                // Open booking modal with pre-filled information
                openBookingModal(hospitalName, driverName);
            });
        }
    });
}

/**
 * Setup hospital details modal
 */
function setupHospitalDetailsModal() {
    const modal = document.getElementById('hospital-modal');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const closeButton = modal.querySelector('.close-modal');
    const sendRequestBtn = document.getElementById('send-request-btn');
    
    if (!modal || !viewDetailsButtons.length || !closeButton || !sendRequestBtn) return;
    
    // Open modal when view details button is clicked
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const hospitalName = this.getAttribute('data-hospital');
            openHospitalModal(hospitalName);
        });
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
    
    // Handle send request button
    sendRequestBtn.addEventListener('click', function() {
        const hospitalName = document.getElementById('modal-hospital-name').textContent;
        window.appUtils.showNotification(`Request sent to ${hospitalName}`, 'success');
        modal.style.display = 'none';
    });
}

/**
 * Open hospital details modal with hospital information
 * @param {string} hospitalName - The name of the hospital
 */
function openHospitalModal(hospitalName) {
    const modal = document.getElementById('hospital-modal');
    const nameElement = document.getElementById('modal-hospital-name');
    const locationElement = document.getElementById('modal-hospital-location');
    const servicesElement = document.getElementById('modal-hospital-services');
    const emailElement = document.getElementById('modal-hospital-email');
    const phoneElement = document.getElementById('modal-hospital-phone');
    
    if (!modal || !nameElement || !locationElement || !servicesElement || !emailElement || !phoneElement) return;
    
    // Get hospital data from mock database
    const hospitals = getMockHospitals();
    const hospital = hospitals.find(h => h.name === hospitalName);
    
    if (hospital) {
        // Set hospital information in modal
        nameElement.textContent = hospital.name;
        locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${hospital.location}`;
        emailElement.textContent = hospital.email;
        phoneElement.textContent = hospital.phone;
        
        // Set services list
        servicesElement.innerHTML = '';
        hospital.services.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service;
            servicesElement.appendChild(li);
        });
        
        // Show modal
        modal.style.display = 'block';
    }
}

/**
 * Setup booking modal
 */
function setupBookingModal() {
    const modal = document.getElementById('booking-modal');
    const closeButton = modal.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    
    if (!modal || !closeButton || !bookingForm) return;
    
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
    
    // Handle booking form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const hospitalName = document.getElementById('booking-hospital').value;
        const driverName = document.getElementById('booking-driver').value;
        const pickupAddress = document.getElementById('booking-pickup').value;
        
        if (!pickupAddress) {
            window.appUtils.showNotification('Please enter a pickup address', 'error');
            return;
        }
        
        // In a real app, this would send the booking request to the server
        // For demo purposes, just show a success message
        window.appUtils.showNotification(`Ambulance booked successfully from ${hospitalName}`, 'success');
        
        // Close modal
        modal.style.display = 'none';
        
        // Add booking to mock database
        addMockBooking(hospitalName, driverName, pickupAddress);
    });
}

/**
 * Open booking modal with pre-filled information
 * @param {string} hospitalName - The name of the hospital
 * @param {string} driverName - The name of the driver
 */
function openBookingModal(hospitalName, driverName) {
    const modal = document.getElementById('booking-modal');
    const hospitalInput = document.getElementById('booking-hospital');
    const driverInput = document.getElementById('booking-driver');
    const pickupInput = document.getElementById('booking-pickup');
    const user = window.appUtils.getCurrentUser();
    
    if (!modal || !hospitalInput || !driverInput || !pickupInput) return;
    
    // Set pre-filled information
    hospitalInput.value = hospitalName;
    driverInput.value = driverName;
    
    // Pre-fill pickup address with user's address if available
    if (user && user.address) {
        pickupInput.value = user.address;
    } else {
        pickupInput.value = '';
    }
    
    // Show modal
    modal.style.display = 'block';
}

/**
 * Load mock data for the dashboard
 */
function loadMockData() {
    // This function would normally fetch data from an API
    // For demo purposes, we'll use mock data
}

/**
 * Get mock hospitals from localStorage or create default ones if none exist
 * @returns {Array} Array of hospital objects
 */
function getMockHospitals() {
    const hospitalsJson = localStorage.getItem('mockHospitals');
    if (hospitalsJson) {
        try {
            return JSON.parse(hospitalsJson);
        } catch (e) {
            console.error('Error parsing mock hospitals:', e);
            return getDefaultHospitals();
        }
    }
    return getDefaultHospitals();
}

/**
 * Get default mock hospitals for demonstration
 * @returns {Array} Array of default hospital objects
 */
function getDefaultHospitals() {
    const defaultHospitals = [
        {
            id: 'hos1',
            name: 'YMTS Hospital',
            location: 'Tirupati',
            email: 'info@ymts.com',
            phone: '+91 9876543200',
            services: ['Neurological', 'Maternity', 'Psychiatric']
        },
        {
            id: 'hos2',
            name: 'City General Hospital',
            location: 'Chennai',
            email: 'info@citygeneral.com',
            phone: '+91 9876543201',
            services: ['Emergency Care', 'Cardiology', 'Pediatrics']
        },
        {
            id: 'hos3',
            name: 'Metro Medical Center',
            location: 'Bangalore',
            email: 'info@metromedical.com',
            phone: '+91 9876543202',
            services: ['Orthopedics', 'Oncology', 'Neurology']
        }
    ];
    
    // Store default hospitals in localStorage
    localStorage.setItem('mockHospitals', JSON.stringify(defaultHospitals));
    
    return defaultHospitals;
}

/**
 * Add a mock booking to localStorage
 * @param {string} hospitalName - The name of the hospital
 * @param {string} driverName - The name of the driver
 * @param {string} pickupAddress - The pickup address
 */
function addMockBooking(hospitalName, driverName, pickupAddress) {
    const user = window.appUtils.getCurrentUser();
    if (!user) return;
    
    const booking = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        patientId: user.id,
        patientEmail: user.email,
        hospitalName: hospitalName,
        driverName: driverName,
        pickupAddress: pickupAddress,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Get existing bookings or initialize empty array
    const bookingsJson = localStorage.getItem('mockBookings');
    let bookings = [];
    
    if (bookingsJson) {
        try {
            bookings = JSON.parse(bookingsJson);
        } catch (e) {
            console.error('Error parsing mock bookings:', e);
        }
    }
    
    // Add new booking
    bookings.push(booking);
    
    // Store updated bookings in localStorage
    localStorage.setItem('mockBookings', JSON.stringify(bookings));
}
