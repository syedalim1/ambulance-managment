/**
 * Book Ambulance Page Functionality
 * Handles ambulance booking process, map integration, and form validation
 */
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const bookingForm = document.getElementById('booking-form');
    const pickupLocation = document.getElementById('pickup-location');
    const destination = document.getElementById('destination');
    const bookingDate = document.getElementById('booking-date');
    const bookingTime = document.getElementById('booking-time');
    const patientCondition = document.getElementById('patient-condition');
    
    // Modal elements
    const bookingModal = document.getElementById('booking-modal');
    const closeModal = document.querySelector('.close-modal');
    const bookingId = document.getElementById('booking-id');
    const bookingDateTime = document.getElementById('booking-datetime');
    const confirmPickup = document.getElementById('confirm-pickup');
    const confirmDestination = document.getElementById('confirm-destination');
    const confirmType = document.getElementById('confirm-type');
    
    // Hospital selection buttons
    const selectHospitalBtns = document.querySelectorAll('.select-hospital-btn');
    
    // Set minimum date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    bookingDate.setAttribute('min', formattedDate);
    
    // Default to today's date
    bookingDate.value = formattedDate;
    
    // Initialize map placeholder (would be replaced with actual map API)
    initMapPlaceholder();
    
    // Handle hospital selection
    selectHospitalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const hospitalName = this.getAttribute('data-hospital');
            destination.value = hospitalName;
            
            // Smooth scroll to booking form
            bookingForm.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the destination field
            destination.classList.add('highlight');
            setTimeout(() => {
                destination.classList.remove('highlight');
            }, 1500);
        });
    });
    
    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Get selected ambulance type
            const ambulanceType = document.querySelector('input[name="ambulance-type"]:checked').value;
            
            // Get selected additional services
            const additionalServices = [];
            document.querySelectorAll('input[name="additional-services"]:checked').forEach(checkbox => {
                additionalServices.push(checkbox.value);
            });
            
            // Generate random booking ID
            const randomId = 'AMB' + Math.floor(10000 + Math.random() * 90000);
            
            // Format date and time for display
            const dateObj = new Date(bookingDate.value + 'T' + bookingTime.value);
            const formattedDateTime = dateObj.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            
            // Update confirmation modal
            bookingId.textContent = randomId;
            bookingDateTime.textContent = formattedDateTime;
            confirmPickup.textContent = pickupLocation.value;
            confirmDestination.textContent = destination.value;
            confirmType.textContent = capitalizeFirstLetter(ambulanceType);
            
            // Show confirmation modal with animation
            bookingModal.style.display = 'flex';
            setTimeout(() => {
                bookingModal.classList.add('active');
            }, 10);
            
            // In a real application, you would send this data to the server
            console.log({
                bookingId: randomId,
                pickupLocation: pickupLocation.value,
                destination: destination.value,
                dateTime: dateObj,
                ambulanceType: ambulanceType,
                patientCondition: patientCondition.value,
                additionalServices: additionalServices
            });
        }
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        bookingModal.classList.remove('active');
        setTimeout(() => {
            bookingModal.style.display = 'none';
        }, 300);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('active');
            setTimeout(() => {
                bookingModal.style.display = 'none';
            }, 300);
        }
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Reset previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Validate pickup location
        if (pickupLocation.value.trim() === '') {
            showError(pickupLocation, 'Please enter pickup location');
            isValid = false;
        }
        
        // Validate destination
        if (destination.value.trim() === '') {
            showError(destination, 'Please enter destination');
            isValid = false;
        }
        
        // Validate date
        if (bookingDate.value === '') {
            showError(bookingDate, 'Please select a date');
            isValid = false;
        } else {
            const selectedDate = new Date(bookingDate.value);
            if (selectedDate < today) {
                showError(bookingDate, 'Date cannot be in the past');
                isValid = false;
            }
        }
        
        // Validate time
        if (bookingTime.value === '') {
            showError(bookingTime, 'Please select a time');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(element, message) {
        element.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
    }
    
    // Initialize map placeholder (would be replaced with actual map API)
    function initMapPlaceholder() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (mapPlaceholder) {
            // Simulate map loading
            setTimeout(() => {
                mapPlaceholder.innerHTML = `
                    <div class="map-content">
                        <div class="map-overlay">
                            <div class="map-pin" style="top: 40%; left: 30%;" title="YMTS Hospital">
                                <i class="fas fa-hospital"></i>
                            </div>
                            <div class="map-pin" style="top: 60%; left: 50%;" title="City General Hospital">
                                <i class="fas fa-hospital"></i>
                            </div>
                            <div class="map-pin" style="top: 30%; left: 70%;" title="Metro Medical Center">
                                <i class="fas fa-hospital"></i>
                            </div>
                            <div class="map-pin current-location" style="top: 50%; left: 50%;" title="Your Location">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                        </div>
                        <img src="https://maps.googleapis.com/maps/api/staticmap?center=Tirupati,India&zoom=13&size=600x400&maptype=roadmap&key=YOUR_API_KEY" alt="Map" class="static-map">
                    </div>
                `;
            }, 1000);
        }
    }
    
    // Utility function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Geolocation for current location
    if (navigator.geolocation) {
        const locationBtn = document.createElement('button');
        locationBtn.className = 'location-btn';
        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
        locationBtn.title = 'Use current location';
        
        pickupLocation.parentNode.appendChild(locationBtn);
        
        locationBtn.addEventListener('click', function() {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // In a real app, you would reverse geocode these coordinates
                    // For demo purposes, we'll just set a placeholder
                    pickupLocation.value = 'Current Location (detected)';
                    
                    // Visual feedback
                    pickupLocation.classList.add('success');
                    setTimeout(() => {
                        pickupLocation.classList.remove('success');
                    }, 1500);
                },
                function(error) {
                    console.error('Geolocation error:', error);
                    alert('Unable to retrieve your location. Please enter it manually.');
                }
            );
        });
    }
});
